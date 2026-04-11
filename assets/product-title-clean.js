// Strips " in <color>" from product page h1 titles
document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('[data-testid="product-information-details"] h1');
  if (h1) {
    const parts = h1.textContent.split(' in ');
    if (parts.length > 1) {
      h1.textContent = parts[0];
    }
  }
});
