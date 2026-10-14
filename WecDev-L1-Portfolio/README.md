# Muhammad Shoaib — Personal Engineering Portfolio

> **Aspiring Machine Learning Engineer | BSCS Student | AI & Data Science Enthusiast**  
> *University of Education Lahore, Multan Campus • CGPA: 3.86/4.00*

A premium, enterprise-grade personal portfolio website crafted for **Muhammad Shoaib**. Designed with a Microsoft-level dark technology aesthetic, modern Inter typography, deep navy surfaces, and electric blue/cyan accents. This site showcases authentic academic excellence, algorithmic problem solving, and hands-on AI applications.

---

## 1. Project Overview

This portfolio serves as a centralized, professional engineering showcase for internship applications, tech recruiters, hackathon organizers, and academic opportunities.

Every section strictly reflects Muhammad Shoaib's actual credentials:
- **No fabricated work experience or senior titles.**
- **No unverified certifications, medals, or deployment links.**
- **No artificial skill percentage meters.**
- **Accurate academic records:** BSCS (CGPA 3.86/4.00), FSc Pre-Engineering (917/1100), and Matriculation (1096/1100).
- **All 6 authentic projects:** Digital Notes Converter, RAG-Based AI Assistant, 8-Queen Problem Simulator, Map Coloring Problem Simulator, Mentor AI, and AI-Powered Classroom Assistant.
- **Both Academic Excellence Awards:** 3rd Position (2024–2025) and 2nd Position (2025–2026), plus participation in the VISIO Spark Debug Code Competition at COMSATS University Islamabad.

---

## 2. Key Features

- **Enterprise Design Direction:** Microsoft-style dark navy/near-black theme (`#060913`, `#0b1120`, `#10192e`) with electric blue and cyan accent gradients.
- **Responsive Navigation:** Fixed navigation bar with dynamic backdrop blur, scroll-spy section tracking, and accessible mobile drawer with keyboard navigation.
- **Interactive Project Showcase:** 6 project cards with category filters (All, AI & RAG, Simulators & Algorithms, Educational Tools) and detailed modal dialogs breaking down architecture, features, and verified technologies.
- **Honest Link Placeholders:** Pre-configured project action handlers that notify visitors gracefully if a repository or demo link is pending publication, preventing broken 404 navigation.
- **Academic Timeline:** Polished vertical education timeline with distinct milestone nodes, dates, locations, and verified academic grades.
- **Categorized Technical Skills:** Interactive tabbed grid dividing competencies into Programming & Development, AI & Problem Solving, and Professional Skills with clear SVG icons.
- **Honest Skill Disclaimer:** Prominently highlights that skills represent hands-on project coursework without arbitrary ratings.
- **Honors & Competitions:** Dedicated achievement cards highlighting departmental awards and competitive programming participation.
- **Functional Contact Suite:** Clickable `tel:` and `mailto:` links, one-click email clipboard copy with toast notification, and a client-validated contact form with direct mailto client fallback.
- **Smart CV Download System:** Automatically verifies if `assets/Muhammad_Shoaib_CV.pdf` is present for direct download; if pending, opens a helpful guidance modal with a clean print/save web CV feature.
- **Full Accessibility (WCAG AA):** Semantic HTML5 landmarks, ARIA modal dialogs, focus trapping, screen-reader skip link, and strict respect for `prefers-reduced-motion`.

---

## 3. Technology Stack

