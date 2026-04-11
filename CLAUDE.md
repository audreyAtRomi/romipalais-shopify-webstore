# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Theme Overview

This is **Atelier** (v3.5.0), a Shopify native theme built on the modular section/block/snippet architecture with JSON-based templates and Web Components for interactivity.

## Development Commands

This theme uses Shopify CLI for local development. There is no package.json or traditional build tooling — assets are pre-compiled and the Shopify CLI handles bundling (including the `@theme/` import alias).

```bash
# Start local development server
shopify theme dev

# Deploy to a theme on the store
shopify theme push

# Pull latest theme from store
shopify theme pull

# Check theme for errors
shopify theme check

# Open the theme in the browser
shopify theme open
```

## Architecture

### Template Rendering Pipeline

`layout/theme.liquid` → `templates/*.json` → `sections/*.liquid` → `blocks/_*.liquid` + `snippets/*.liquid`

- **Layout** (`layout/`): `theme.liquid` is the root HTML shell; `password.liquid` for password-protected stores. Layout renders section groups (`header-group`, `footer-group`) and the main template content.
- **Templates** (`templates/`): All JSON except `gift_card.liquid`. Each JSON template declares which sections to render and their block composition via `"sections": {...}` structure.
- **Sections** (`sections/`): 41 Liquid files + 2 group JSON configs. Sections contain embedded `{% stylesheet %}` for scoped CSS and define their settings schema inline. Group configs (`header-group.json`, `footer-group.json`) define multi-section containers.
- **Blocks** (`blocks/`): 93 files, **all private** (prefixed with `_`). Invoked from sections via `{% content_for 'block', type: '_block-name', id: 'id' %}`.
- **Snippets** (`snippets/`): 103 reusable partials. Public utilities (no prefix) and private helpers (`_` prefix). Rendered via `{% render 'snippet-name' %}`.

### JavaScript / Web Components

75 JS files in `assets/` implementing 62 custom elements.

- **Base class**: `Component` extends `DeclarativeShadowElement` (defined in `component.js`) — provides ref management, mutation observers, and template hydration.
- **Import alias**: All modules use `@theme/` prefix — e.g., `import { Component } from '@theme/component'`. This is resolved by the Shopify CLI bundler, not a local bundler config.
- **Key shared modules**: `component.js` (base class), `utilities.js` (fetch config, debounce), `events.js` (ThemeEvents, CartAddEvent, VariantUpdateEvent), `performance.js` (idle scheduling), `morph.js` (DOM diffing).
- **Custom element naming**: kebab-case tags (`<header-component>`, `<product-form>`), PascalCase classes, registered via `customElements.define()`.
- **Event system**: Custom events dispatched through `ThemeEvents` — cart operations, variant changes, section hydration events.

### CSS Strategy

- **Global styles**: `assets/base.css` defines CSS custom properties (`--color-*`, `--font-*`, `--style-*`).
- **Scoped styles**: Sections embed CSS via `{% stylesheet %}...{% endstylesheet %}` blocks (20 sections use this).
- **Inline styles**: Generated via snippets like `spacing-style`, `gap-style`, `border-style`, `size-style`.
- **Color scheme system**: 6 predefined schemes (`scheme-1` through `scheme-6`) with CSS variable overrides.
- **Responsive**: Mobile-first with `@media screen and (min-width: 750px)` breakpoint; uses `dvh` units and `clamp()`.

### Localization

51 locale files supporting 31 languages. Each language has a translation file (`{lang}.json`) and a schema translation file (`{lang}.schema.json`). `en.default.json` is the source of truth. All user-facing text uses translation keys: `{{ 'key.path' | t }}`. Settings schema uses `t:` prefix for translatable labels.

### Theme Settings

`config/settings_schema.json` (2,287 lines) defines global settings: logos, color schemes, typography (with H1-H6 presets), buttons, forms, borders, shadows, spacing. `config/settings_data.json` stores runtime values and presets. Accessed in Liquid via `settings.*`.

## Key Conventions

- **Liquid style**: Prefer `{% liquid %}` multi-line tag blocks over individual tags. Use `{%- doc -%}` for documentation comments.
- **Block invocation**: `{% content_for 'block', type: '_block-name', id: 'unique-id', prop: value %}`
- **All blocks are private**: Always prefix block filenames with `_`.
- **CSS variables over hardcoded values**: Use the theme's custom property system (`--color-*`, `--font-*`, `--style-*`).
- **JS private fields**: Use `#privateProperty` syntax for encapsulation in custom element classes.
- **Performance**: Use `requestIdleCallback` and animation frame scheduling for non-critical work. Check `navigator.deviceMemory` for device capability detection.
- **Translation keys for all UI text**: Never hardcode user-facing strings — use `{{ 'namespace.key' | t }}` in Liquid and translation keys in schema definitions.
