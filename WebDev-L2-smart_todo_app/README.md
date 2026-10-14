# 🎯 Smart To-Do — Productivity Dashboard

A modern, responsive, and fully accessible task management dashboard built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. Designed with a clean light palette, navy typography, and vibrant blue accents to deliver an intuitive and polished productivity experience.

---

## 📁 Folder Structure

```plaintext
student_complaint_agent/
├── index.html       # Semantic HTML5 markup, ARIA roles, accessible modal, and icons
├── style.css        # CSS3 custom properties, responsive 2-column layout, and micro-animations
├── script.js        # Strict-mode Vanilla JS: modular architecture, storage, and validation
└── README.md        # Complete documentation, persistence guide, and verification checklist
```

---

## ✨ Features

1. **Modern Productivity Dashboard**:
   - Clean white/light background (`#f8fafc` / `#ffffff`), slate-navy typography (`#0f172a`), and royal blue accent (`#2563eb`).
   - Header with brand identity, total count, completion rate percentage, and an animated progress bar.
2. **Dual-List Organization**:
   - **Pending Tasks**: Displays active items with quick completion toggles, creation timestamps, and action buttons.
   - **Completed Tasks**: Displays completed items with strikethrough styling, completion timestamps, and restore capabilities.
3. **Accurate Counters**:
   - Real-time `X pending` and `Y completed` badges above each list, synced immediately after every action.
4. **Input Validation & Edge Case Handling**:
   - Blocks empty submissions and whitespace-only text with an accessible inline feedback banner.
   - Enforces unique task titles (case-insensitive duplicate detection).
   - Input character limit counter (`0/200`).
5. **Inline Task Editing**:
   - Click the edit icon to edit any task inline.
   - Save via the **Save** button or press <kbd>Enter</kbd>.
   - Cancel via the **Cancel** button or press <kbd>Escape</kbd>.
   - Validates edited titles (prevents saving empty text or duplicate names).
6. **Task Completion & Restoration**:
   - Checking a pending task moves it instantly to Completed Tasks and records a completion timestamp.
   - Unchecking a completed task restores it back to Pending Tasks and clears its completion timestamp.
7. **Safe Permanent Deletion**:
   - Accessible modal confirmation before permanently removing tasks from either list.
   - Full keyboard support (press <kbd>Escape</kbd> to cancel, <kbd>Enter</kbd> to confirm).
8. **Friendly Empty States**:
   - Custom SVG illustrations and encouraging messages when either list has no tasks.
9. **Creation & Completion Timestamps**:
   - Every task displays when it was created.
   - Completed tasks also display their exact completion date and time.
10. **Quick Search & Bulk Action**:
    - Real-time search filter across both lists.
    - "Clear Completed" button to purge all finished tasks in one click.
11. **Responsive & Accessible**:
    - Two-column layout on desktop, smoothly collapsing to a single-column layout on mobile/tablet.
    - Full keyboard navigation, visible `:focus-visible` focus rings, and WCAG AA contrast.

---

## 🚀 How to Launch the App

Because Smart To-Do is built with standard web technologies, it requires **no dependencies, bundlers, or package managers**.

### Option 1: Direct File Launch (Easiest)
1. Navigate to the project folder:
   ```plaintext
   c:\Users\User\Downloads\student_complaint_agent\
   ```
2. Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option 2: Local HTTP Server (Recommended)
You can also serve it with any local static file server:

