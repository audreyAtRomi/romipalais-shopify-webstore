/**
 * Handles custom size dropdown behavior:
 * - Desktop: details/summary with auto-close on selection
 * - Mobile: full-screen dialog drawer
 */
document.addEventListener('DOMContentLoaded', () => {
  // Desktop: close dropdown and update trigger text on selection
  document.querySelectorAll('.custom-dropdown__details').forEach((details) => {
    details.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const label = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        if (label) {
          details.querySelector('.custom-dropdown__selected').textContent = label;
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
        requestAnimationFrame(() => {
          drawer.setAttribute('open', '');
        });
      }
    });
  });

  // Mobile: close drawer on close button
  document.querySelectorAll('.custom-dropdown__drawer-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const drawer = btn.closest('.custom-dropdown__drawer');
      if (drawer) {
        drawer.removeAttribute('open');
        drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
      }
    });
  });

  // Mobile: select option, update trigger text, and close drawer
  document.querySelectorAll('.custom-dropdown__drawer-options').forEach((panel) => {
    panel.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const container = e.target.closest('.variant-option--custom-dropdown');
        const label = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        const drawer = e.target.closest('.custom-dropdown__drawer');

        // Sync desktop radios
        if (container && label) {
          const desktopRadio = container.querySelector(`.custom-dropdown__details input[value="${CSS.escape(e.target.value)}"]`);
          if (desktopRadio) {
            desktopRadio.checked = true;
            desktopRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // Update mobile trigger text
          const mobileTrigger = container.querySelector('.custom-dropdown__mobile-trigger .custom-dropdown__selected');
          if (mobileTrigger) {
            mobileTrigger.textContent = label;
          }
        }

        // Close drawer
        if (drawer) {
          drawer.removeAttribute('open');
          drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
        }
      }
    });
  });

  // Close drawer on backdrop click
  document.querySelectorAll('.custom-dropdown__drawer').forEach((drawer) => {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.removeAttribute('open');
        drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
      }
    });
  });
});
