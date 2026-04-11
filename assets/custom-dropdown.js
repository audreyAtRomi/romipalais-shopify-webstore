/**
 * Custom size dropdown behavior:
 * - Desktop: details/summary with label as trigger, auto-close on selection
 * - Mobile: full-screen dialog drawer
 */
document.addEventListener('DOMContentLoaded', () => {
  // Desktop: close dropdown and update label on selection
  document.querySelectorAll('.custom-dropdown__details').forEach((details) => {
    details.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const text = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        if (text) {
          const label = details.querySelector('.custom-dropdown__label');
          if (label) label.textContent = text;
        }
        details.removeAttribute('open');
      }
    });
  });

  // Mobile: open drawer
  document.querySelectorAll('.custom-dropdown__mobile-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const container = trigger.closest('.variant-option--custom-dropdown');
      const drawer = container?.querySelector('.custom-dropdown__drawer');
      if (drawer) {
        drawer.showModal();
        requestAnimationFrame(() => drawer.setAttribute('open', ''));
      }
    });
  });

  // Mobile: close drawer
  function closeDrawer(drawer) {
    drawer.removeAttribute('open');
    drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
  }

  document.querySelectorAll('.custom-dropdown__drawer-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const drawer = btn.closest('.custom-dropdown__drawer');
      if (drawer) closeDrawer(drawer);
    });
  });

  // Mobile: select option, sync desktop, update labels, close drawer
  document.querySelectorAll('.custom-dropdown__drawer-options').forEach((panel) => {
    panel.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const container = e.target.closest('.variant-option--custom-dropdown');
        const text = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        const drawer = e.target.closest('.custom-dropdown__drawer');

        if (container && text) {
          // Sync desktop radio
          const desktopRadio = container.querySelector(`.custom-dropdown__details input[value="${CSS.escape(e.target.value)}"]`);
          if (desktopRadio) {
            desktopRadio.checked = true;
            desktopRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // Update all labels in this container
          container.querySelectorAll('.custom-dropdown__label').forEach((label) => {
            label.textContent = text;
          });
        }

        if (drawer) closeDrawer(drawer);
      }
    });
  });

  // Close drawer on backdrop click
  document.querySelectorAll('.custom-dropdown__drawer').forEach((drawer) => {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer(drawer);
    });
  });
});
