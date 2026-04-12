// Custom size dropdown: syncs visual dropdown clicks to the hidden native <select>
document.addEventListener('click', (e) => {
  const option = e.target.closest('.size-dropdown__option');
  if (!option) return;

  // Don't select sold out sizes
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