- **Python 3**:
  ```bash
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

- **Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

- **VS Code Live Server**:
  Right-click `index.html` and select **"Open with Live Server"**.

---

## 💾 How `localStorage` Works

### Storage Key & Data Format
The app saves task objects in the browser's `localStorage` under the key:
```javascript
const STORAGE_KEY = 'smart_todo_tasks_v1';
```

Tasks are serialized as a JSON array of task objects:
```json
[
  {
    "id": "task_a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "text": "Review project proposal",
    "createdAt": 1728901234567,
    "isCompleted": false,
    "completedAt": null
  },
  {
    "id": "task_f1e2d3c4-b5a6-0987-fedc-ba9876543210",
    "text": "Draft initial technical spec",
    "createdAt": 1728900000000,
    "isCompleted": true,
    "completedAt": 1728901200000
  }
]
```

### Lifecycle & Synchronization
- **On App Load**: The `Storage.loadTasks()` function reads and parses `localStorage.getItem(STORAGE_KEY)`.
- **On Every Mutation**: Any action (Add, Edit, Toggle Completion, Delete, Clear Completed) synchronously invokes `Storage.saveTasks()`, writing the updated state back to `localStorage`.

### Resiliency & Error Recovery
- **Malformed / Corrupt Data**: If a user modifies `localStorage` with invalid JSON or damaged data, `Storage.loadTasks()` catches the exception in a `try...catch` block, logs a warning, and safely initializes with an empty array `[]` without crashing the application.
- **Item-Level Schema Validation**: Individual stored items are checked for the presence of valid `id`, `text`, `createdAt`, and `isCompleted` fields. Invalid entries are safely filtered out.
- **Quota Exceeded Handling**: If browser storage is full or disabled (e.g., restricted private mode), writes are caught safely and a user-friendly toast warning is displayed.

---

## 🧪 How to Test Persistence & Edge Cases

Follow these steps in your browser to verify persistence and edge-case resilience:

### Test 1: Adding Tasks & Page Refresh
1. Enter `Deploy landing page` in the task input and press <kbd>Enter</kbd>.
2. Notice the task immediately appears in the **Pending Tasks** list, and the pending counter displays `1 pending`.
3. Refresh the browser (<kbd>F5</kbd> or <kbd>Ctrl+R</kbd>).
4. **Result**: The task is preserved, and the counter remains `1 pending`.

### Test 2: Completing & Restoring Tasks
1. Click the checkmark circle next to `Deploy landing page`.
2. Notice the task moves to the **Completed Tasks** list with a strikethrough and a new `Completed: [Date & Time]` timestamp.
3. Refresh the browser.
4. **Result**: The task stays in the Completed list with its completion timestamp intact.
5. Click the checkmark circle again.
6. **Result**: The task returns to the Pending list, its completed timestamp is removed, and counters update instantly.

### Test 3: Inline Editing
1. Click the **Edit** (pencil) icon on any task.
2. The task title becomes an inline editable text field.
3. Change the title to `Deploy updated landing page` and press <kbd>Enter</kbd> (or click **Save**).
4. Refresh the browser.
5. **Result**: The updated title is persisted.

### Test 4: Input Validation Edge Cases
1. **Empty Submission**: Click **Add Task** without entering any text.
   - *Expected*: Feedback banner displays *"Please enter a task title. Empty or whitespace-only tasks cannot be added."*
2. **Whitespace-Only Submission**: Type three spaces `   ` and press <kbd>Enter</kbd>.
   - *Expected*: Rejected with the same friendly error message.
3. **Duplicate Task Name**: Add a task with an existing title (e.g., `Deploy updated landing page`).
   - *Expected*: Feedback banner displays *"A task with this title already exists. Please choose a unique title."*
4. **Empty Inline Edit**: Click Edit on a task, clear all characters, and click Save.
   - *Expected*: An inline alert warns *"Please enter a task title. Empty or whitespace-only tasks cannot be added."* The edit remains open until valid text is entered or Cancel is clicked.

### Test 5: Safe Deletion
1. Click the **Delete** (trash) icon on any pending or completed task.
2. A confirmation dialog appears showing the exact task name.
3. Click **Cancel** or press <kbd>Escape</kbd> -> task is preserved.
4. Click **Delete** again, then click **Delete Permanently** -> task is removed, counter updates, and a toast confirms deletion.
5. Refresh the browser -> task remains permanently deleted.

### Test 6: Corrupted Storage Recovery
1. Open Developer Tools (<kbd>F12</kbd>), navigate to **Application** &rarr; **Local Storage**.
2. Select `smart_todo_tasks_v1` and change its value to corrupted text like `{"invalid_json: true`.
3. Refresh the browser.
4. **Result**: The app loads gracefully, displays friendly empty states without throwing an unhandled exception, and logs a descriptive warning in the console.

---

## 📋 Feature Verification Checklist

| Specification Requirement | Implementation Location | Verification Status |
| :--- | :--- | :---: |
| **Clean white/light background, navy text & blue accent** | `style.css` (`:root` tokens `--bg-app: #f8fafc`, `--navy-900: #0f172a`, `--accent-blue-600: #2563eb`) | ✅ Implemented |
| **Title, short description & task-entry form** | `index.html` (`<header>`, `<h1 class="brand-title">`, `<form id="task-form">`) | ✅ Implemented |
| **Two separate lists: Pending and Completed** | `index.html` (`#pending-list`, `#completed-list`) & `script.js` (`render()`) | ✅ Implemented |
| **Accurate counters above each list (`X pending`, `Y completed`)** | `index.html` (`#pending-counter`, `#completed-counter`) & `script.js` (`render()`) | ✅ Implemented |
| **Readable title, status badge & clearly labelled action buttons** | `script.js` (`renderTaskItem()`) with `aria-label`s and visual icons | ✅ Implemented |
| **Friendly empty states with illustrations** | `index.html` (`#pending-empty`, `#completed-empty`) & `style.css` (`.empty-state`) | ✅ Implemented |
| **Responsive 2-column layout (collapses on mobile)** | `style.css` (`.dashboard-grid`, `@media (max-width: 880px)`) | ✅ Implemented |
| **Reject empty or whitespace-only tasks** | `script.js` (`Validator.validate()`, `showFormFeedback()`) | ✅ Implemented |
| **Reject duplicate task names** | `script.js` (`Validator.validate()` case-insensitive check) | ✅ Implemented |
| **Newly created tasks appear immediately in pending list** | `script.js` (`addTask()`, `state.tasks.unshift()`, `render()`) | ✅ Implemented |
| **Completion toggle moves tasks between lists** | `script.js` (`toggleTaskStatus()`, updates `isCompleted` & `completedAt`) | ✅ Implemented |
| **Inline edit title (save or cancel)** | `script.js` (`startEditTask()`, `saveEditTask()`, `cancelEditTask()`) | ✅ Implemented |
| **Reject editing to empty title** | `script.js` (`saveEditTask()` validation check & inline alert) | ✅ Implemented |
| **Permanent deletion with confirmation** | `index.html` (`#delete-modal`) & `script.js` (`requestDeleteTask()`, `confirmDeleteTask()`) | ✅ Implemented |
| **Timestamps for creation and optional completion time** | `script.js` (`formatTimestamp()`, `createdAt`, `completedAt`) | ✅ Implemented |
| **Persistent `localStorage` with error handling** | `script.js` (`Storage.loadTasks()`, `Storage.saveTasks()`) | ✅ Implemented |
| **Separate files (`index.html`, `style.css`, `script.js`, `README.md`)** | Root directory | ✅ Implemented |
| **No inline `onclick` handlers (`addEventListener` used)** | `script.js` (delegated listeners on `#pending-list`, `#completed-list`, `#task-form`) | ✅ Implemented |
| **Form reloads prevented (`e.preventDefault()`)** | `script.js` (`DOM.taskForm.addEventListener('submit', ...)`) | ✅ Implemented |
| **Accessible labels, keyboard shortcuts & visible focus rings** | `style.css` (`:focus-visible`), `index.html` (ARIA attributes, `role="dialog"`, `<kbd>`) | ✅ Implemented |

---

## 💻 Tech Stack
- **HTML5**: Semantic elements (`<header>`, `<main>`, `<section>`, `<form>`, `<dialog>`), ARIA live regions, SVG graphics.
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, Transitions, Keyframe animations, Responsive media queries.
- **JavaScript**: Vanilla ES6+, Strict Mode, `localStorage` API, `Intl.DateTimeFormat`, Event Delegation.
