/**
 * CVCraft — Templates Engine & Sample Data Profiles
 * Defines the 4 distinct resume templates, profile samples, and safe DOM renderer.
 */

window.CVCraftTemplates = (function () {
  'use strict';

  // 1. Template Metadata Definitions
  const templates = {
    modern: {
      id: 'modern',
      name: 'Modern Clean',
      badge: 'Most Popular',
      category: 'Tech, Product & Modern Business',
      description: 'Features a balanced hierarchy with left-accent badges, clean divider accents, and modern tag pills. Optimized for both ATS scanners and human recruiters.',
      defaultColor: '#4f46e5',
      defaultFont: "'Inter', sans-serif"
    },
    classic: {
      id: 'classic',
      name: 'Classic Executive',
      badge: 'Traditional',
      category: 'Corporate, Law, Finance & Academia',
      description: 'Timeless centered header with refined serif typography and full-width hairline dividers. Standard chronological format trusted by traditional industries.',
      defaultColor: '#0f2b5c',
      defaultFont: "'Merriweather', serif"
    },
    minimal: {
      id: 'minimal',
      name: 'Minimalist Swiss',
      badge: 'Clean Aesthetic',
      category: 'Design, Architecture & Engineering',
      description: 'Understated elegance inspired by Swiss typographic design. Generous whitespace, subdued section labels, and sharp legibility without distracting elements.',
      defaultColor: '#334155',
      defaultFont: "'Roboto', sans-serif"
    },
    student: {
      id: 'student',
      name: 'Student & Graduate',
      badge: 'Entry-Level',
      category: 'Students, Internships & Career Changers',
      description: 'Prioritizes education, academic projects, coursework, and technical proficiencies above work history to highlight your potential.',
      defaultColor: '#0891b2',
      defaultFont: "'Inter', sans-serif"
    }
  };

  // 2. High-Quality Realistic Sample Profiles
  const sampleProfiles = {
    // Default Professional Profile
    default: {
      personal: {
        fullName: 'Alexander Vance',
        title: 'Senior Full-Stack Software Engineer',
        email: 'alexander.vance@example.com',
        phone: '+1 (555) 234-5678',
        location: 'Seattle, WA',
        linkedin: 'linkedin.com/in/alexandervance',
        website: 'alexandervance.dev'
      },
      summary: 'Results-driven Senior Full-Stack Engineer with 6+ years of experience designing, scaling, and maintaining high-throughput cloud architectures and responsive web applications. Proven track record of improving system uptime to 99.98% and mentoring teams of 8+ engineers across agile sprints.',
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Software Engineer',
          company: 'CloudScale Technologies',
          location: 'Seattle, WA',
          startDate: 'Mar 2022',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected distributed microservices handling 45M+ daily API requests with 99.98% uptime using Node.js, TypeScript, and AWS Lambda.',
            'Reduced database query latency by 42% by redesigning PostgreSQL indexing schemas and introducing Redis distributed caching.',
            'Spearheaded transition from legacy monolith to Docker and Kubernetes clusters, accelerating deployment frequency from bi-weekly to continuous daily releases.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Full-Stack Developer',
          company: 'Nexus Digital Labs',
          location: 'San Francisco, CA',
          startDate: 'Jun 2019',
          endDate: 'Feb 2022',
          current: false,
          bullets: [
            'Developed accessible, component-driven client portals using React, Redux, and Tailwind CSS, increasing user session engagement by 28%.',
            'Implemented automated CI/CD testing pipelines in GitHub Actions, increasing test coverage from 64% to 91% and reducing production bugs by 35%.',
            'Collaborated closely with UX designers and product managers to launch 4 enterprise SaaS products on schedule.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          school: 'University of Washington',
          location: 'Seattle, WA',
          gradYear: '2019',
          gpa: 'GPA: 3.85 / 4.0 (Magna Cum Laude)'
        }
      ],
      skills: 'JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, Redis, AWS, Docker, Kubernetes, GraphQL, REST APIs, Git, Jest, CI/CD',
      projects: [
        {
          id: 'proj-1',
          title: 'PulseFlow — Distributed Event Streamer',
          roleOrStack: 'Go, Kafka, React',
          link: 'github.com/alexandervance/pulseflow',
          bullets: [
            'Built an open-source real-time event monitor with over 1,200 GitHub stars, processing real-time telemetry from IoT sensor gateways.'
          ]
        },
        {
          id: 'proj-2',
          title: 'HyperCart — Micro-Commerce Engine',
          roleOrStack: 'Next.js, Stripe, PostgreSQL',
          link: 'hypercart-demo.app',
          bullets: [
            'Engineered a zero-friction headless e-commerce checkout engine with sub-100ms response times and automated invoice generation.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          year: '2023',
          credId: 'AWS-PSA-84920'
        }
      ],
      languages: [
        { id: 'lang-1', name: 'English', level: 'Native / Bilingual' },
        { id: 'lang-2', name: 'Spanish', level: 'Professional Working' }
      ],
      awards: [
        {
          id: 'award-1',
          title: 'Top Innovation Award (Hackathon Winner)',
          issuer: 'CloudScale Hackathon',
          year: '2023'
        }
      ],
      volunteer: [
        {
          id: 'vol-1',
          role: 'Volunteer Code Instructor',
          organization: 'CodeDay Seattle',
          dates: '2021 – Present',
          description: 'Mentor local high school students from underrepresented backgrounds in web programming fundamentals and algorithmic problem solving.'
        }
      ],
      settings: {
        template: 'modern',
        accentColor: '#4f46e5',
        fontFamily: "'Inter', sans-serif",
        spacing: '1'
      },
      sectionsVisible: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: false,
        volunteer: true
      }
    },

    // Student & Graduate Profile
    student: {
      personal: {
        fullName: 'Maya Lin Chen',
        title: 'Computer Science Graduate & Software Engineering Candidate',
        email: 'maya.chen@university.edu',
        phone: '+1 (555) 789-0123',
        location: 'Boston, MA',
        linkedin: 'linkedin.com/in/mayalinchen',
        website: 'mayachen.dev'
      },
      summary: 'Passionate and detail-oriented Computer Science graduate with strong foundational knowledge in data structures, algorithms, and full-stack web development. Experienced in building collaborative software projects and delivering high-quality code during engineering internships. Seeking an entry-level Software Engineer role.',
      experience: [
        {
          id: 'exp-s1',
          role: 'Software Engineering Intern',
          company: 'Acorn Health Tech',
          location: 'Boston, MA',
          startDate: 'Jun 2024',
          endDate: 'Aug 2024',
          current: false,
          bullets: [
            'Built responsive patient telemetry dashboards in Vue.js and TypeScript, improving clinic appointment check-in speed by 25%.',
            'Created 15+ automated unit test suites with Jest, increasing backend API test coverage from 72% to 88%.',
            'Participated in daily standups, code reviews, and sprint retrospectives within an agile team of 7 engineers.'
          ]
        },
        {
          id: 'exp-s2',
          role: 'Undergraduate Teaching Assistant',
          company: 'Northeastern University',
          location: 'Boston, MA',
          startDate: 'Sep 2023',
          endDate: 'May 2024',
          current: false,
          bullets: [
            'Conducted bi-weekly lab sessions for 45+ students in CS 2500 (Fundamentals of Computer Science).',
            'Held 6 hours of weekly office hours assisting students with debugging functional programming assignments.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-s1',
          degree: 'B.S. in Computer Science & Data Analytics',
          school: 'Northeastern University',
          location: 'Boston, MA',
          gradYear: 'May 2025 (Expected)',
          gpa: 'GPA: 3.91 / 4.0 · Dean’s Honor List (All Semesters)'
        }
      ],
      skills: 'Python, Java, C++, JavaScript, TypeScript, React, SQL, Git, Linux, Object-Oriented Design, Data Structures, Algorithms',
      projects: [
        {
          id: 'proj-s1',
          title: 'CampusEats — Dorm Delivery Coordination App',
          roleOrStack: 'React Native, Firebase, Node.js',
          link: 'github.com/mayalinchen/campuseats',
          bullets: [
            'Developed cross-platform mobile app connecting 350+ university students for shared grocery orders and meal runs.',
            'Integrated real-time database listeners for order status updates and push notifications.'
          ]
        },
        {
          id: 'proj-s2',
          title: 'Algorithmic Portfolio Optimizer',
          roleOrStack: 'Python, Pandas, NumPy, Streamlit',
          link: 'github.com/mayalinchen/portfolio-opt',
          bullets: [
            'Implemented Modern Portfolio Theory (Markowitz efficient frontier) calculating optimal asset weights across historical S&P 500 data.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-s1',
          name: 'Meta Front-End Developer Professional Certificate',
          issuer: 'Coursera / Meta',
          year: '2024',
          credId: 'META-FED-9214'
        }
      ],
      languages: [
        { id: 'lang-s1', name: 'English', level: 'Native' },
        { id: 'lang-s2', name: 'Mandarin Chinese', level: 'Fluent' }
      ],
      awards: [
        {
          id: 'award-s1',
          title: 'Presidential Merit Scholarship recipient (4-Year Award)',
          issuer: 'Northeastern University',
          year: '2021 – 2025'
        }
      ],
      volunteer: [
        {
          id: 'vol-s1',
          role: 'Vice President of Outreach',
          organization: 'Women in Technology (WiT) Chapter',
          dates: '2023 – 2024',
          description: 'Organized 5 career panels and technical interview prep workshops for 120+ collegiate members.'
        }
      ],
      settings: {
        template: 'student',
        accentColor: '#0891b2',
        fontFamily: "'Inter', sans-serif",
        spacing: '1'
      },
      sectionsVisible: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: true,
        volunteer: true
      }
    },

    // Developer Profile
    developer: {
      personal: {
        fullName: 'Marcus Brody',
        title: 'Lead Software Architect',
        email: 'marcus.brody@example.com',
        phone: '+1 (555) 432-8765',
        location: 'Austin, TX',
        linkedin: 'linkedin.com/in/marcusbrody',
        website: 'marcusbrody.io'
      },
      summary: 'Systems architect and full-stack leader with 8+ years guiding distributed infrastructure, microservices, and high-load web platforms. Experienced in designing resilient payment gateways, event-driven pipelines, and cloud migrations across AWS and GCP.',
      experience: [
        {
          id: 'exp-d1',
          role: 'Lead Systems Architect',
          company: 'Vertex Financial Tech',
          location: 'Austin, TX',
          startDate: 'Jan 2021',
          endDate: 'Present',
          current: true,
          bullets: [
            'Spearheaded zero-downtime architecture migration of core transaction system processing $3.2B in annualized payments.',
            'Engineered event-driven message bus using Apache Kafka and Go, lowering message processing delay from 350ms to 18ms.',
            'Directly managed 12 senior engineers, standardizing design docs, security reviews, and observability practices.'
          ]
        },
        {
          id: 'exp-d2',
          role: 'Senior Backend Engineer',
          company: 'Cobalt Media Network',
          location: 'Austin, TX',
          startDate: 'May 2017',
          endDate: 'Dec 2020',
          current: false,
          bullets: [
            'Built high-concurrency video encoding pipeline serving 14M monthly active viewers with dynamic CDN routing.',
            'Decreased AWS cloud infrastructure expenditure by 34% through automated spot-instance orchestration and database right-sizing.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-d1',
          degree: 'M.S. in Computer Science (Distributed Systems)',
          school: 'University of Texas at Austin',
          location: 'Austin, TX',
          gradYear: '2017',
          gpa: 'GPA: 3.92 / 4.0'
        }
      ],
      skills: 'Go, Python, TypeScript, Node.js, Kafka, Redis, PostgreSQL, AWS, GCP, Kubernetes, Terraform, GraphQL, Prometheus, CI/CD',
      projects: [
        {
          id: 'proj-d1',
          title: 'KubeSentinel — Automated Cluster Autoscaler',
          roleOrStack: 'Go, Kubernetes Client-Go, Grafana',
          link: 'github.com/marcusbrody/kubesentinel',
          bullets: [
            'Open-source Kubernetes CRD controller automatically reallocating pod resources based on predicted CPU spike patterns.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-d1',
          name: 'Certified Kubernetes Administrator (CKA)',
          issuer: 'Cloud Native Computing Foundation',
          year: '2022',
          credId: 'CKA-821948'
        }
      ],
      languages: [
        { id: 'lang-d1', name: 'English', level: 'Native' },
        { id: 'lang-d2', name: 'German', level: 'Conversational' }
      ],
      awards: [],
      volunteer: [],
      settings: {
        template: 'modern',
        accentColor: '#2563eb',
        fontFamily: "'Roboto', sans-serif",
        spacing: '1'
      },
      sectionsVisible: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: false,
        volunteer: false
      }
    },

    // Marketing Profile
    marketing: {
      personal: {
        fullName: 'Elena Rostova',
        title: 'Director of Growth & Demand Generation',
        email: 'elena.rostova@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/elenarostova',
        website: 'elenagrowth.com'
      },
      summary: 'Data-driven marketing executive with 7+ years scaling B2B SaaS revenue pipelines. Expert in performance marketing, multi-channel inbound attribution, product-led growth (PLG) funnels, and enterprise customer acquisition. Scaled recurring ARR from $4M to $22M.',
      experience: [
        {
          id: 'exp-m1',
          role: 'Head of Growth Marketing',
          company: 'Aura Analytics SaaS',
          location: 'New York, NY',
          startDate: 'Aug 2021',
          endDate: 'Present',
          current: true,
          bullets: [
            'Oversaw $2.4M annual acquisition budget across Google, LinkedIn, programmatic search, and targeted partner syndications.',
            'Boosted qualified inbound pipeline by 145% year-over-year while dropping Customer Acquisition Cost (CAC) by 26%.',
            'Redesigned onboarding activation sequence with product team, boosting free-to-paid trial conversion from 4.2% to 9.8%.'
          ]
        },
        {
          id: 'exp-m2',
          role: 'Senior Performance Marketer',
          company: 'SignalBox Software',
          location: 'New York, NY',
          startDate: 'Jan 2018',
          endDate: 'Jul 2021',
          current: false,
          bullets: [
            'Managed paid acquisition experiments across search and paid social, generating 12,000+ MQLs per quarter.',
            'Collaborated with content and SEO specialists to grow organic organic traffic from 30k to 220k monthly unique sessions.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-m1',
          degree: 'B.A. in Marketing & Communications',
          school: 'New York University (Stern)',
          location: 'New York, NY',
          gradYear: '2017',
          gpa: 'Magna Cum Laude'
        }
      ],
      skills: 'Growth Strategy, B2B Demand Gen, SEO/SEM, Marketing Attribution, Google Analytics 4, HubSpot, Marketo, SQL, A/B Testing, Lifecycle Marketing',
      projects: [],
      certifications: [
        {
          id: 'cert-m1',
          name: 'Reforge Growth Series Graduate',
          issuer: 'Reforge',
          year: '2022',
          credId: 'REF-GRW-412'
        }
      ],
      languages: [
        { id: 'lang-m1', name: 'English', level: 'Native' },
        { id: 'lang-m2', name: 'French', level: 'Professional' }
      ],
      awards: [],
      volunteer: [],
      settings: {
        template: 'classic',
        accentColor: '#0f2b5c',
        fontFamily: "'Merriweather', serif",
        spacing: '1'
      },
      sectionsVisible: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: false,
        certifications: true,
        languages: true,
        awards: false,
        volunteer: false
      }
    }
  };

  // 3. Dynamic Template Renderer Engine
  function renderResume(data) {
    if (!data) return '<div class="p-4">No CV data provided.</div>';

    const p = data.personal || {};
    const templateId = (data.settings && data.settings.template) || 'modern';
    const accent = (data.settings && data.settings.accentColor) || '#4f46e5';
    const font = (data.settings && data.settings.fontFamily) || "'Inter', sans-serif";
    const sec = data.sectionsVisible || {};

    // Helper to safely format bullets
    function renderBullets(bullets) {
      if (!bullets || !bullets.length) return '';
      const items = Array.isArray(bullets) ? bullets : bullets.split('\n');
      const validItems = items.filter(b => b && b.trim().length > 0);
      if (!validItems.length) return '';
      return `<ul class="cv-entry-bullets">${validItems.map(b => `<li>${window.escapeHtml(b.trim())}</li>`).join('')}</ul>`;
    }

    // Helper for contacts
    let contactsHtml = '';
    const contacts = [];
    if (p.email) contacts.push(`<span class="cv-contact-item"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> <a href="mailto:${window.escapeHtml(p.email)}">${window.escapeHtml(p.email)}</a></span>`);
    if (p.phone) contacts.push(`<span class="cv-contact-item"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> ${window.escapeHtml(p.phone)}</span>`);
    if (p.location) contacts.push(`<span class="cv-contact-item"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> ${window.escapeHtml(p.location)}</span>`);
    if (p.linkedin) contacts.push(`<span class="cv-contact-item"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> ${window.escapeHtml(p.linkedin)}</span>`);
    if (p.website) contacts.push(`<span class="cv-contact-item"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg> ${window.escapeHtml(p.website)}</span>`);
    contactsHtml = `<div class="cv-contact-row">${contacts.join('')}</div>`;

    // Sections HTML Builders
    const summarySection = (sec.summary !== false && data.summary && data.summary.trim()) ? `
      <section class="cv-section cv-section-summary">
        <h2 class="cv-section-title">Professional Summary</h2>
        <p class="cv-summary-text">${window.escapeHtml(data.summary)}</p>
      </section>
    ` : '';

    const experienceSection = (sec.experience !== false && data.experience && data.experience.length) ? `
      <section class="cv-section cv-section-experience">
        <h2 class="cv-section-title">Work Experience</h2>
        ${data.experience.map(exp => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(exp.role || 'Job Title')}</div>
              <div class="cv-entry-date">${window.escapeHtml(exp.startDate || '')} ${exp.startDate && (exp.endDate || exp.current) ? '–' : ''} ${exp.current ? 'Present' : window.escapeHtml(exp.endDate || '')}</div>
            </div>
            <div class="cv-entry-head">
              <div class="cv-entry-subtitle">${window.escapeHtml(exp.company || '')}</div>
              <div class="cv-entry-location">${window.escapeHtml(exp.location || '')}</div>
            </div>
            ${renderBullets(exp.bullets)}
          </div>
        `).join('')}
      </section>
    ` : '';

    const educationSection = (sec.education !== false && data.education && data.education.length) ? `
      <section class="cv-section cv-section-education">
        <h2 class="cv-section-title">Education</h2>
        ${data.education.map(edu => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(edu.degree || 'Degree / Qualification')}</div>
              <div class="cv-entry-date">${window.escapeHtml(edu.gradYear || '')}</div>
            </div>
            <div class="cv-entry-head">
              <div class="cv-entry-subtitle">${window.escapeHtml(edu.school || '')}</div>
              <div class="cv-entry-location">${window.escapeHtml(edu.location || '')}</div>
            </div>
            ${edu.gpa ? `<div class="cv-entry-location" style="margin-top:2px; font-style:normal;">${window.escapeHtml(edu.gpa)}</div>` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';

    // Skills
    let skillsSection = '';
    if (sec.skills !== false && data.skills && data.skills.trim()) {
      const skillsArray = data.skills.split(',').map(s => s.trim()).filter(Boolean);
      skillsSection = `
        <section class="cv-section cv-section-skills">
          <h2 class="cv-section-title">Skills & Proficiencies</h2>
          <div class="cv-skills-grid">
            ${skillsArray.map(sk => `<span class="cv-skill-pill">${window.escapeHtml(sk)}</span>`).join('')}
          </div>
        </section>
      `;
    }

    // Projects
    const projectsSection = (sec.projects !== false && data.projects && data.projects.length) ? `
      <section class="cv-section cv-section-projects">
        <h2 class="cv-section-title">Key Projects</h2>
        ${data.projects.map(prj => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(prj.title || 'Project')} ${prj.roleOrStack ? `<span style="font-weight:normal; font-size:8.5pt; color:#64748b;">(${window.escapeHtml(prj.roleOrStack)})</span>` : ''}</div>
              ${prj.link ? `<div class="cv-entry-date">${window.escapeHtml(prj.link)}</div>` : ''}
            </div>
            ${renderBullets(prj.bullets)}
          </div>
        `).join('')}
      </section>
    ` : '';

    // Certifications
    const certsSection = (sec.certifications !== false && data.certifications && data.certifications.length) ? `
      <section class="cv-section cv-section-certifications">
        <h2 class="cv-section-title">Certifications</h2>
        ${data.certifications.map(crt => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(crt.name || '')}</div>
              <div class="cv-entry-date">${window.escapeHtml(crt.year || '')}</div>
            </div>
            <div class="cv-entry-subtitle">${window.escapeHtml(crt.issuer || '')} ${crt.credId ? `· ID: ${window.escapeHtml(crt.credId)}` : ''}</div>
          </div>
        `).join('')}
      </section>
    ` : '';

    // Languages
    const languagesSection = (sec.languages !== false && data.languages && data.languages.length) ? `
      <section class="cv-section cv-section-languages">
        <h2 class="cv-section-title">Languages</h2>
        <div class="cv-skills-grid">
          ${data.languages.map(lng => `
            <span class="cv-skill-pill"><strong>${window.escapeHtml(lng.name || '')}</strong>: ${window.escapeHtml(lng.level || '')}</span>
          `).join('')}
        </div>
      </section>
    ` : '';

    // Optional Awards
    const awardsSection = (sec.awards && data.awards && data.awards.length) ? `
      <section class="cv-section cv-section-awards">
        <h2 class="cv-section-title">Honors & Awards</h2>
        ${data.awards.map(awd => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(awd.title || '')}</div>
              <div class="cv-entry-date">${window.escapeHtml(awd.year || '')}</div>
            </div>
            <div class="cv-entry-subtitle">${window.escapeHtml(awd.issuer || '')}</div>
          </div>
        `).join('')}
      </section>
    ` : '';

    // Optional Volunteer
    const volunteerSection = (sec.volunteer && data.volunteer && data.volunteer.length) ? `
      <section class="cv-section cv-section-volunteer">
        <h2 class="cv-section-title">Volunteer Experience</h2>
        ${data.volunteer.map(vol => `
          <div class="cv-entry">
            <div class="cv-entry-head">
              <div class="cv-entry-title">${window.escapeHtml(vol.role || '')}</div>
              <div class="cv-entry-date">${window.escapeHtml(vol.dates || '')}</div>
            </div>
            <div class="cv-entry-subtitle">${window.escapeHtml(vol.organization || '')}</div>
            ${vol.description ? `<p class="cv-summary-text" style="margin-top:2px;">${window.escapeHtml(vol.description)}</p>` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';

    // Order of sections:
    // In student template, Education, Projects, and Skills are emphasized right after Summary!
    let bodyContent = '';
    if (templateId === 'student') {
      bodyContent = `
        ${summarySection}
        ${educationSection}
        ${projectsSection}
        ${skillsSection}
        ${experienceSection}
        ${certsSection}
        ${awardsSection}
        ${volunteerSection}
        ${languagesSection}
      `;
    } else {
      // Modern, Classic, Minimal
      bodyContent = `
        ${summarySection}
        ${experienceSection}
        ${educationSection}
        ${skillsSection}
        ${projectsSection}
        ${certsSection}
        ${languagesSection}
        ${awardsSection}
        ${volunteerSection}
      `;
    }

    // Name formatting (Minimal template formats with clean weight)
    let nameHtml = '';
    if (templateId === 'minimal') {
      const parts = (p.fullName || 'Your Name').split(' ');
      const first = parts[0] || '';
      const rest = parts.slice(1).join(' ');
      nameHtml = `<h1 class="cv-name">${window.escapeHtml(first)} <strong>${window.escapeHtml(rest)}</strong></h1>`;
    } else {
      nameHtml = `<h1 class="cv-name">${window.escapeHtml(p.fullName || 'Your Name')}</h1>`;
    }

    return `
      <header class="cv-header">
        ${nameHtml}
        <div class="cv-role">${window.escapeHtml(p.title || 'Professional Title')}</div>
        ${contactsHtml}
      </header>
      <div class="cv-content-body">
        ${bodyContent}
      </div>
    `;
  }

  return {
    templates: templates,
    sampleProfiles: sampleProfiles,
    renderResume: renderResume
  };
})();
