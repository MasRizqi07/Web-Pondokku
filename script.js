/**
 * =====================================================
 *  PONPES MAMBA'UL MA'ARIF — SCRIPT.JS
 *  Denanyar Jombang | © 2025
 * =====================================================
 */

'use strict';

/* ===================================================
   1. LOADING SCREEN
=================================================== */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('gone');
    }, 1900);
});


/* ===================================================
   2. NAVBAR — scroll solid + active state
=================================================== */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.classList.toggle('solid', window.scrollY > 60);

    // Back-to-top button visibility
    const btt = document.getElementById('btt');
    if (btt) btt.classList.toggle('show', window.scrollY > 300);
});

// Ensure navbar is always solid (dark bg) once user interacts
document.addEventListener('DOMContentLoaded', () => {
    if (nav) nav.classList.add('solid');
});


/* ===================================================
   3. HAMBURGER / MOBILE DRAWER
=================================================== */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

function toggleDrawer() {
    if (!burger || !drawer) return;
    burger.classList.toggle('x');
    drawer.classList.toggle('open');
}

if (burger) burger.addEventListener('click', toggleDrawer);

// Close drawer when a link inside it is clicked
document.querySelectorAll('.drawer a').forEach(link => {
    link.addEventListener('click', () => {
        if (burger) burger.classList.remove('x');
        if (drawer) drawer.classList.remove('open');
    });
});


/* ===================================================
   4. MULTI-PAGE ROUTING
=================================================== */
/**
 * showPage(id)
 * Hides all .page divs and shows only #page-{id}
 * Also updates active state on nav links
 */
function showPage(id) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + id);
    if (target) target.classList.add('active');

    // Update nav link active state
    document.querySelectorAll('[data-page]').forEach(a => {
        a.classList.toggle('active', a.dataset.page === id);
    });

    // Close mobile drawer if open
    if (burger) burger.classList.remove('x');
    if (drawer) drawer.classList.remove('open');

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-init scroll reveal for new page
    setTimeout(initReveal, 80);
}

// Expose globally so inline onclick attributes can call it
window.showPage = showPage;


/* ===================================================
   5. SCROLL REVEAL (Intersection Observer)
=================================================== */
function initReveal() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const items = activePage.querySelectorAll('.rev, .rev-l, .rev-r');

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay for each element
                setTimeout(() => entry.target.classList.add('in'), i * 70);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    items.forEach(el => {
        el.classList.remove('in'); // reset first
        io.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initReveal, 120);
});


/* ===================================================
   6. COUNT-UP ANIMATION
=================================================== */
/**
 * countUp(el)
 * Reads data-count attribute and animates number from 0 to target
 */
function countUp(el) {
    const raw = el.dataset.count;
    if (!raw) return;

    const target = +raw;
    const duration = 1600; // ms
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        // Format with locale (e.g. 9.902 in id-ID)
        el.textContent = Math.floor(current).toLocaleString('id-ID');
    }, 16);
}

// Trigger count-up when hero stat cards enter viewport
const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(countUp);
            statObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-cards').forEach(c => statObs.observe(c));


/* ===================================================
   7. REGISTRATION FORM SUBMIT
=================================================== */
function submitForm() {
    const msg = document.getElementById('formMsg');
    if (!msg) return;

    // Simple client-side validation feedback
    msg.classList.add('show');

    // Auto-hide after 6 seconds
    setTimeout(() => msg.classList.remove('show'), 6000);

    // Optionally clear form fields
    const form = document.querySelector('.reg-form');
    if (form) {
        form.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        form.querySelectorAll('select').forEach(sel => {
            sel.selectedIndex = 0;
        });
    }
}

// Expose globally
window.submitForm = submitForm;


/* ===================================================
   8. BACK TO TOP
=================================================== */
const bttBtn = document.getElementById('btt');
if (bttBtn) {
    bttBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ===================================================
   9. SMOOTH ANCHOR NAVIGATION
=================================================== */
// Make all in-page anchor clicks route through showPage
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href="#"]');
    if (!anchor) return;

    // If it has an onclick that calls showPage, let that handle it
    const onclickAttr = anchor.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('showPage')) return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===================================================
   10. KEYBOARD ACCESSIBILITY — Escape closes drawer
=================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (burger) burger.classList.remove('x');
        if (drawer) drawer.classList.remove('open');
    }
});


/* ===================================================
   11. ACTIVE NAV HIGHLIGHT on page change
=================================================== */
// Called automatically inside showPage(), but also run on init
function updateActiveNav(id) {
    document.querySelectorAll('[data-page]').forEach(a => {
        a.classList.toggle('active', a.dataset.page === id);
    });
}

// On initial load, mark 'home' as active
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav('home');
});


/* ===================================================
   12. TICKER — pause on hover
=================================================== */
const tickerTrack = document.getElementById('ttk');
if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
        tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
        tickerTrack.style.animationPlayState = 'running';
    });
}


/* ===================================================
   13. GALLERY ITEM — click-to-zoom placeholder
=================================================== */
document.querySelectorAll('.gi').forEach(item => {
    item.addEventListener('click', () => {
        const label = item.querySelector('.gi-overlay span');
        if (label) {
            // In production: open lightbox here
            // For now: briefly flash a visual indicator
            item.style.outline = '3px solid var(--gold)';
            setTimeout(() => { item.style.outline = ''; }, 400);
        }
    });
});


/* ===================================================
   14. FORM FIELD — real-time validation styling
=================================================== */
document.querySelectorAll('.fg input, .fg select, .fg textarea').forEach(field => {
    field.addEventListener('blur', () => {
        if (field.value.trim()) {
            field.style.borderColor = 'rgba(13,107,87,.4)';
        } else {
            field.style.borderColor = '';
        }
    });
});


/* ===================================================
   15. INIT — run everything on DOM ready
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Reveal home page elements immediately
    initReveal();

    // Make sure hero page is shown
    const homePage = document.getElementById('page-home');
    if (homePage && !homePage.classList.contains('active')) {
        homePage.classList.add('active');
    }

    console.log('%c Ponpes Mamba\'ul Ma\'arif ', 'background:#042e28;color:#f5cc6e;font-weight:bold;font-size:14px;padding:6px 12px;border-radius:4px;');
    console.log('%c Denanyar Jombang — Est. 1917 ', 'color:#c8941f;font-size:11px;');
});