# CVCraft — Free CV & Resume Builder

> A complete, responsive, client-side web application for creating ATS-friendly resumes and CVs with real-time live preview and instant PDF export. Built with pure HTML5, CSS3, and vanilla JavaScript.

![CVCraft](assets/logo.svg)

---

## 🌟 Features

- **Split-Screen Live Editor**: Form controls on the left with instant, synchronized live preview on a realistic A4 document on the right.
- **Mobile Optimized**: Responsive stacking layout with an intuitive tab switcher between *Edit Form* and *Live Preview*.
- **4 Distinct Resume Templates**:
  - **Modern Clean**: Contemporary accent styling with left-border indicators and skill badges.
  - **Classic Executive**: Centered formal layout with serif typography and full-width dividers for legal, corporate, and finance roles.
  - **Minimalist Swiss**: Understated Scandinavian typography, wide letter-spacing, and maximum whitespace.
  - **Student & Graduate**: Prioritizes education, GPA/honors, academic projects, and technical proficiencies before general work history.
- **Dynamic Repeaters**:
  - Add, edit, delete, and reorder (↑/↓) repeated entries for Work Experience, Education, Projects, Certifications, and Languages.
  - Optional sections (Honors & Awards, Volunteer Experience) can be toggled on and off at will.
- **Curated Customization Toolbar**:
  - Live template switcher.
  - Curated color swatches (Indigo, Navy, Cyan, Emerald, Rose, Slate) plus custom hex color picker.
  - Font pairings (Inter, Merriweather, Roboto, Georgia).
  - Line-height spacing density controls (Compact, Standard, Relaxed).
  - Zoom controls (Zoom In, Zoom Out, Fit).
- **Client-Side Privacy & Autosave**:
  - 100% private. Zero backend databases or external transmission of your sensitive career information.
  - Automatically saves drafts to browser `localStorage` with real-time status timestamp indicators.
  - One-click *Save Draft*, *Load Sample CV*, and *Clear All* (with confirmation modal).
- **High-Fidelity PDF Export & Native Print**:
  - Client-side A4 vector/canvas PDF generation using `html2pdf.js`.
  - Automatic fallback to browser's high-definition Print-to-PDF (`window.print()`).
  - Specialized `@media print` rules hiding editor UI and enforcing clean page-break boundaries.
- **Pre-Loaded Field-Tested CV Profiles**:
  - Senior Full-Stack Engineer
  - Computer Science Graduate
  - Director of Growth & Marketing
  - Lead Systems Architect

---

## 📁 Project Structure

```text
Cv maker/
│
├── index.html              # Homepage with hero, workflow, templates, features, FAQs
├── builder.html            # Split-screen CV Builder with live editor and A4 preview
├── templates.html          # Detailed templates gallery with 1-click builder launch
├── examples.html           # 4 field-tested resume profiles with "Load to Builder" buttons
├── tips.html               # Practical CV writing guides (XYZ formula, ATS tips, pitfalls)
├── about.html              # Transparent project background and privacy architecture
├── contact.html            # Contact page with functional mailto and placeholder
├── privacy-policy.html     # Truthful client-side data handling policy
├── terms.html              # Sensible usage terms and candidate ownership statement
│
├── css/
│   └── style.css           # SaaS design system, responsive grid, template themes & print styles
│
├── js/
│   ├── main.js             # Navigation drawer, toast notifications, accordions, XSS escaping
│   ├── templates.js        # Template metadata, sample profiles, and safe HTML renderer
│   └── builder.js          # Reactive state, dynamic repeaters, localStorage autosave & PDF engine
│
├── assets/
│   ├── logo.svg            # Vector brand logo
│   └── favicon.svg         # Favicon icon
│
├── vercel.json             # Configuration for instant zero-config Vercel deployment
├── local-server.js         # Optional local development server script
└── README.md               # Documentation and deployment guide
```

---

## ⚡ How to Deploy to Vercel (1-Click)

1. Upload the files or push to your GitHub repository.
2. In Vercel, click **Add New Project** and select your repository.
3. Leave all build settings at default (Framework Preset: **Other**, Build Command: empty, Output Directory: empty).
4. Click **Deploy**. Vercel will immediately deploy it on its global CDN edge network!


---

## 🚀 How to Run Locally

Because CVCraft is built with pure web standards and zero backend dependencies, you can run it immediately on any operating system:

### Option 1: Using Python's built-in HTTP server (Recommended)
Open your terminal in the project directory and run:

```bash
# Python 3
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Using Node.js `npx serve` or `http-server`
```bash
npx serve .
```

### Option 3: Direct Browser Launch
You can also directly double-click `index.html` to open it in your browser. Note: For the most seamless PDF download experience via canvas rendering, running via a local HTTP server (Option 1 or 2) is recommended to prevent local browser CORS file restrictions.

---

## 🌐 How to Deploy to GitHub Pages

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial release of CVCraft"
   ```

2. **Push to GitHub**:
   Create a new repository on GitHub (e.g. `cvcraft`), and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/cvcraft.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch **main** and folder **/** (root).
   - Click **Save**.
   - Your site will be live at `https://<your-username>.github.io/cvcraft/` in a few minutes!

---

## ⚙️ Customization Guide

- **Changing the Support Email Address**:
  Search for `support@cvcraft-example.com` across `contact.html`, `privacy-policy.html`, and `terms.html`, and replace it with your personal or organization email address.
- **Adding New Color Swatches**:
  Open `builder.html` and add new `<div class="color-swatch" data-color="#HEX"></div>` items to `.color-swatches`.
- **Modifying Pre-Loaded Sample Data**:
  Open `js/templates.js` to customize the fields in `sampleProfiles.default`, `sampleProfiles.student`, etc.

---

## 🔒 Security & Privacy Notice

CVCraft never sends your CV content to external servers. All text rendered on the canvas or exported into PDF is sanitized against HTML injection using `window.escapeHtml()`. Draft data stored in your browser's `localStorage` can be removed at any time by clicking the "Clear All" button in the builder.

---

## 📄 License

Open-source and free to use for personal and commercial career development.
