/**
 * Custom size dropdown — minimal JS.
 * All state (label text, selected class, checked radios) is server-rendered
 * by Liquid and preserved through morph. JS only closes the dropdown on pick.
 */
document.addEventListener('change', (e) => {
  if (e.target.type !== 'radio') return;
  const details = e.target.closest('.custom-dropdown__details');
  if (!details) return;

  // Update label to show selected value
  const text = e.target.closest('.custom-dropdown__option')
    ?.querySelector('.custom-dropdown__option-text')?.textContent?.trim();
  const fieldset = details.closest('.variant-option--custom-dropdown');
  if (text && fieldset) {
    fieldset.querySelector('.custom-dropdown__label').textContent = text;
  }

  // Update selected styling
  details.querySelectorAll('.custom-dropdown__option').forEach((o) =>
    o.classList.remove('custom-dropdown__option--selected'));
  e.target.closest('.custom-dropdown__option')?.classList.add('custom-dropdown__option--selected');

  // Close dropdown
  details.removeAttribute('open');

  // Remove needs-selection flag (enables add-to-cart via CSS sibling selector)
  if (fieldset) fieldset.removeAttribute('data-needs-selection');
});
