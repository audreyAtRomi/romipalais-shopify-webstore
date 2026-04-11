/**
 * Custom size dropdown behavior:
 * - Initial load: reset to no selection, disable add-to-cart
 * - Desktop: details/summary with label as trigger
 * - Mobile: full-screen dialog drawer
 */
(function () {
  function setup() {
    // Initial load only: uncheck radios, reset label, disable add-to-cart
    document.querySelectorAll('[data-no-preselect]').forEach((container) => {
      container.querySelectorAll('input[type="radio"]').forEach((r) => {
        r.checked = false;
        r.dataset.currentChecked = 'false';
      });
      container.querySelectorAll('.custom-dropdown__option--selected').forEach((o) => {
        o.classList.remove('custom-dropdown__option--selected');
      });
      container.querySelectorAll('.custom-dropdown__label').forEach((label) => {
        label.textContent = label.dataset.defaultLabel;
      });
      // Remove the attribute so morph re-renders don't trigger this again
      container.removeAttribute('data-no-preselect');

      const variantPicker = container.closest('variant-picker');
      if (variantPicker) {
        const productForm = document.querySelector(
          `product-form-component[data-product-id="${variantPicker.dataset.productId}"]`
        );
        const addBtn = productForm?.querySelector('[ref="addToCartButton"]');
        if (addBtn) addBtn.disabled = true;
      }
    });

    bindListeners();
  }

  function bindListeners() {
    // Desktop: close dropdown, update label on selection
    document.querySelectorAll('.custom-dropdown__details').forEach((details) => {
      if (details.dataset.bound) return;
      details.dataset.bound = '1';

      details.addEventListener('change', (e) => {
        if (e.target.type !== 'radio') return;
        const text = e.target.closest('.custom-dropdown__option')
          ?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        const container = details.closest('.variant-option--custom-dropdown');
        if (text) {
          container?.querySelectorAll('.custom-dropdown__label').forEach((l) => l.textContent = text);
        }
        details.querySelectorAll('.custom-dropdown__option').forEach((o) =>
          o.classList.remove('custom-dropdown__option--selected'));
        e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');
        details.removeAttribute('open');

        // Enable add-to-cart
        const vp = container?.closest('variant-picker');
        if (vp) {
          const pf = document.querySelector(`product-form-component[data-product-id="${vp.dataset.productId}"]`);
          const btn = pf?.querySelector('[ref="addToCartButton"]');
          if (btn) btn.disabled = false;
        }
      });
    });

    // Mobile: open drawer
    document.querySelectorAll('.custom-dropdown__mobile-trigger').forEach((trigger) => {
      if (trigger.dataset.bound) return;
      trigger.dataset.bound = '1';
      trigger.addEventListener('click', () => {
        const drawer = trigger.closest('.variant-option--custom-dropdown')?.querySelector('.custom-dropdown__drawer');
        if (drawer) {
          drawer.showModal();
          requestAnimationFrame(() => drawer.setAttribute('open', ''));
        }
      });
    });

    // Mobile: close buttons
    document.querySelectorAll('.custom-dropdown__drawer-close').forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const drawer = btn.closest('.custom-dropdown__drawer');
        if (drawer) closeDrawer(drawer);
      });
    });

    // Mobile: select option, sync desktop
    document.querySelectorAll('.custom-dropdown__drawer-options').forEach((panel) => {
      if (panel.dataset.bound) return;
      panel.dataset.bound = '1';
      panel.addEventListener('change', (e) => {
        if (e.target.type !== 'radio') return;
        const container = e.target.closest('.variant-option--custom-dropdown');
        const text = e.target.closest('.custom-dropdown__option')
          ?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        const drawer = e.target.closest('.custom-dropdown__drawer');

        if (container && text) {
          const desktopRadio = container.querySelector(
            `.custom-dropdown__details input[value="${CSS.escape(e.target.value)}"]`
          );
          if (desktopRadio) {
            desktopRadio.checked = true;
            desktopRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          container.querySelectorAll('.custom-dropdown__label').forEach((l) => l.textContent = text);
        }
        panel.querySelectorAll('.custom-dropdown__option').forEach((o) =>
          o.classList.remove('custom-dropdown__option--selected'));
        e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');
        if (drawer) closeDrawer(drawer);
      });
    });

    // Close drawer on backdrop click
    document.querySelectorAll('.custom-dropdown__drawer').forEach((drawer) => {
      if (drawer.dataset.bound) return;
      drawer.dataset.bound = '1';
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDrawer(drawer);
      });
    });
  }

  function closeDrawer(drawer) {
    drawer.removeAttribute('open');
    drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