- **HTML5:** Semantic architecture (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>`).
- **CSS3:** Custom CSS variables (design tokens), CSS Grid, Flexbox, media queries, keyframe animations, and print stylesheets.
- **Vanilla JavaScript (ES6+):** Zero third-party runtime dependencies, fast execution, lightweight event delegation, and real-time form validation.
- **Typography:** Google Fonts (`Inter` for headings/body, `JetBrains Mono` for tech chips and code labels).
- **Icons:** Sharp, scalable inline SVGs for fast loading without external font or CDN latency.

---

## 4. File Structure

```text
portfolio/
├── index.html          # Semantic HTML5 page structure and accessible markup
├── style.css           # Microsoft dark enterprise design system and responsive styles
├── script.js           # Vanilla JavaScript for navigation, modals, filters, and form
├── README.md           # Documentation, local setup, and requirement mapping
├── assets/             # Media and document directory
│   ├── README.md       # Guidance for placing Muhammad_Shoaib_CV.pdf and profile.jpg
│   └── Muhammad_Shoaib_CV.pdf  # (Optional: Drop your real CV PDF here)
└── screenshots/        # Visual documentation captures
    └── README.md       # Suggested screenshot guidelines
```

---

## 5. Instructions to Run Locally

### Option A: VS Code Live Server (Recommended)
1. Open the `portfolio/` folder in Visual Studio Code:
   ```bash
   code portfolio
   ```
2. Install the **Live Server** extension by Ritwick Dey (if not already installed).
3. Right-click on `index.html` and select **"Open with Live Server"** (or click **Go Live** in the bottom status bar).
4. The website will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option B: Python Local Server
Run a lightweight HTTP server using Python:
```bash
# Navigate to the portfolio folder
cd portfolio

# Launch local server (Python 3)
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Option C: Direct Browser Opening
Double-click `index.html` directly to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave.

---

## 6. How to Customize and Update Credentials

### 1. Adding Your Real Profile Photograph
1. Save your professional square photograph as `profile.jpg` or `profile.png`.
2. Move it into the `portfolio/assets/` directory:
   ```text
   portfolio/assets/profile.jpg
   ```
3. The JavaScript script automatically detects the file and replaces the default monogram avatar with your photo, keeping the cyan tech border and CGPA badge intact.

### 2. Enabling Direct CV PDF Download
1. Export your latest resume as a PDF.
2. Name the file `Muhammad_Shoaib_CV.pdf`.
3. Place it in `portfolio/assets/`:
   ```text
   portfolio/assets/Muhammad_Shoaib_CV.pdf
   ```
4. Clicking **"Download CV"** anywhere on the website will now automatically trigger an immediate browser file download.

### 3. Adding Real GitHub & LinkedIn Profile Links
In `portfolio/index.html` (lines ~545–560), update the `href` attributes:
```html
<!-- GitHub Profile -->
<a href="https://github.com/your-actual-username" target="_blank" rel="noopener noreferrer" class="social-btn github-btn">

<!-- LinkedIn Profile -->
<a href="https://linkedin.com/in/your-actual-profile" target="_blank" rel="noopener noreferrer" class="social-btn linkedin-btn">
```

### 4. Adding Project Repository & Live Demo URLs
Open `portfolio/script.js` and locate `PROJECT_REGISTRY`. Fill in the `repoUrl` and `demoUrl` fields:
```javascript
'notes-converter': {
  // ...
  repoUrl: 'https://github.com/MuhammadShoaib/digital-notes-converter',
  demoUrl: 'https://notes-converter.streamlit.app'
},
'rag-assistant': {
  // ...
  repoUrl: 'https://github.com/MuhammadShoaib/rag-ai-assistant',
  demoUrl: 'https://rag-assistant-demo.vercel.app'
}
```

---

## 7. Requirement-to-Feature Checklist

| # | Specification / Requirement | Implemented Feature & Location | Status |
|---|---|---|---|
| **1** | **Tech Stack** | HTML5, CSS3, Vanilla JS, Inter Google font, inline SVGs; no React/Bootstrap/Tailwind; separate organized files. | ✅ Complete |
| **2** | **Design Direction** | Microsoft-level dark enterprise theme; deep navy (`#060913`, `#0b1120`, `#10192e`); electric blue & cyan accents; Inter font; restrained shadows. | ✅ Complete |
| **3** | **Navigation Bar** | Sticky header with brand monogram; Home, About, Education, Skills, Projects, Achievements, Contact links; Download CV button; mobile drawer. | ✅ Complete |
| **4** | **Hero Section** | Exact headline: "Aspiring Machine Learning Engineer", BSCS Student & AI enthusiast, phone `03043952011`, email `shoaibbhatti1838@gmail.com`, Muzaffargarh; exact quote; monogram card; CTAs. | ✅ Complete |
| **5** | **About Me Section** | Authentic student tone; AI, ML, Data Science, Software Dev, EdTech; University of Education Lahore, CGPA 3.86/4.00, Muzaffargarh. | ✅ Complete |
| **6** | **Education Section** | Vertical timeline; BSCS (Aug 2024–Present, CGPA 3.86/4.00); FSc Pre-Eng (2021–2023, 917/1100); Matriculation (2019–2021, 1096/1100). | ✅ Complete |
| **7** | **Technical Skills** | 3 categories (Programming, AI & Problem Solving, Professional); honest representation; no fabricated percentages; verified project skills separated. | ✅ Complete |
| **8** | **Featured Projects** | 6 exact projects (Digital Notes Converter, RAG Assistant, 8-Queen, Map Coloring, Mentor AI, Classroom Assistant); deep-dive modals; honest link handlers. | ✅ Complete |
| **9** | **Achievements** | 3rd Position BSCS (2024–2025), 2nd Position BSCS (2025–2026), VISIO Spark Debug Code Competition (COMSATS Wah, Nov 2025) truthful participation. | ✅ Complete |
| **10** | **Interests** | AI, Machine Learning, Data Science, Software Development, Educational Technology in a clean secondary area. | ✅ Complete |
| **11** | **Languages** | English (Professional Working), Urdu (Native), Saraiki (Elementary) with progress-free badges. | ✅ Complete |
| **12** | **Contact Section** | Phone (`tel:`), Email (`mailto:`), copy button, location, editable LinkedIn/GitHub, validated form with clear message & mailto fallback. | ✅ Complete |
| **13** | **Footer** | Muhammad Shoaib, Aspiring ML Engineer, quick links, dynamic year via JS, verified contact links, professional closing statement. | ✅ Complete |
| **14** | **Responsiveness & Accessibility** | Mobile (375px+), tablet, laptop, desktop; CSS Grid & Flexbox; WCAG AA contrast; focus rings; skip link; `prefers-reduced-motion`. | ✅ Complete |
| **15** | **Code Quality & Performance** | Pure semantic code, CSS custom properties, zero broken console errors, print stylesheet. | ✅ Complete |
| **16** | **Project Structure** | `portfolio/` containing `index.html`, `style.css`, `script.js`, `README.md`, `assets/`, `screenshots/`. | ✅ Complete |

---

## 8. License & Attribution

Designed and built exclusively for **Muhammad Shoaib**. All project descriptions and academic credentials reflect official university records.
