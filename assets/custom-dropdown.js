/**
 * Custom size dropdown behavior:
 * - Initial load only: reset to no selection, show option name, disable add-to-cart
 * - After user selects: label persists through morph re-renders (server includes selected state)
 * - Desktop: details/summary with label as trigger
 * - Mobile: full-screen dialog drawer
 */
(function () {
  // Track whether user has made a selection (survives morph re-renders)
  const userSelected = new Set();

  function init() {
    // On initial load only: uncheck radios and reset label for dropdowns without user selection
    document.querySelectorAll('[data-no-preselect]').forEach((container) => {
      const key = container.closest('variant-picker')?.dataset.productId + '-' + container.querySelector('.custom-dropdown__label')?.dataset.defaultLabel;
      if (userSelected.has(key)) return;

      // Uncheck all radios
      container.querySelectorAll('input[type="radio"]').forEach((r) => { r.checked = false; });
      // Remove selected class
      container.querySelectorAll('.custom-dropdown__option--selected').forEach((o) => {
        o.classList.remove('custom-dropdown__option--selected');
      });
      // Reset label to default
      container.querySelectorAll('.custom-dropdown__label').forEach((label) => {
        label.textContent = label.dataset.defaultLabel;
      });
      // Disable add-to-cart
      const variantPicker = container.closest('variant-picker');
      if (variantPicker) {
        const productForm = document.querySelector(
          `product-form-component[data-product-id="${variantPicker.dataset.productId}"]`
        );
        const addBtn = productForm?.querySelector('[ref="addToCartButton"]');
        if (addBtn) addBtn.disabled = true;
      }
    });

    // Desktop: close dropdown, update label, enable add-to-cart
    document.querySelectorAll('.custom-dropdown__details').forEach((details) => {
      // Avoid duplicate listeners after morph
      if (details.dataset.listenerAttached) return;
      details.dataset.listenerAttached = 'true';

      details.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
          const text = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
          const container = details.closest('.variant-option--custom-dropdown');
          const variantPicker = container?.closest('variant-picker');
          const key = variantPicker?.dataset.productId + '-' + container?.querySelector('.custom-dropdown__label')?.dataset.defaultLabel;

          if (key) userSelected.add(key);

          if (text) {
            container?.querySelectorAll('.custom-dropdown__label').forEach((label) => {
              label.textContent = text;
            });
          }
          details.querySelectorAll('.custom-dropdown__option').forEach((opt) => {
            opt.classList.remove('custom-dropdown__option--selected');
          });
          e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');

          details.removeAttribute('open');

          if (variantPicker) {
            const productForm = document.querySelector(
              `product-form-component[data-product-id="${variantPicker.dataset.productId}"]`
            );
            const addBtn = productForm?.querySelector('[ref="addToCartButton"]');
            if (addBtn) addBtn.disabled = false;
          }
        }
      });
    });

    // Mobile: open drawer
    document.querySelectorAll('.custom-dropdown__mobile-trigger').forEach((trigger) => {
      if (trigger.dataset.listenerAttached) return;
      trigger.dataset.listenerAttached = 'true';

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
    document.querySelectorAll('.custom-dropdown__drawer-close').forEach((btn) => {
      if (btn.dataset.listenerAttached) return;
      btn.dataset.listenerAttached = 'true';

      btn.addEventListener('click', () => {
        const drawer = btn.closest('.custom-dropdown__drawer');
        if (drawer) closeDrawer(drawer);
      });
    });

    // Mobile: select option, sync desktop, update labels, close drawer
    document.querySelectorAll('.custom-dropdown__drawer-options').forEach((panel) => {
      if (panel.dataset.listenerAttached) return;
      panel.dataset.listenerAttached = 'true';

      panel.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
          const container = e.target.closest('.variant-option--custom-dropdown');
          const text = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
          const drawer = e.target.closest('.custom-dropdown__drawer');
          const variantPicker = container?.closest('variant-picker');
          const key = variantPicker?.dataset.productId + '-' + container?.querySelector('.custom-dropdown__label')?.dataset.defaultLabel;

          if (key) userSelected.add(key);

          if (container && text) {
            const desktopRadio = container.querySelector(`.custom-dropdown__details input[value="${CSS.escape(e.target.value)}"]`);
            if (desktopRadio) {
              desktopRadio.checked = true;
              desktopRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
            container.querySelectorAll('.custom-dropdown__label').forEach((label) => {
              label.textContent = text;
            });
          }

          panel.querySelectorAll('.custom-dropdown__option').forEach((opt) => {
            opt.classList.remove('custom-dropdown__option--selected');
          });
          e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');

          if (drawer) closeDrawer(drawer);
        }
      });
    });

    // Close drawer on backdrop click
    document.querySelectorAll('.custom-dropdown__drawer').forEach((drawer) => {
      if (drawer.dataset.listenerAttached) return;
      drawer.dataset.listenerAttached = 'true';

      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDrawer(drawer);
      });
    });
  }

  function closeDrawer(drawer) {
    drawer.removeAttribute('open');
    drawer.addEventListener('transitionend', () => drawer.close(), { once: true });
  }

  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run after morph re-renders (variant picker dispatches events that cause DOM updates)
  const observer = new MutationObserver(() => {
    requestAnimationFrame(init);
  });

  // Observe variant pickers for child changes (morph updates)
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('variant-picker').forEach((picker) => {
      observer.observe(picker, { childList: true, subtree: true });
    });
  });
})();
