/**
 * RAMJI247 - Enterprise Frontend Architecture & UX Engine
 * Mobile-First Interactive Logic | WCAG Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer with Backdrop & Body Lock
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Inject backdrop overlay if not present
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  function openMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.add('active');
    navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
  }

  function closeMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.remove('active');
    navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navBackdrop.addEventListener('click', closeMenu);

    // Close when clicking nav links on mobile
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // 2. Accessible FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');

      // Close all other items for clean accordion UX
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent) item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });
  });

  // 3. Demo Request Modal Management (Auto-injected if missing on inner pages)
  let demoModal = document.getElementById('demoModal');
  if (!demoModal) {
    const modalWrap = document.createElement('div');
    modalWrap.className = 'modal-overlay';
    modalWrap.id = 'demoModal';
    modalWrap.setAttribute('role', 'dialog');
    modalWrap.setAttribute('aria-modal', 'true');
    modalWrap.setAttribute('aria-labelledby', 'modalTitleHeading');
    modalWrap.innerHTML = `
      <div class="modal-card">
        <button class="modal-close" id="closeDemoModal" aria-label="Close modal">&times;</button>
        <h3 class="modal-title" id="modalTitleHeading">Get Free Demo ID</h3>
        <p class="modal-desc">Test live odds, session markets, and games without any deposit.</p>
        
        <form id="demoRequestForm">
          <div class="form-group">
            <label class="form-label" for="modalExchangeField">Select Exchange Panel</label>
            <select class="form-control" id="modalExchangeField">
              <option value="Laser247">Laser247</option>
              <option value="Diamond Exchange">Diamond Exchange</option>
              <option value="Lotus365">Lotus365</option>
              <option value="SkyExchange">SkyExchange</option>
              <option value="World777">World777</option>
              <option value="Betbhai9">Betbhai9</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="userName">Your Name</label>
            <input type="text" class="form-control" id="userName" placeholder="Enter your name" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="userPhone">WhatsApp Number</label>
            <input type="tel" class="form-control" id="userPhone" placeholder="Enter your 10-digit number" required>
          </div>
          <button type="submit" class="btn btn-whatsapp" style="width: 100%; margin-top: 10px;">
            <i class="fab fa-whatsapp"></i> Receive Demo ID on WhatsApp
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modalWrap);
    demoModal = modalWrap;
  }

  const openDemoBtns = document.querySelectorAll('.open-demo-modal');
  const closeDemoBtn = document.getElementById('closeDemoModal');

  function openModal(exchangeName) {
    if (!demoModal) return;
    const modalExchangeField = document.getElementById('modalExchangeField');
    if (modalExchangeField && exchangeName) {
      modalExchangeField.value = exchangeName;
    }
    demoModal.classList.add('active');
    document.body.classList.add('menu-open');
    const firstInput = demoModal.querySelector('input, select');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!demoModal) return;
    demoModal.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  if (demoModal) {
    openDemoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const exchangeName = btn.getAttribute('data-exchange') || 'Laser247';
        openModal(exchangeName);
      });
    });

    if (closeDemoBtn) {
      closeDemoBtn.addEventListener('click', closeModal);
    }

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 4. Handle Demo Form Submission -> Direct WhatsApp Routing (Event Delegation)
  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'demoRequestForm') {
      e.preventDefault();
      const form = e.target;
      const name = form.querySelector('#userName')?.value.trim() || 'Guest';
      const exchange = form.querySelector('#modalExchangeField')?.value || 'Laser247';
      const phone = form.querySelector('#userPhone')?.value.trim() || '';
      
      const text = encodeURIComponent(`Hello RAMJI247 Team! I would like a Demo ID for ${exchange}. Name: ${name}, WhatsApp: ${phone}. Please share login credentials.`);
      window.open(`https://wa.me/918360750829?text=${text}`, '_blank');
      closeModal();
      form.reset();
    }
  });

  // 5. Simulated Market Odds Preview Logic
  const backOdd = document.getElementById('liveBackOdd');
  const layOdd = document.getElementById('liveLayOdd');
  if (backOdd && layOdd) {
    setInterval(() => {
      const base = 1.91 + Math.random() * 0.12;
      backOdd.textContent = base.toFixed(2);
      layOdd.textContent = (base + 0.04).toFixed(2);
    }, 4500);
  }
});

// 6. Global WhatsApp Messaging Helper (+91 83607 50829)
function sendWhatsApp(customMsg) {
  const defaultMsg = "Hello RAMJI247! I would like to create a new Online Cricket ID. Please provide available exchange details.";
  const msg = encodeURIComponent(customMsg || defaultMsg);
  window.open(`https://wa.me/918360750829?text=${msg}`, '_blank');
}
