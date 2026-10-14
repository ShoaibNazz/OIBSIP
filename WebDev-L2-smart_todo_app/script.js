/**
 * Smart To-Do Web Application
 * Modern Vanilla JavaScript implementation with robust state management,
 * safe localStorage persistence, input validation, and full accessibility.
 */

'use strict';

(function () {
  // ==========================================================================
  // 1. CONSTANTS & CONFIGURATION
  // ==========================================================================
  const STORAGE_KEY = 'smart_todo_tasks_v1';
  const MAX_TASK_LENGTH = 200;

  // ==========================================================================
  // 2. DOM ELEMENT REFERENCES
  // ==========================================================================
  const DOM = {
    // Form & Inputs
    taskForm: document.getElementById('task-form'),
    taskInput: document.getElementById('task-input'),
    addTaskBtn: document.getElementById('add-task-btn'),
    charCounter: document.getElementById('input-char-counter'),
    formFeedback: document.getElementById('form-feedback'),

    // Search & Toolbar
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
    exportTasksBtn: document.getElementById('export-tasks-btn'),
    importTasksFile: document.getElementById('import-tasks-file'),

    // Lists & Empty States
    pendingList: document.getElementById('pending-list'),
    completedList: document.getElementById('completed-list'),
    pendingEmpty: document.getElementById('pending-empty'),
    completedEmpty: document.getElementById('completed-empty'),

    // Counters & Stats
    pendingCounter: document.getElementById('pending-counter'),
    completedCounter: document.getElementById('completed-counter'),
    totalStat: document.getElementById('total-stat'),
    rateStat: document.getElementById('rate-stat'),
    progressBarFill: document.getElementById('progress-bar-fill'),

    // Modal
    deleteModal: document.getElementById('delete-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalDesc: document.getElementById('modal-desc'),
    modalTaskName: document.getElementById('modal-task-name'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    modalConfirmBtn: document.getElementById('modal-confirm-btn'),

    // Toast
    toastRegion: document.getElementById('toast-region'),
  };

  // ==========================================================================
  // 3. APPLICATION STATE
  // ==========================================================================
  const state = {
    tasks: [],
    editingTaskId: null,
    editingError: null,
    pendingDeleteTaskId: null,
    isClearingAllCompleted: false,
    searchQuery: '',
    lastFocusedElement: null,
  };

  // ==========================================================================
  // 4. STORAGE MODULE (Safely handles missing or malformed data)
  // ==========================================================================
  const Storage = {
    /**
     * Safely reads and validates tasks from localStorage.
     * Recovers with an empty array if storage is empty, corrupted, or invalid.
     * @returns {Array<Object>} List of valid task objects
     */
    loadTasks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          console.warn('[Smart To-Do] Stored tasks is not an array, resetting to empty.');
          return [];
        }

        // Validate individual task items to sanitize malformed entries
        const validTasks = parsed.filter((item) => {
          return (
            item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.text === 'string' &&
            typeof item.isCompleted === 'boolean' &&
            typeof item.createdAt === 'number'
          );
        });

        return validTasks;
      } catch (error) {
        console.error('[Smart To-Do] Failed to read from localStorage:', error);
        return [];
      }
    },

    /**
     * Safely writes tasks array to localStorage.
     * @param {Array<Object>} tasks
     */
    saveTasks(tasks) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('[Smart To-Do] Failed to persist tasks to localStorage:', error);
        showToast('Storage quota exceeded or disabled. Changes may not persist.', 'warning');
      }
    },
  };

  // ==========================================================================
  // 5. VALIDATION MODULE
  // ==========================================================================
  const Validator = {
    /**
     * Validates task text against empty/whitespace constraints and duplicates.
     * @param {string} rawText - Input string to validate
     * @param {string|null} excludeTaskId - ID to exclude for duplicate check (when editing)
     * @returns {{ isValid: boolean, message: string, cleanText: string }}
     */
    validate(rawText, excludeTaskId = null) {
      if (typeof rawText !== 'string') {
        return { isValid: false, message: 'Invalid task input.', cleanText: '' };
      }

      const cleanText = rawText.trim();

      // Check 1: Empty or whitespace-only
      if (cleanText.length === 0) {
        return {
          isValid: false,
          message: 'Please enter a task title. Empty or whitespace-only tasks cannot be added.',
          cleanText: '',
        };
      }

      // Check 2: Max length boundary
      if (cleanText.length > MAX_TASK_LENGTH) {
        return {
          isValid: false,
          message: `Task title is too long (maximum ${MAX_TASK_LENGTH} characters).`,
          cleanText,
        };
      }

      // Check 3: Duplicate title check (case-insensitive)
      const isDuplicate = state.tasks.some((task) => {
        if (excludeTaskId && task.id === excludeTaskId) return false;
        return task.text.toLowerCase() === cleanText.toLowerCase();
      });

      if (isDuplicate) {
        return {
          isValid: false,
          message: 'A task with this title already exists. Please choose a unique title.',
          cleanText,
        };
      }

      return { isValid: true, message: '', cleanText };
    },
  };

  // ==========================================================================
  // 6. HELPER UTILITIES
  // ==========================================================================

  /**
   * Generates a collision-resistant unique ID.
   */
  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `task_${crypto.randomUUID()}`;
    }
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Sanitizes text to prevent Cross-Site Scripting (XSS).
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Formats a unix timestamp into a readable date & time string.
   * @param {number} timestamp
   * @returns {string} e.g. "Oct 14, 2026, 5:23 PM"
   */
  function formatTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'number') return 'Unknown';
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return new Date(timestamp).toLocaleString();
    }
  }

  /**
   * Displays an accessible toast message.
   * @param {string} message
   * @param {'success'|'info'|'warning'} type
   */
  function showToast(message, type = 'info') {
    if (!DOM.toastRegion) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
    DOM.toastRegion.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }

  /**
   * Displays feedback banner above or below the main form.
   */
  function showFormFeedback(message, type = 'error') {
    if (!DOM.formFeedback) return;
    DOM.formFeedback.textContent = message;
    DOM.formFeedback.className = `feedback-banner feedback-${type}`;
    DOM.formFeedback.hidden = false;
    DOM.taskInput.classList.add('input-error');
  }

  /**
   * Clears the main form feedback banner.
   */
  function clearFormFeedback() {
    if (!DOM.formFeedback) return;
    DOM.formFeedback.textContent = '';
    DOM.formFeedback.hidden = true;
    DOM.taskInput.classList.remove('input-error');
  }

  // ==========================================================================
  // 7. TASK ACTIONS / CONTROLLERS
  // ==========================================================================

  /**
   * Adds a new task to the pending list.
   * @param {string} rawText
   */
  function addTask(rawText) {
    const validation = Validator.validate(rawText);

    if (!validation.isValid) {
      showFormFeedback(validation.message, 'error');
      DOM.taskInput.focus();
      return;
    }

    clearFormFeedback();

    const newTask = {
      id: generateId(),
      text: validation.cleanText,
      createdAt: Date.now(),
      isCompleted: false,
      completedAt: null,
    };

    // Add to beginning of tasks array
    state.tasks.unshift(newTask);
    Storage.saveTasks(state.tasks);

    // Reset input field
    DOM.taskInput.value = '';
    updateCharCounter();
    DOM.taskInput.focus();

    render();
    showToast('Task added to Pending list.', 'success');
  }

  /**
   * Toggles task completion between Pending and Completed.
   * @param {string} taskId
   */
  function toggleTaskStatus(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? Date.now() : null;

    // If task was currently in edit mode, exit edit mode
    if (state.editingTaskId === taskId) {
      state.editingTaskId = null;
      state.editingError = null;
    }

    Storage.saveTasks(state.tasks);
    render();

    if (task.isCompleted) {
      showToast('Task marked as Completed!', 'success');
    } else {
      showToast('Task restored to Pending list.', 'info');
    }
  }

  /**
   * Activates inline editing mode for a specific task.
   * @param {string} taskId
   */
  function startEditTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    state.editingTaskId = taskId;
    state.editingError = null;
    render();

    // Focus the inline input element
    const editInput = document.getElementById(`inline-edit-input-${taskId}`);
    if (editInput) {
      editInput.focus();
      // Place cursor at the end of input
      const len = editInput.value.length;
      editInput.setSelectionRange(len, len);
    }
  }

  /**
   * Cancels inline editing mode without saving changes.
   */
  function cancelEditTask() {
    state.editingTaskId = null;
    state.editingError = null;
    render();
  }

  /**
   * Validates and saves an edited task title.
   * @param {string} taskId
   * @param {string} newText
   */
  function saveEditTask(taskId, newText) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Validate new text, excluding current task id for duplicate check
    const validation = Validator.validate(newText, taskId);

    if (!validation.isValid) {
      state.editingError = validation.message;
      render();

      const editInput = document.getElementById(`inline-edit-input-${taskId}`);
      if (editInput) {
        editInput.focus();
      }
      return;
    }

    // Update text
    task.text = validation.cleanText;
    state.editingTaskId = null;
    state.editingError = null;

    Storage.saveTasks(state.tasks);
    render();
    showToast('Task updated successfully.', 'success');
  }

  /**
   * Prepares and opens confirmation modal before permanent deletion.
   * @param {string} taskId
   */
  function requestDeleteTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    state.isClearingAllCompleted = false;
    state.pendingDeleteTaskId = taskId;
    state.lastFocusedElement = document.activeElement;

    if (DOM.modalTitle) DOM.modalTitle.textContent = 'Delete Task';
    if (DOM.modalDesc) DOM.modalDesc.textContent = 'Are you sure you want to delete this task? This action cannot be undone.';
    DOM.modalTaskName.textContent = task.text;
    DOM.deleteModal.hidden = false;
    DOM.modalConfirmBtn.focus();
  }

  /**
   * Closes the delete confirmation modal.
   */
  function closeDeleteModal() {
    state.pendingDeleteTaskId = null;
    state.isClearingAllCompleted = false;
    DOM.deleteModal.hidden = true;
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }

  /**
   * Confirms permanent deletion of the targeted task or clearing completed tasks.
   */
  function confirmDeleteTask() {
    if (state.isClearingAllCompleted) {
      const completedCount = state.tasks.filter((t) => t.isCompleted).length;
      state.tasks = state.tasks.filter((t) => !t.isCompleted);
      Storage.saveTasks(state.tasks);
      showToast(`Cleared ${completedCount} completed task(s).`, 'success');
      closeDeleteModal();
      render();
      return;
    }

    const taskId = state.pendingDeleteTaskId;
    if (!taskId) return;

    const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      state.tasks.splice(taskIndex, 1);
      Storage.saveTasks(state.tasks);
      showToast('Task permanently deleted.', 'info');
    }

    closeDeleteModal();
    render();
  }

  /**
   * Prompts accessible modal to clear all completed tasks.
   */
  function clearAllCompleted() {
    const completedCount = state.tasks.filter((t) => t.isCompleted).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear.', 'info');
      return;
    }

    state.isClearingAllCompleted = true;
    state.pendingDeleteTaskId = null;
    state.lastFocusedElement = document.activeElement;

    if (DOM.modalTitle) DOM.modalTitle.textContent = 'Clear Completed Tasks';
    if (DOM.modalDesc) DOM.modalDesc.textContent = 'Are you sure you want to permanently clear all completed tasks? This action cannot be undone.';
    DOM.modalTaskName.textContent = `${completedCount} completed task(s)`;
    DOM.deleteModal.hidden = false;
    DOM.modalConfirmBtn.focus();
  }

  /**
   * Exports all tasks as a formatted JSON file.
   */
  function exportTasks() {
    if (state.tasks.length === 0) {
      showToast('No tasks to export.', 'info');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.tasks, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `smart_todo_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Tasks exported to JSON file.', 'success');
  }

  /**
   * Imports tasks from an uploaded JSON file.
   * @param {File} file
   */
  function importTasks(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          showToast('Invalid JSON file. Expected an array of tasks.', 'warning');
          return;
        }

        let addedCount = 0;
        imported.forEach((item) => {
          if (item && typeof item.text === 'string') {
            const clean = item.text.trim();
            if (clean && !state.tasks.some((t) => t.text.toLowerCase() === clean.toLowerCase())) {
              state.tasks.push({
                id: generateId(),
                text: clean,
                createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
                isCompleted: Boolean(item.isCompleted),
                completedAt: typeof item.completedAt === 'number' ? item.completedAt : null,
              });
              addedCount++;
            }
          }
        });

        Storage.saveTasks(state.tasks);
        render();
        showToast(`Successfully imported ${addedCount} new task(s).`, 'success');
      } catch (err) {
        showToast('Error parsing JSON backup file.', 'warning');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // 8. RENDERING ENGINE
  // ==========================================================================

  /**
   * Generates HTML markup for a single task item.
   * @param {Object} task
   * @returns {string} HTML string
   */
  function renderTaskItem(task) {
    const isEditing = state.editingTaskId === task.id;
    const isCompleted = task.isCompleted;

    if (isEditing) {
      // Inline edit mode markup
      return `
        <li class="task-item is-editing" id="item-${task.id}" data-task-id="${task.id}">
          <div class="inline-edit-box">
            <label for="inline-edit-input-${task.id}" class="visually-hidden">Edit task title</label>
            <input 
              type="text" 
              id="inline-edit-input-${task.id}" 
              class="inline-edit-input ${state.editingError ? 'input-error' : ''}" 
              value="${escapeHTML(task.text)}" 
              maxlength="${MAX_TASK_LENGTH}"
              aria-label="Edit task title"
              data-task-id="${task.id}"
            >
            ${
              state.editingError
                ? `<div class="inline-edit-error" role="alert">${escapeHTML(state.editingError)}</div>`
                : ''
            }
            <div class="inline-edit-actions">
              <span class="inline-edit-hint">Press <kbd>Enter</kbd> to save, <kbd>Esc</kbd> to cancel</span>
              <div class="inline-edit-buttons">
                <button type="button" class="btn btn-sm btn-secondary" data-action="cancel-edit" data-task-id="${task.id}">
                  Cancel
                </button>
                <button type="button" class="btn btn-sm btn-primary" data-action="save-edit" data-task-id="${task.id}">
                  Save
                </button>
              </div>
            </div>
          </div>
        </li>
      `;
    }

    // Normal task card markup
    const createdDateStr = formatTimestamp(task.createdAt);
    const completedDateStr = task.completedAt ? formatTimestamp(task.completedAt) : null;
    const toggleAriaLabel = isCompleted
      ? `Mark "${escapeHTML(task.text)}" as pending`
      : `Mark "${escapeHTML(task.text)}" as completed`;

    return `
      <li class="task-item ${isCompleted ? 'is-completed' : ''}" id="item-${task.id}" data-task-id="${task.id}">
        <div class="task-content-row">
          <!-- Toggle Checkbox Button -->
          <button 
            type="button" 
            class="task-toggle-btn" 
            data-action="toggle" 
            data-task-id="${task.id}"
            aria-label="${toggleAriaLabel}"
            title="${isCompleted ? 'Mark as pending' : 'Mark as completed'}"
          >
            <span class="checkbox-visual" aria-hidden="true">
              <svg class="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </button>

          <!-- Task Details & Timestamps -->
          <div class="task-details">
            <h3 class="task-title">${escapeHTML(task.text)}</h3>
            <div class="task-meta">
              <span class="status-badge-inline ${isCompleted ? 'status-badge-completed' : 'status-badge-pending'}">
                ${isCompleted ? 'Completed' : 'Pending'}
              </span>
              <span class="task-meta-item" title="Created on ${createdDateStr}">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Created: ${createdDateStr}</span>
              </span>
              ${
                completedDateStr
                  ? `
                <span class="task-meta-item" title="Completed on ${completedDateStr}">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Completed: ${completedDateStr}</span>
                </span>
                `
                  : ''
              }
            </div>
          </div>

          <!-- Actions: Edit & Delete -->
          <div class="task-actions">
            <button 
              type="button" 
              class="action-btn edit-btn" 
              data-action="edit" 
              data-task-id="${task.id}"
              aria-label="Edit title for ${escapeHTML(task.text)}"
              title="Edit task"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button 
              type="button" 
              class="action-btn delete-btn" 
              data-action="delete" 
              data-task-id="${task.id}"
              aria-label="Delete task: ${escapeHTML(task.text)}"
              title="Delete task"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </li>
    `;
  }

  /**
   * Filters and renders both Pending and Completed lists, updating counters and empty states.
   */
  function render() {
    const query = state.searchQuery.trim().toLowerCase();

    // Filter tasks if search query exists
    const filteredTasks = state.tasks.filter((task) => {
      if (!query) return true;
      return task.text.toLowerCase().includes(query);
    });

    const pendingTasks = filteredTasks.filter((t) => !t.isCompleted);
    const completedTasks = filteredTasks.filter((t) => t.isCompleted);

    // Actual total counts (independent of search query for persistent accuracy)
    const totalPendingCount = state.tasks.filter((t) => !t.isCompleted).length;
    const totalCompletedCount = state.tasks.filter((t) => t.isCompleted).length;
    const totalCount = state.tasks.length;

    // 1. Update counters above lists
    DOM.pendingCounter.textContent = `${totalPendingCount} pending`;
    DOM.completedCounter.textContent = `${totalCompletedCount} completed`;

    // 2. Update Header Overview Metrics
    DOM.totalStat.textContent = totalCount;
    const completionRate = totalCount === 0 ? 0 : Math.round((totalCompletedCount / totalCount) * 100);
    DOM.rateStat.textContent = `${completionRate}%`;
    DOM.progressBarFill.style.width = `${completionRate}%`;
    DOM.progressBarFill.parentElement.setAttribute('aria-valuenow', completionRate);

    // 3. Render Pending List
    if (pendingTasks.length === 0) {
      DOM.pendingList.innerHTML = '';
      DOM.pendingEmpty.hidden = false;
      if (query && totalPendingCount > 0) {
        DOM.pendingEmpty.querySelector('.empty-title').textContent = 'No matching pending tasks';
        DOM.pendingEmpty.querySelector('.empty-description').textContent =
          `No pending tasks match "${escapeHTML(query)}". Try clearing your search.`;
      } else {
        DOM.pendingEmpty.querySelector('.empty-title').textContent = 'All caught up!';
        DOM.pendingEmpty.querySelector('.empty-description').textContent =
          'You have no pending tasks on your plate. Enjoy your free time or add a new task above to stay productive.';
      }
    } else {
      DOM.pendingEmpty.hidden = true;
      DOM.pendingList.innerHTML = pendingTasks.map(renderTaskItem).join('');
    }

    // 4. Render Completed List
    if (completedTasks.length === 0) {
      DOM.completedList.innerHTML = '';
      DOM.completedEmpty.hidden = false;
      if (query && totalCompletedCount > 0) {
        DOM.completedEmpty.querySelector('.empty-title').textContent = 'No matching completed tasks';
        DOM.completedEmpty.querySelector('.empty-description').textContent =
          `No completed tasks match "${escapeHTML(query)}".`;
      } else {
        DOM.completedEmpty.querySelector('.empty-title').textContent = 'No completed tasks yet';
        DOM.completedEmpty.querySelector('.empty-description').textContent =
          'When you complete tasks from your pending list, they will appear here with completion timestamps to track your momentum.';
      }
    } else {
      DOM.completedEmpty.hidden = true;
      DOM.completedList.innerHTML = completedTasks.map(renderTaskItem).join('');
    }

    // 5. Update Clear Completed button state
    DOM.clearCompletedBtn.disabled = totalCompletedCount === 0;
    DOM.clearCompletedBtn.style.opacity = totalCompletedCount === 0 ? '0.5' : '1';
    DOM.clearCompletedBtn.style.pointerEvents = totalCompletedCount === 0 ? 'none' : 'auto';
  }

  /**
   * Updates the character counter element in real-time.
   */
  function updateCharCounter() {
    const len = DOM.taskInput.value.length;
    DOM.charCounter.textContent = `${len}/${MAX_TASK_LENGTH}`;
    if (len >= MAX_TASK_LENGTH) {
      DOM.charCounter.style.color = 'var(--color-danger-btn)';
    } else {
      DOM.charCounter.style.color = 'var(--navy-400)';
    }
  }

  // ==========================================================================
  // 9. EVENT LISTENERS & DELEGATION
  // ==========================================================================

  /**
   * Main task creation form submission handler.
   */
  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(DOM.taskInput.value);
  });

  /**
   * Task input typing & validation clearing.
   */
  DOM.taskInput.addEventListener('input', () => {
    updateCharCounter();
    if (DOM.formFeedback.hidden === false) {
      clearFormFeedback();
    }
  });

  /**
   * Search input handler.
   */
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    DOM.clearSearchBtn.hidden = state.searchQuery.length === 0;
    render();
  });

  /**
   * Clear search button handler.
   */
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.clearSearchBtn.hidden = true;
    DOM.searchInput.focus();
    render();
  });

  /**
   * Clear all completed tasks handler.
   */
  DOM.clearCompletedBtn.addEventListener('click', clearAllCompleted);

  /**
   * Export tasks to JSON backup handler.
   */
  if (DOM.exportTasksBtn) {
    DOM.exportTasksBtn.addEventListener('click', exportTasks);
  }

  /**
   * Import tasks from JSON backup handler.
   */
  if (DOM.importTasksFile) {
    DOM.importTasksFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importTasks(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  /**
   * Delegated click handler for both lists (Pending & Completed).
   */
  function handleListClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const taskId = target.getAttribute('data-task-id');
    if (!taskId) return;

    switch (action) {
      case 'toggle':
        toggleTaskStatus(taskId);
        break;
      case 'edit':
        startEditTask(taskId);
        break;
      case 'cancel-edit':
        cancelEditTask();
        break;
      case 'save-edit': {
        const input = document.getElementById(`inline-edit-input-${taskId}`);
        if (input) saveEditTask(taskId, input.value);
        break;
      }
      case 'delete':
        requestDeleteTask(taskId);
        break;
    }
  }

  DOM.pendingList.addEventListener('click', handleListClick);
  DOM.completedList.addEventListener('click', handleListClick);

  /**
   * Delegated keydown handler for inline editing inputs (Enter to save, Esc to cancel).
   */
  function handleListKeyDown(e) {
    if (e.target.classList.contains('inline-edit-input')) {
      const taskId = e.target.getAttribute('data-task-id');
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEditTask(taskId, e.target.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEditTask();
      }
    }
  }

  DOM.pendingList.addEventListener('keydown', handleListKeyDown);
  DOM.completedList.addEventListener('keydown', handleListKeyDown);

  /**
   * Modal Dialog Events: Cancel, Confirm, Outside click & Escape key.
   */
  DOM.modalCancelBtn.addEventListener('click', closeDeleteModal);
  DOM.modalConfirmBtn.addEventListener('click', confirmDeleteTask);

  DOM.deleteModal.addEventListener('click', (e) => {
    if (e.target === DOM.deleteModal) {
      closeDeleteModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !DOM.deleteModal.hidden) {
      closeDeleteModal();
    }
  });

  // ==========================================================================
  // 10. INITIALIZATION
  // ==========================================================================
  function init() {
    // 1. Load tasks safely from localStorage
    state.tasks = Storage.loadTasks();

    // 2. Render initial view
    render();
    updateCharCounter();

    // 3. Focus task input for immediate productivity
    DOM.taskInput.focus();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
