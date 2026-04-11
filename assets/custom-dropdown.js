/**
 * Custom size dropdown behavior:
 * - No pre-selection: shows option name (e.g. "Size") with add-to-cart disabled
 * - Desktop: details/summary with label as trigger, auto-close on selection
 * - Mobile: full-screen dialog drawer
 */
document.addEventListener('DOMContentLoaded', () => {
  // On load: disable add-to-cart if no size is selected
  document.querySelectorAll('[data-no-preselect]').forEach((container) => {
    const hasSelection = container.querySelector('input[type="radio"]:checked');
    if (!hasSelection) {
      const form = container.closest('form');
      const variantPicker = container.closest('variant-picker');
      if (variantPicker) {
        const productForm = document.querySelector(
          `product-form-component[data-product-id="${variantPicker.dataset.productId}"]`
        );
        const addBtn = productForm?.querySelector('[ref="addToCartButton"]');
        if (addBtn) {
          addBtn.disabled = true;
          addBtn.querySelector('.add-to-cart-text__content span span').textContent =
            addBtn.closest('[data-select-size-text]')?.dataset.selectSizeText || 'Select a Size';
        }
      }
    }
  });

  function enableAddToCart(container) {
    const variantPicker = container.closest('variant-picker');
    if (variantPicker) {
      const productForm = document.querySelector(
        `product-form-component[data-product-id="${variantPicker.dataset.productId}"]`
      );
      const addBtn = productForm?.querySelector('[ref="addToCartButton"]');
      if (addBtn) {
        addBtn.disabled = false;
      }
    }
  }

  // Desktop: close dropdown, update label, enable add-to-cart
  document.querySelectorAll('.custom-dropdown__details').forEach((details) => {
    details.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const text = e.target.closest('.custom-dropdown__option')?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
        const container = details.closest('.variant-option--custom-dropdown');
        if (text) {
          // Update all labels in container
          container?.querySelectorAll('.custom-dropdown__label').forEach((label) => {
            label.textContent = text;
          });
        }
        // Mark selected
        details.querySelectorAll('.custom-dropdown__option').forEach((opt) => {
          opt.classList.remove('custom-dropdown__option--selected');
        });
        e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');

        details.removeAttribute('open');
        if (container) enableAddToCart(container);
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
          // Update all labels
          container.querySelectorAll('.custom-dropdown__label').forEach((label) => {
            label.textContent = text;
          });
          enableAddToCart(container);
        }

        // Mark selected in drawer
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
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer(drawer);
    });
  });
});
