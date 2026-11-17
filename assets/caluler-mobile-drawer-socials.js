// CALULER-MOBILE-DRAWER-ICONS-AND-SOCIALS-V2
(function () {
    'use strict';
    if (window.__calulerDrawerIconsV2) return;
    window.__calulerDrawerIconsV2 = true;

    var scheduled = false;
    var MENU_ICONS = {
        home: 'm3 10 9-7 9 7v10H3z M9 20v-7h6v7',
        tools: 'M5 3h14v18H5z M8 7h8 M8 11h.01 M12 11h.01 M16 11h.01 M8 15h.01 M12 15h.01 M16 15h.01 M8 18h.01 M12 18h.01 M16 18h.01',
        categories: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
        about: 'M12 8h.01 M12 11v6 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
        contact: 'M3 5h18v14H3z m0 0 9 7 9-7',
        privacy: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z'
    };

    function decorateMenu(panel) {
        var primary = panel.querySelector('.caluler-primary-nav');
        if (!primary) return;
        Array.from(primary.children).forEach(function (item) {
            var control = item.matches('a, button') ? item :
                item.querySelector(':scope > .caluler-nav-link');
            if (!control || control.querySelector('.caluler-drawer-menu-icon')) return;
            var name = (control.textContent || '').trim().match(/^(Home|Tools|Categories|About|Contact|Privacy)\b/i);
            if (!name) return;
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'caluler-drawer-menu-icon');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1.8');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', MENU_ICONS[name[1].toLowerCase()]);
            svg.appendChild(path);
            control.insertBefore(svg, control.firstChild);
        });
    }

    function mountSocials(panel) {
        var section = document.querySelector('.caluler-drawer-order-social');
        if (!section) {
            var footerSocials = document.querySelector('footer .footer-socials--brand');
            if (!footerSocials) return;
            section = document.createElement('section');
            section.className = 'caluler-drawer-order-social';
            section.setAttribute('aria-label', 'Stay Connected');
            var copy = document.createElement('div');
            copy.className = 'caluler-drawer-social-copy';
            var heading = document.createElement('h3');
            heading.className = 'caluler-drawer-order-social__title';
            heading.textContent = 'Stay Connected';
            var subtitle = document.createElement('p');
            subtitle.className = 'caluler-drawer-social-subtitle';
            subtitle.textContent = 'Follow Caluler.Work';
            copy.appendChild(heading);
            copy.appendChild(subtitle);
            var icons = footerSocials.cloneNode(true);
            icons.classList.add('caluler-drawer-social-icons');
            icons.setAttribute('aria-label', 'Caluler social media');
            section.appendChild(copy);
            section.appendChild(icons);
        }
        if (section.parentNode !== panel) panel.appendChild(section);
    }

    function refresh() {
        if (!window.matchMedia('(max-width: 900px)').matches) return;
        var panel = document.querySelector('.caluler-site-menu-panel');
        if (!panel) return;
        decorateMenu(panel);
        mountSocials(panel);
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(function () {
            scheduled = false;
            refresh();
        });
    }

    function start() {
        refresh();
        var nav = document.querySelector('.nav');
        if (nav && window.MutationObserver) {
            // The shared header builds/replaces its drawer asynchronously.
            new MutationObserver(schedule).observe(nav, { childList: true, subtree: true });
        }
        window.addEventListener('resize', schedule, { passive: true });
        window.addEventListener('pageshow', schedule);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else start();
})();
