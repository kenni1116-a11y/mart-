# Navigation Edge And Suggestions Design

## Goal

Refine the approved Graphite navigation presentation and restore readable manual-item suggestions without changing list, account, market, or synchronization behavior.

## Header And New Note Action

- Keep the options control at the left, `zettel` centered, and pin the profile control to the right header column.
- Stack `Neuer Zettel` and its plus vertically in both empty and populated Pinnwand states.
- Render the plus as a free metallic glyph matching the options-register close `X`, without a circle, border, or filled button surface.
- Retain a 44 x 44 px accessible touch target even though the visible glyph is free-standing.

## Options Register

- Slide the register in and out horizontally from the left instead of toggling `display`.
- Remove the visible border, line, and hard shadow from the register's right edge.
- Preserve the existing Graphite material across the register, but fade only its final 32 px at the right edge to full transparency.
- Keep interactive content, including the close `X`, before the fading strip so it remains clear.
- Keep the scrim blurred and close the register through the `X`, scrim, or Escape.
- Respect `prefers-reduced-motion` by effectively removing transition duration.

## Manual Item Suggestions

- Keep the existing suggestion generation and selection logic.
- Replace the light legacy suggestion surface with dark Graphite material.
- Show the product name in high-contrast primary text and the shelf/category in smaller muted text.
- Keep keyboard selection, pointer selection, and five-result limiting unchanged.

## Verification

- WebKit asserts profile placement, vertical new-note layout, metallic plus presentation, and a transform-based register transition.
- WebKit types into `Eigener Artikel` and verifies that product names and categories are both visible with dark readable material.
- Existing unit and browser suites must remain green before any publication.
