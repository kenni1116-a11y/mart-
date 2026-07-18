# Pinnwand Navigation Polish Design

## Goal

Refine the Graphite Midnight Pinnwand navigation and note controls without changing account identity, Supabase synchronization, shared-list behavior, or market functionality.

## Approved Shell

- Keep `zettel` centered in the top bar.
- Place the options icon at the upper left and the profile icon at the upper right.
- Render both controls as 44 px circular icon buttons.
- Keep the iPhone status bar visible and visually merge it with the same dark app background.
- Keep `Pinnwand | Markt` as a segmented navigation control rather than converting it to circles.

## Options Register

- Remove `Mehr` completely.
- The left options button opens a full-height register that slides in from the left.
- The register leaves a narrow strip of the Pinnwand visible on the right.
- Its upper area is transparent and strongly blurs and desaturates controls behind it.
- Starting around the upper quarter, the material becomes progressively more opaque Graphite toward the bottom.
- The upper-right edge is square; only the lower-right edge remains softly rounded.
- The close control is a free 44 px `X` with a glass-granite text treatment and no circular outline.
- `Optionen` sits visually one line below the background `zettel` wordmark.
- The register directly exposes `Hintergrund anpassen`, `Daten hinzufügen`, `Impressum`, and `Bugreport`.

## Profile Page

- The profile icon opens a dedicated full-screen page, not the options register and not the old `Mehr` dialog.
- The page shows identity editing, a device-pairing QR code, connected devices, recovery controls, and account deletion.
- The QR code is requested and shown immediately when the profile page opens. If creation fails, the profile remains usable and offers a retry.
- Existing pairing approval, device management, recovery, and account-deletion services remain the source of truth.
- Closing returns to the previous app view without reloading or altering list state.

## Pinnwand Controls

- `Neuer Zettel` and its circular plus form one centered group in both empty and populated Pinnwand states.
- Familiar icon actions become circles: rename, share, add, delete/leave, menu, and profile.
- Text labels may sit beside a circular control but are not placed inside the circle.
- `Owner` remains a status/management chip and `Pinnwand | Markt` remains segmented navigation.
- `Aktiv` is integrated directly into the note's top notch instead of appearing as a second pill over it.

## Accessibility And Motion

- Every icon-only action has an explicit German accessible label and at least a 44 x 44 px touch target.
- The register can be closed by the `X`, the dimmed background, or Escape.
- Register motion respects `prefers-reduced-motion`.
- Focus remains visible on drawer and profile controls.

## Verification

- Static tests verify the direct register entries, removal of `Mehr`, separate profile action, circular-control hooks, and centered add-note structure.
- WebKit tests verify register open/close behavior, direct option routing, full-screen profile, immediate QR/device loading, centered add-note placement, the integrated active notch, and mobile containment at 393 and 430 px.
- Run the complete pinned verification command before publication.
