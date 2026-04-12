// Custom size dropdown: syncs visual dropdown clicks to the hidden native <select>
document.addEventListener('click', (e) => {
  const option = e.target.closest('.size-dropdown__option');
  if (!option) return;

  if (option.classList.contains('size-dropdown__option--sold-out')) return;

  const container = option.closest('.variant-option--custom-select');
  const details = option.closest('.size-dropdown');
  const select = container?.querySelector('.variant-option__hidden-select');
  const label = details?.querySelector('.size-dropdown__label');
  const value = option.dataset.value;

  if (select && value) {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (label) label.textContent = value;
  if (details) details.removeAttribute('open');
});

// After morph re-renders, sync the label from the hidden select's current value
const observer = new MutationObserver(() => {
  document.querySelectorAll('.variant-option--custom-select').forEach((container) => {
    const select = container.querySelector('.variant-option__hidden-select');
    const label = container.querySelector('.size-dropdown__label');
    if (select && label && select.value && label.textContent !== select.value) {
      // Only update if a variant param exists (user has selected)
      if (window.location.search.includes('variant=')) {
        label.textContent = select.value;
      }
    }
  });
});

document.querySelectorAll('variant-picker').forEach((picker) => {
  observer.observe(picker, { childList: true, subtree: true });
});
