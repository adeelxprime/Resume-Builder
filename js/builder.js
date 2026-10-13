/**
 * CVCraft — CV Builder Engine
 * Reactive state management, live preview rendering, dynamic repeaters,
 * localStorage autosave/restore, styling customizations, and client-side PDF export.
 */

(function () {
  'use strict';

  // Master State Container
  let state = {};
  let isDirty = false;
  let currentZoom = 1;

  // LocalStorage Key
  const STORAGE_KEY = 'cvcraft_user_draft';

  // Utility to create unique IDs for repeater items
  function generateId(prefix) {
    return (prefix || 'id') + '-' + Math.random().toString(36).substring(2, 9);
  }

  // Deep clone helper
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Initialize State from Saved Draft, Query Param, or Default Sample
  function initInitialState() {
    const searchStr = (window.location && window.location.search) ? window.location.search : '';
    const urlParams = (typeof URLSearchParams !== 'undefined') ? new URLSearchParams(searchStr) : { get: () => null };
    const exampleParam = urlParams.get('example');
    const templateParam = urlParams.get('template');

    // 1. Check if user requested a specific sample example
    if (exampleParam && window.CVCraftTemplates.sampleProfiles[exampleParam]) {
      state = clone(window.CVCraftTemplates.sampleProfiles[exampleParam]);
    } else {
      // 2. Check localStorage for an existing user draft
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          state = JSON.parse(savedDraft);
        } catch (e) {
          state = clone(window.CVCraftTemplates.sampleProfiles.default);
        }
      } else {
        // 3. Fallback to default professional profile
        state = clone(window.CVCraftTemplates.sampleProfiles.default);
      }
    }

    // Override template from query param if supplied
    if (templateParam && window.CVCraftTemplates.templates[templateParam]) {
      if (!state.settings) state.settings = {};
      state.settings.template = templateParam;
      const tMeta = window.CVCraftTemplates.templates[templateParam];
      if (tMeta.defaultColor) state.settings.accentColor = tMeta.defaultColor;
      if (tMeta.defaultFont) state.settings.fontFamily = tMeta.defaultFont;
    }

    // Ensure all required collections exist
    if (!state.personal) state.personal = {};
    if (!state.experience) state.experience = [];
    if (!state.education) state.education = [];
    if (!state.projects) state.projects = [];
    if (!state.certifications) state.certifications = [];
    if (!state.languages) state.languages = [];
    if (!state.awards) state.awards = [];
    if (!state.volunteer) state.volunteer = [];
    if (!state.settings) state.settings = { template: 'modern', accentColor: '#4f46e5', fontFamily: "'Inter', sans-serif", spacing: '1' };
    if (!state.sectionsVisible) {
      state.sectionsVisible = {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: false,
        volunteer: false
      };
    }
  }

  // --------------------------------------------------------------------------
  // Dynamic Form Field Binding & DOM Generation
  // --------------------------------------------------------------------------

  function populatePersonalFields() {
    const p = state.personal || {};
    const map = {
      'input-fullName': p.fullName || '',
      'input-title': p.title || '',
      'input-email': p.email || '',
      'input-phone': p.phone || '',
      'input-location': p.location || '',
      'input-linkedin': p.linkedin || '',
      'input-website': p.website || ''
    };

    for (let id in map) {
      const el = document.getElementById(id);
      if (el) el.value = map[id];
    }

    const summaryEl = document.getElementById('input-summary');
    if (summaryEl) summaryEl.value = state.summary || '';

    const skillsEl = document.getElementById('input-skills');
    if (skillsEl) skillsEl.value = state.skills || '';
  }

  // Render Repeater: Work Experience
  function renderExperienceList() {
    const container = document.getElementById('experience-list');
    if (!container) return;
    container.innerHTML = '';

    state.experience.forEach((exp, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = exp.id;

      const bulletsText = Array.isArray(exp.bullets) ? exp.bullets.join('\n') : (exp.bullets || '');

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(exp.role || 'Job Position')} — ${window.escapeHtml(exp.company || 'Company')}</span>
          <div class="entry-actions">
            ${index > 0 ? `<button type="button" class="entry-btn btn-move-exp-up" title="Move Up" aria-label="Move Up">↑</button>` : ''}
            ${index < state.experience.length - 1 ? `<button type="button" class="entry-btn btn-move-exp-down" title="Move Down" aria-label="Move Down">↓</button>` : ''}
            <button type="button" class="entry-btn entry-btn-danger btn-delete-exp" title="Delete" aria-label="Delete Experience">✕</button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Job Title / Role</label>
            <input type="text" class="form-input exp-role" value="${window.escapeHtml(exp.role || '')}" placeholder="e.g. Senior Software Engineer">
          </div>
          <div class="form-group">
            <label class="form-label">Company / Employer</label>
            <input type="text" class="form-input exp-company" value="${window.escapeHtml(exp.company || '')}" placeholder="e.g. Acme Corporation">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input exp-location" value="${window.escapeHtml(exp.location || '')}" placeholder="e.g. New York, NY or Remote">
          </div>
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="text" class="form-input exp-start" value="${window.escapeHtml(exp.startDate || '')}" placeholder="e.g. Mar 2021">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="text" class="form-input exp-end" value="${window.escapeHtml(exp.endDate || '')}" placeholder="e.g. Present" ${exp.current ? 'disabled' : ''}>
          </div>
          <div class="form-group" style="justify-content: flex-end; padding-bottom: 8px;">
            <label class="toggle-label">
              <input type="checkbox" class="exp-current" ${exp.current ? 'checked' : ''}>
              <span>I currently work here</span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Responsibilities & Key Achievements</label>
          <textarea class="form-textarea exp-bullets" placeholder="One achievement per line. Start with strong action verbs.">${window.escapeHtml(bulletsText)}</textarea>
          <span class="form-hint">Tip: Enter each bullet point on a new line.</span>
        </div>
      `;

      // Event listeners for this card
      card.querySelector('.exp-role').addEventListener('input', (e) => { exp.role = e.target.value; updatePreview(); });
      card.querySelector('.exp-company').addEventListener('input', (e) => { exp.company = e.target.value; updatePreview(); });
      card.querySelector('.exp-location').addEventListener('input', (e) => { exp.location = e.target.value; updatePreview(); });
      card.querySelector('.exp-start').addEventListener('input', (e) => { exp.startDate = e.target.value; updatePreview(); });
      
      const endInput = card.querySelector('.exp-end');
      const currentCheckbox = card.querySelector('.exp-current');
      
      endInput.addEventListener('input', (e) => { exp.endDate = e.target.value; updatePreview(); });
      currentCheckbox.addEventListener('change', (e) => {
        exp.current = e.target.checked;
        endInput.disabled = exp.current;
        if (exp.current) endInput.value = '';
        updatePreview();
      });

      card.querySelector('.exp-bullets').addEventListener('input', (e) => {
        exp.bullets = e.target.value.split('\n');
        updatePreview();
      });

      const moveUpBtn = card.querySelector('.btn-move-exp-up');
      if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
          const temp = state.experience[index];
          state.experience[index] = state.experience[index - 1];
          state.experience[index - 1] = temp;
          renderExperienceList();
          updatePreview();
        });
      }

      const moveDownBtn = card.querySelector('.btn-move-exp-down');
      if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
          const temp = state.experience[index];
          state.experience[index] = state.experience[index + 1];
          state.experience[index + 1] = temp;
          renderExperienceList();
          updatePreview();
        });
      }

      card.querySelector('.btn-delete-exp').addEventListener('click', () => {
        state.experience.splice(index, 1);
        renderExperienceList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Education
  function renderEducationList() {
    const container = document.getElementById('education-list');
    if (!container) return;
    container.innerHTML = '';

    state.education.forEach((edu, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = edu.id;

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(edu.degree || 'Degree')} — ${window.escapeHtml(edu.school || 'Institution')}</span>
          <div class="entry-actions">
            ${index > 0 ? `<button type="button" class="entry-btn btn-move-edu-up" title="Move Up">↑</button>` : ''}
            ${index < state.education.length - 1 ? `<button type="button" class="entry-btn btn-move-edu-down" title="Move Down">↓</button>` : ''}
            <button type="button" class="entry-btn entry-btn-danger btn-delete-edu" title="Delete">✕</button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Degree / Field of Study</label>
            <input type="text" class="form-input edu-degree" value="${window.escapeHtml(edu.degree || '')}" placeholder="e.g. B.S. in Computer Science">
          </div>
          <div class="form-group">
            <label class="form-label">School / University</label>
            <input type="text" class="form-input edu-school" value="${window.escapeHtml(edu.school || '')}" placeholder="e.g. University of Washington">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input edu-location" value="${window.escapeHtml(edu.location || '')}" placeholder="e.g. Seattle, WA">
          </div>
          <div class="form-group">
            <label class="form-label">Graduation Year / Dates</label>
            <input type="text" class="form-input edu-year" value="${window.escapeHtml(edu.gradYear || '')}" placeholder="e.g. 2020 – 2024">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">GPA, Honors, or Key Coursework (Optional)</label>
          <input type="text" class="form-input edu-gpa" value="${window.escapeHtml(edu.gpa || '')}" placeholder="e.g. GPA: 3.85 / 4.0, Dean's List">
        </div>
      `;

      card.querySelector('.edu-degree').addEventListener('input', (e) => { edu.degree = e.target.value; updatePreview(); });
      card.querySelector('.edu-school').addEventListener('input', (e) => { edu.school = e.target.value; updatePreview(); });
      card.querySelector('.edu-location').addEventListener('input', (e) => { edu.location = e.target.value; updatePreview(); });
      card.querySelector('.edu-year').addEventListener('input', (e) => { edu.gradYear = e.target.value; updatePreview(); });
      card.querySelector('.edu-gpa').addEventListener('input', (e) => { edu.gpa = e.target.value; updatePreview(); });

      const moveUpBtn = card.querySelector('.btn-move-edu-up');
      if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
          const temp = state.education[index];
          state.education[index] = state.education[index - 1];
          state.education[index - 1] = temp;
          renderEducationList();
          updatePreview();
        });
      }

      const moveDownBtn = card.querySelector('.btn-move-edu-down');
      if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
          const temp = state.education[index];
          state.education[index] = state.education[index + 1];
          state.education[index + 1] = temp;
          renderEducationList();
          updatePreview();
        });
      }

      card.querySelector('.btn-delete-edu').addEventListener('click', () => {
        state.education.splice(index, 1);
        renderEducationList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Projects
  function renderProjectsList() {
    const container = document.getElementById('projects-list');
    if (!container) return;
    container.innerHTML = '';

    state.projects.forEach((proj, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = proj.id;
      const bulletsText = Array.isArray(proj.bullets) ? proj.bullets.join('\n') : (proj.bullets || '');

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(proj.title || 'Project Name')}</span>
          <div class="entry-actions">
            ${index > 0 ? `<button type="button" class="entry-btn btn-move-proj-up" title="Move Up">↑</button>` : ''}
            ${index < state.projects.length - 1 ? `<button type="button" class="entry-btn btn-move-proj-down" title="Move Down">↓</button>` : ''}
            <button type="button" class="entry-btn entry-btn-danger btn-delete-proj" title="Delete">✕</button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-input proj-title" value="${window.escapeHtml(proj.title || '')}" placeholder="e.g. Distributed Analytics Engine">
          </div>
          <div class="form-group">
            <label class="form-label">Tech Stack / Role</label>
            <input type="text" class="form-input proj-stack" value="${window.escapeHtml(proj.roleOrStack || '')}" placeholder="e.g. React, Node.js, AWS">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Project Link / Repo URL</label>
          <input type="text" class="form-input proj-link" value="${window.escapeHtml(proj.link || '')}" placeholder="e.g. github.com/username/project">
        </div>
        <div class="form-group">
          <label class="form-label">Description & Key Highlights</label>
          <textarea class="form-textarea proj-bullets" placeholder="Enter key accomplishments, metrics, or architecture notes.">${window.escapeHtml(bulletsText)}</textarea>
        </div>
      `;

      card.querySelector('.proj-title').addEventListener('input', (e) => { proj.title = e.target.value; updatePreview(); });
      card.querySelector('.proj-stack').addEventListener('input', (e) => { proj.roleOrStack = e.target.value; updatePreview(); });
      card.querySelector('.proj-link').addEventListener('input', (e) => { proj.link = e.target.value; updatePreview(); });
      card.querySelector('.proj-bullets').addEventListener('input', (e) => {
        proj.bullets = e.target.value.split('\n');
        updatePreview();
      });

      const moveUpBtn = card.querySelector('.btn-move-proj-up');
      if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
          const temp = state.projects[index];
          state.projects[index] = state.projects[index - 1];
          state.projects[index - 1] = temp;
          renderProjectsList();
          updatePreview();
        });
      }

      const moveDownBtn = card.querySelector('.btn-move-proj-down');
      if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
          const temp = state.projects[index];
          state.projects[index] = state.projects[index + 1];
          state.projects[index + 1] = temp;
          renderProjectsList();
          updatePreview();
        });
      }

      card.querySelector('.btn-delete-proj').addEventListener('click', () => {
        state.projects.splice(index, 1);
        renderProjectsList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Certifications
  function renderCertificationsList() {
    const container = document.getElementById('certifications-list');
    if (!container) return;
    container.innerHTML = '';

    state.certifications.forEach((cert, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = cert.id;

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(cert.name || 'Certification')}</span>
          <div class="entry-actions">
            <button type="button" class="entry-btn entry-btn-danger btn-delete-cert" title="Delete">✕</button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Certification Name</label>
            <input type="text" class="form-input cert-name" value="${window.escapeHtml(cert.name || '')}" placeholder="e.g. AWS Solutions Architect">
          </div>
          <div class="form-group">
            <label class="form-label">Issuing Organization</label>
            <input type="text" class="form-input cert-issuer" value="${window.escapeHtml(cert.issuer || '')}" placeholder="e.g. Amazon Web Services">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Year / Date</label>
            <input type="text" class="form-input cert-year" value="${window.escapeHtml(cert.year || '')}" placeholder="e.g. 2023">
          </div>
          <div class="form-group">
            <label class="form-label">Credential ID (Optional)</label>
            <input type="text" class="form-input cert-cred" value="${window.escapeHtml(cert.credId || '')}" placeholder="e.g. ABC-12345">
          </div>
        </div>
      `;

      card.querySelector('.cert-name').addEventListener('input', (e) => { cert.name = e.target.value; updatePreview(); });
      card.querySelector('.cert-issuer').addEventListener('input', (e) => { cert.issuer = e.target.value; updatePreview(); });
      card.querySelector('.cert-year').addEventListener('input', (e) => { cert.year = e.target.value; updatePreview(); });
      card.querySelector('.cert-cred').addEventListener('input', (e) => { cert.credId = e.target.value; updatePreview(); });
      card.querySelector('.btn-delete-cert').addEventListener('click', () => {
        state.certifications.splice(index, 1);
        renderCertificationsList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Languages
  function renderLanguagesList() {
    const container = document.getElementById('languages-list');
    if (!container) return;
    container.innerHTML = '';

    state.languages.forEach((lang, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = lang.id;

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(lang.name || 'Language')}</span>
          <button type="button" class="entry-btn entry-btn-danger btn-delete-lang" title="Delete">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Language</label>
            <input type="text" class="form-input lang-name" value="${window.escapeHtml(lang.name || '')}" placeholder="e.g. English, French">
          </div>
          <div class="form-group">
            <label class="form-label">Proficiency Level</label>
            <select class="form-select lang-level">
              <option value="Native / Bilingual" ${lang.level === 'Native / Bilingual' ? 'selected' : ''}>Native / Bilingual</option>
              <option value="Fluent / Full Professional" ${lang.level === 'Fluent / Full Professional' || lang.level === 'Fluent' ? 'selected' : ''}>Fluent</option>
              <option value="Professional Working" ${lang.level === 'Professional Working' ? 'selected' : ''}>Professional Working</option>
              <option value="Conversational" ${lang.level === 'Conversational' ? 'selected' : ''}>Conversational</option>
              <option value="Elementary" ${lang.level === 'Elementary' ? 'selected' : ''}>Elementary</option>
            </select>
          </div>
        </div>
      `;

      card.querySelector('.lang-name').addEventListener('input', (e) => { lang.name = e.target.value; updatePreview(); });
      card.querySelector('.lang-level').addEventListener('change', (e) => { lang.level = e.target.value; updatePreview(); });
      card.querySelector('.btn-delete-lang').addEventListener('click', () => {
        state.languages.splice(index, 1);
        renderLanguagesList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Awards
  function renderAwardsList() {
    const container = document.getElementById('awards-list');
    if (!container) return;
    container.innerHTML = '';

    state.awards.forEach((award, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = award.id;

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(award.title || 'Honor / Award')}</span>
          <button type="button" class="entry-btn entry-btn-danger btn-delete-award" title="Delete">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Award Title</label>
            <input type="text" class="form-input award-title" value="${window.escapeHtml(award.title || '')}" placeholder="e.g. Dean's List / Hackathon Winner">
          </div>
          <div class="form-group">
            <label class="form-label">Grantor / Institution</label>
            <input type="text" class="form-input award-issuer" value="${window.escapeHtml(award.issuer || '')}" placeholder="e.g. University / Tech Org">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Year / Date</label>
          <input type="text" class="form-input award-year" value="${window.escapeHtml(award.year || '')}" placeholder="e.g. 2023">
        </div>
      `;

      card.querySelector('.award-title').addEventListener('input', (e) => { award.title = e.target.value; updatePreview(); });
      card.querySelector('.award-issuer').addEventListener('input', (e) => { award.issuer = e.target.value; updatePreview(); });
      card.querySelector('.award-year').addEventListener('input', (e) => { award.year = e.target.value; updatePreview(); });
      card.querySelector('.btn-delete-award').addEventListener('click', () => {
        state.awards.splice(index, 1);
        renderAwardsList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Render Repeater: Volunteer
  function renderVolunteerList() {
    const container = document.getElementById('volunteer-list');
    if (!container) return;
    container.innerHTML = '';

    state.volunteer.forEach((vol, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = vol.id;

      card.innerHTML = `
        <div class="entry-header">
          <span class="entry-summary">${window.escapeHtml(vol.role || 'Volunteer Position')}</span>
          <button type="button" class="entry-btn entry-btn-danger btn-delete-vol" title="Delete">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Volunteer Role</label>
            <input type="text" class="form-input vol-role" value="${window.escapeHtml(vol.role || '')}" placeholder="e.g. Community Mentor">
          </div>
          <div class="form-group">
            <label class="form-label">Organization</label>
            <input type="text" class="form-input vol-org" value="${window.escapeHtml(vol.organization || '')}" placeholder="e.g. Code for Good">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Dates</label>
          <input type="text" class="form-input vol-dates" value="${window.escapeHtml(vol.dates || '')}" placeholder="e.g. 2022 – Present">
        </div>
        <div class="form-group">
          <label class="form-label">Activity Description</label>
          <textarea class="form-textarea vol-desc" placeholder="Brief summary of activities">${window.escapeHtml(vol.description || '')}</textarea>
        </div>
      `;

      card.querySelector('.vol-role').addEventListener('input', (e) => { vol.role = e.target.value; updatePreview(); });
      card.querySelector('.vol-org').addEventListener('input', (e) => { vol.organization = e.target.value; updatePreview(); });
      card.querySelector('.vol-dates').addEventListener('input', (e) => { vol.dates = e.target.value; updatePreview(); });
      card.querySelector('.vol-desc').addEventListener('input', (e) => { vol.description = e.target.value; updatePreview(); });
      card.querySelector('.btn-delete-vol').addEventListener('click', () => {
        state.volunteer.splice(index, 1);
        renderVolunteerList();
        updatePreview();
      });

      container.appendChild(card);
    });
  }

  // Update Section Visibility & Optional Toggles
  function updateOptionalSectionVisibility() {
    const awardsToggle = document.getElementById('toggle-awards');
    const volToggle = document.getElementById('toggle-volunteer');
    const awardsSection = document.getElementById('section-awards');
    const volSection = document.getElementById('section-volunteer');

    if (awardsToggle && awardsSection) {
      awardsToggle.checked = !!state.sectionsVisible.awards;
      awardsSection.style.display = state.sectionsVisible.awards ? 'block' : 'none';
    }
    if (volToggle && volSection) {
      volToggle.checked = !!state.sectionsVisible.volunteer;
      volSection.style.display = state.sectionsVisible.volunteer ? 'block' : 'none';
    }
  }

  // --------------------------------------------------------------------------
  // Live Document Preview Update & Styling Application
  // --------------------------------------------------------------------------
  let renderDebounceTimer = null;
  function updatePreview() {
    isDirty = true;
    clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(function () {
      executePreviewRender();
      autoSaveDraft();
    }, 60);
  }

  function executePreviewRender() {
    const previewEl = document.getElementById('resume-preview');
    if (!previewEl) return;

    // Apply template class
    const templateId = state.settings.template || 'modern';
    previewEl.className = `cv-document template-${templateId}`;

    // Apply CSS Variables for Accent, Font, and Spacing
    previewEl.style.setProperty('--cv-accent', state.settings.accentColor || '#4f46e5');
    previewEl.style.setProperty('--cv-font', state.settings.fontFamily || "'Inter', sans-serif");
    previewEl.style.setProperty('--cv-spacing', state.settings.spacing || '1');

    // Generate HTML via Templates Engine
    const html = window.CVCraftTemplates.renderResume(state);
    previewEl.innerHTML = html;

    // Update real-time completeness score
    updateStrengthScore();
  }

  // --------------------------------------------------------------------------
  // Real-Time Resume ATS Score Calculator
  // --------------------------------------------------------------------------
  function updateStrengthScore() {
    let score = 0;
    const p = state.personal || {};

    if (p.fullName && p.fullName.trim().length > 2) score += 10;
    if (p.title && p.title.trim().length > 2) score += 10;
    if (p.email && p.email.includes('@')) score += 10;
    if (p.phone && p.phone.trim().length > 5) score += 5;
    if (p.location && p.location.trim().length > 2) score += 5;

    if (state.summary && state.summary.trim().length >= 40) score += 15;
    else if (state.summary && state.summary.trim().length > 10) score += 8;

    if (state.experience && state.experience.length >= 2) score += 20;
    else if (state.experience && state.experience.length === 1) score += 12;

    if (state.education && state.education.length >= 1) score += 10;
    if (state.skills && state.skills.trim().length > 8) score += 10;

    const hasProjects = state.projects && state.projects.length > 0;
    const hasCerts = state.certifications && state.certifications.length > 0;
    if (hasProjects || hasCerts) score += 5;

    score = Math.min(100, Math.max(10, score));

    const scoreEl = document.getElementById('strength-score');
    const barEl = document.getElementById('strength-bar-fill');
    if (scoreEl) scoreEl.textContent = score + '%';
    if (barEl) {
      barEl.style.width = score + '%';
      if (score < 50) {
        barEl.style.background = '#ef4444';
      } else if (score < 80) {
        barEl.style.background = '#f59e0b';
      } else {
        barEl.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      }
    }
  }

  // --------------------------------------------------------------------------
  // Draft Storage & Auto-Save
  // --------------------------------------------------------------------------
  let lastSavedTimeout = null;
  function autoSaveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const statusEl = document.getElementById('save-status');
      if (statusEl) {
        statusEl.innerHTML = `<span class="status-dot"></span> Draft saved just now`;
        clearTimeout(lastSavedTimeout);
        lastSavedTimeout = setTimeout(() => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          statusEl.innerHTML = `<span class="status-dot"></span> Saved at ${timeStr}`;
        }, 3000);
      }
    } catch (e) {
      console.warn('Could not save draft to localStorage', e);
    }
  }

  // --------------------------------------------------------------------------
  // Add Entry Handlers
  // --------------------------------------------------------------------------
  function initAddEntryButtons() {
    // Add Experience
    document.getElementById('btn-add-experience')?.addEventListener('click', () => {
      state.experience.unshift({
        id: generateId('exp'),
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: ['']
      });
      renderExperienceList();
      updatePreview();
    });

    // Add Education
    document.getElementById('btn-add-education')?.addEventListener('click', () => {
      state.education.unshift({
        id: generateId('edu'),
        degree: '',
        school: '',
        location: '',
        gradYear: '',
        gpa: ''
      });
      renderEducationList();
      updatePreview();
    });

    // Add Project
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      state.projects.unshift({
        id: generateId('proj'),
        title: '',
        roleOrStack: '',
        link: '',
        bullets: ['']
      });
      renderProjectsList();
      updatePreview();
    });

    // Add Certification
    document.getElementById('btn-add-cert')?.addEventListener('click', () => {
      state.certifications.push({
        id: generateId('cert'),
        name: '',
        issuer: '',
        year: '',
        credId: ''
      });
      renderCertificationsList();
      updatePreview();
    });

    // Add Language
    document.getElementById('btn-add-language')?.addEventListener('click', () => {
      state.languages.push({
        id: generateId('lang'),
        name: '',
        level: 'Professional Working'
      });
      renderLanguagesList();
      updatePreview();
    });

    // Add Award
    document.getElementById('btn-add-award')?.addEventListener('click', () => {
      state.awards.push({
        id: generateId('award'),
        title: '',
        issuer: '',
        year: ''
      });
      renderAwardsList();
      updatePreview();
    });

    // Add Volunteer
    document.getElementById('btn-add-volunteer')?.addEventListener('click', () => {
      state.volunteer.push({
        id: generateId('vol'),
        role: '',
        organization: '',
        dates: '',
        description: ''
      });
      renderVolunteerList();
      updatePreview();
    });
  }

  // --------------------------------------------------------------------------
  // Optional Sections Toggle Handlers
  // --------------------------------------------------------------------------
  function initOptionalSectionToggles() {
    const awardsToggle = document.getElementById('toggle-awards');
    if (awardsToggle) {
      awardsToggle.addEventListener('change', (e) => {
        state.sectionsVisible.awards = e.target.checked;
        if (e.target.checked && (!state.awards || !state.awards.length)) {
          state.awards.push({ id: generateId('award'), title: 'Honors / Award Title', issuer: 'Issuing Org', year: '2023' });
          renderAwardsList();
        }
        updateOptionalSectionVisibility();
        updatePreview();
      });
    }

    const volToggle = document.getElementById('toggle-volunteer');
    if (volToggle) {
      volToggle.addEventListener('change', (e) => {
        state.sectionsVisible.volunteer = e.target.checked;
        if (e.target.checked && (!state.volunteer || !state.volunteer.length)) {
          state.volunteer.push({ id: generateId('vol'), role: 'Volunteer Contributor', organization: 'Non-profit Foundation', dates: '2023', description: 'Assisted in community outreach programs.' });
          renderVolunteerList();
        }
        updateOptionalSectionVisibility();
        updatePreview();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Template, Color & Font Customizers
  // --------------------------------------------------------------------------
  function initCustomizerControls() {
    // Template Selector
    const templateSelect = document.getElementById('select-template');
    if (templateSelect) {
      templateSelect.value = state.settings.template || 'modern';
      templateSelect.addEventListener('change', (e) => {
        state.settings.template = e.target.value;
        const meta = window.CVCraftTemplates.templates[e.target.value];
        if (meta) {
          // If switching to Classic, default to serif font if still default
          if (meta.id === 'classic' && state.settings.fontFamily === "'Inter', sans-serif") {
            state.settings.fontFamily = "'Merriweather', serif";
            const fontSelect = document.getElementById('select-font');
            if (fontSelect) fontSelect.value = state.settings.fontFamily;
          }
        }
        updatePreview();
      });
    }

    // Font Family Selector
    const fontSelect = document.getElementById('select-font');
    if (fontSelect) {
      fontSelect.value = state.settings.fontFamily || "'Inter', sans-serif";
      fontSelect.addEventListener('change', (e) => {
        state.settings.fontFamily = e.target.value;
        updatePreview();
      });
    }

    // Spacing Density Selector
    const spacingSelect = document.getElementById('select-spacing');
    if (spacingSelect) {
      spacingSelect.value = state.settings.spacing || '1';
      spacingSelect.addEventListener('change', (e) => {
        state.settings.spacing = e.target.value;
        updatePreview();
      });
    }

    // Color Swatches
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
      const color = swatch.dataset.color;
      if (color && color.toLowerCase() === (state.settings.accentColor || '').toLowerCase()) {
        swatch.classList.add('active');
      }
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        state.settings.accentColor = color;
        updatePreview();
      });
    });

    // Custom Color Input
    const customColorInput = document.getElementById('input-custom-color');
    if (customColorInput) {
      customColorInput.value = state.settings.accentColor || '#4f46e5';
      customColorInput.addEventListener('input', (e) => {
        swatches.forEach(s => s.classList.remove('active'));
        state.settings.accentColor = e.target.value;
        updatePreview();
      });
    }

    // Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomReset = document.getElementById('btn-zoom-reset');
    const cvWrapper = document.getElementById('resume-preview-wrapper');

    function applyZoom() {
      if (!cvWrapper) return;
      cvWrapper.style.transform = `scale(${currentZoom})`;
      cvWrapper.style.transformOrigin = 'top center';
      const zoomDisplay = document.getElementById('zoom-level-text');
      if (zoomDisplay) zoomDisplay.textContent = Math.round(currentZoom * 100) + '%';
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 1.3) {
          currentZoom += 0.1;
          applyZoom();
        }
      });
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 0.6) {
          currentZoom -= 0.1;
          applyZoom();
        }
      });
    }
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Topbar Actions: Reset, Sample Data, Save, PDF Export & Print
  // --------------------------------------------------------------------------
  function initActionButtons() {
    // Manual Save Draft Button
    document.getElementById('btn-save-draft')?.addEventListener('click', () => {
      autoSaveDraft();
      window.showToast('Draft successfully saved to your browser!', 'success');
    });

    // Load Sample Profile
    document.getElementById('btn-load-sample')?.addEventListener('click', () => {
      state = clone(window.CVCraftTemplates.sampleProfiles.default);
      repopulateAllForms();
      updatePreview();
      window.showToast('Sample professional CV loaded!', 'info');
    });

    // Backup / Export JSON Button
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      const candidate = (state.personal && state.personal.fullName) ? state.personal.fullName.trim().replace(/\s+/g, '_') : 'resume';
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${candidate}_backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.showToast('Resume JSON backup downloaded!', 'success');
    });

    // Restore / Import JSON Button
    const importInput = document.getElementById('input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && typeof parsed === 'object') {
              state = parsed;
              repopulateAllForms();
              updatePreview();
              window.showToast('Resume successfully restored from JSON file!', 'success');
            } else {
              window.showToast('Invalid JSON file format.', 'error');
            }
          } catch (err) {
            window.showToast('Could not parse JSON backup file.', 'error');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    // Copy Formatted Plain Text CV to Clipboard
    document.getElementById('btn-copy-text')?.addEventListener('click', () => {
      const p = state.personal || {};
      let text = `${p.fullName || 'Candidate'}\n${p.title || ''}\n${p.email || ''} | ${p.phone || ''} | ${p.location || ''}\n\n`;
      if (state.summary) text += `PROFESSIONAL SUMMARY\n${state.summary}\n\n`;
      if (state.experience && state.experience.length) {
        text += `WORK EXPERIENCE\n`;
        state.experience.forEach(exp => {
          text += `${exp.role || 'Job Title'} - ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')})\n`;
          if (exp.bullets && exp.bullets.length) {
            const bullets = Array.isArray(exp.bullets) ? exp.bullets : exp.bullets.split('\n');
            bullets.forEach(b => { if (b.trim()) text += `• ${b.trim()}\n`; });
          }
          text += '\n';
        });
      }
      if (state.education && state.education.length) {
        text += `EDUCATION\n`;
        state.education.forEach(edu => {
          text += `${edu.degree || 'Degree'} - ${edu.school || 'School'} (${edu.gradYear || ''})\n`;
        });
        text += '\n';
      }
      if (state.skills) {
        text += `SKILLS\n${state.skills}\n\n`;
      }
      if (state.projects && state.projects.length) {
        text += `KEY PROJECTS\n`;
        state.projects.forEach(prj => {
          text += `${prj.title || 'Project'} (${prj.roleOrStack || ''})\n`;
        });
        text += '\n';
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          window.showToast('Plain text CV copied to clipboard!', 'success');
        }).catch(() => {
          window.showToast('Copied to clipboard.', 'info');
        });
      } else {
        window.showToast('Plain text ready to copy.', 'info');
      }
    });

    // Reset / Clear Form Modal
    const resetModal = document.getElementById('reset-modal');
    const btnResetOpen = document.getElementById('btn-reset-form');
    const btnResetConfirm = document.getElementById('btn-confirm-reset');
    const btnResetCancel = document.getElementById('btn-cancel-reset');

    if (btnResetOpen && resetModal) {
      btnResetOpen.addEventListener('click', () => {
        resetModal.classList.add('open');
      });
    }
    if (btnResetCancel && resetModal) {
      btnResetCancel.addEventListener('click', () => {
        resetModal.classList.remove('open');
      });
    }
    if (btnResetConfirm && resetModal) {
      btnResetConfirm.addEventListener('click', () => {
        // Clear all personal info and entries
        state.personal = { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' };
        state.summary = '';
        state.experience = [];
        state.education = [];
        state.skills = '';
        state.projects = [];
        state.certifications = [];
        state.languages = [];
        state.awards = [];
        state.volunteer = [];
        repopulateAllForms();
        updatePreview();
        resetModal.classList.remove('open');
        window.showToast('Form reset. You can now build from scratch.', 'info');
      });
    }

    // Direct Native Print Button
    document.getElementById('btn-print-cv')?.addEventListener('click', () => {
      window.print();
    });

    // PDF Download via Client-Side Engine with Fallback
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    if (btnDownloadPdf) {
      btnDownloadPdf.addEventListener('click', function () {
        const previewElement = document.getElementById('resume-preview');
        if (!previewElement) return;

        const candidateName = (state.personal && state.personal.fullName) ? state.personal.fullName.trim() : 'Resume';
        const cleanFileName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_') + '_CV.pdf';

        const originalBtnText = btnDownloadPdf.innerHTML;
        btnDownloadPdf.disabled = true;
        btnDownloadPdf.innerHTML = `
          <svg class="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg> Generating PDF...
        `;

        // Check if html2pdf is available
        if (typeof window.html2pdf === 'function') {
          const opt = {
            margin: [10, 10, 10, 10], // standard mm margins
            filename: cleanFileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              scrollX: 0,
              scrollY: 0
            },
            jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait'
            },
            pagebreak: {
              mode: ['avoid-all', 'css', 'legacy']
            }
          };

          window.html2pdf().set(opt).from(previewElement).save().then(function () {
            btnDownloadPdf.disabled = false;
            btnDownloadPdf.innerHTML = originalBtnText;
            window.showToast('Your PDF resume was successfully downloaded!', 'success');
          }).catch(function (err) {
            console.error('PDF export error:', err);
            btnDownloadPdf.disabled = false;
            btnDownloadPdf.innerHTML = originalBtnText;
            window.showToast('PDF generator encountered a layout issue. Opening Print-to-PDF...', 'error');
            setTimeout(function () {
              window.print();
            }, 600);
          });
        } else {
          // html2pdf CDN not loaded or offline: Fallback to Print dialog
          btnDownloadPdf.disabled = false;
          btnDownloadPdf.innerHTML = originalBtnText;
          window.showToast('Using high-fidelity Print-to-PDF dialog...', 'info');
          setTimeout(function () {
            window.print();
          }, 300);
        }
      });
    }

    // Mobile View Switcher (Edit vs Preview tabs)
    const btnSwitchEdit = document.getElementById('switch-edit');
    const btnSwitchPreview = document.getElementById('switch-preview');
    const workspace = document.querySelector('.builder-workspace');

    if (btnSwitchEdit && btnSwitchPreview && workspace) {
      btnSwitchEdit.addEventListener('click', () => {
        btnSwitchEdit.classList.add('active');
        btnSwitchPreview.classList.remove('active');
        workspace.classList.remove('mobile-preview-active');
      });

      btnSwitchPreview.addEventListener('click', () => {
        btnSwitchPreview.classList.add('active');
        btnSwitchEdit.classList.remove('active');
        workspace.classList.add('mobile-preview-active');
      });
    }
  }

  // Bind Form Inputs for Personal Info & Top Summary
  function initStaticInputBindings() {
    const p = state.personal;
    const bind = (id, prop) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          p[prop] = e.target.value;
          updatePreview();
        });
      }
    };

    bind('input-fullName', 'fullName');
    bind('input-title', 'title');
    bind('input-email', 'email');
    bind('input-phone', 'phone');
    bind('input-location', 'location');
    bind('input-linkedin', 'linkedin');
    bind('input-website', 'website');

    const summaryEl = document.getElementById('input-summary');
    if (summaryEl) {
      summaryEl.addEventListener('input', (e) => {
        state.summary = e.target.value;
        updatePreview();
      });
    }

    const skillsEl = document.getElementById('input-skills');
    if (skillsEl) {
      skillsEl.addEventListener('input', (e) => {
        state.skills = e.target.value;
        updatePreview();
      });
    }
  }

  // Refresh all forms and repeaters
  function repopulateAllForms() {
    populatePersonalFields();
    renderExperienceList();
    renderEducationList();
    renderProjectsList();
    renderCertificationsList();
    renderLanguagesList();
    renderAwardsList();
    renderVolunteerList();
    updateOptionalSectionVisibility();

    // Sync select dropdowns
    const templateSelect = document.getElementById('select-template');
    if (templateSelect) templateSelect.value = state.settings.template || 'modern';
    const fontSelect = document.getElementById('select-font');
    if (fontSelect) fontSelect.value = state.settings.fontFamily || "'Inter', sans-serif";
    const spacingSelect = document.getElementById('select-spacing');
    if (spacingSelect) spacingSelect.value = state.settings.spacing || '1';

    // Sync swatches
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
      if (swatch.dataset.color && swatch.dataset.color.toLowerCase() === (state.settings.accentColor || '').toLowerCase()) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Initialization Lifecycle
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    // Only run if on builder page
    if (!document.getElementById('resume-preview')) return;

    initInitialState();
    repopulateAllForms();
    initStaticInputBindings();
    initAddEntryButtons();
    initOptionalSectionToggles();
    initCustomizerControls();
    initActionButtons();
    executePreviewRender();
  });

})();
