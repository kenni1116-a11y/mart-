# Profile Register Design

## Goal

Replace the full-screen profile page with a right-side profile register that visually mirrors the existing left-side options register. Preserve all account, device pairing, recovery, device management, and deletion behavior while reducing visual complexity and navigation depth.

## Register Presentation

- The profile register opens from the right when the profile button is tapped.
- It uses the same Graphite Glass material, motion curve, background blur, typography, and spacing family as the options register.
- The register has no hard left border, line, shadow, or rounded edge. Its final 32 pixels fade smoothly to transparent on the left.
- The obscured app remains strongly blurred behind the register.
- The register is vertically scrollable and respects iPhone safe areas.
- Closing is possible with the metallic close control, the backdrop, or Escape on keyboard devices.
- Only one register may be open at a time.

## Content Order

1. Dein Account
2. Account protection integrated into Dein Account
3. Geraet verbinden
4. Deine Geraete
5. Account loeschen

## Dein Account

The account section begins with one compact identity row:

- A tappable circular avatar appears on the left.
- The display name appears beside it.
- The immutable generated username, such as `user-1847293`, appears below the display name in muted text.
- A metallic pencil control matching the visual language of the register close control and add-note plus appears on the right.
- The permanent display-name input and avatar URL input are removed.

### Display Name Editing

Tapping the pencil replaces the display name in place with a compact Graphite Glass input. The pencil changes to a metallic confirmation check and a small metallic cancel control appears beside it.

- The check saves the cleaned display name.
- The iPhone keyboard action labeled Fertig also saves.
- Cancel restores the previous name.
- Existing length and validation rules remain in force.
- Saving errors retain the edited value and show a concise inline error instead of closing the register.

### Avatar Editing

Tapping the avatar opens a compact choice surface with:

- Foto auswaehlen
- Initialen gestalten
- Avatar entfernen

Photo selection uses the native device photo picker. The image is resized and compressed before storage. Initials offer a small curated set of muted Graphite-compatible colors. Removing the avatar restores the initials representation. Avatar actions must not require users to enter or see a URL.

The selected initials color is synchronized through the existing avatar URL field as a short internal token such as `initials:graphite`. Rendering recognizes these tokens and never treats them as image URLs. This keeps initials consistent across connected devices without adding a profile column.

Selected photos are converted to a maximum 512 by 512 pixel WebP image with a target size below 200 KB and uploaded to a dedicated Supabase Storage avatar bucket. The object path is scoped to the current account. Public read access allows existing list badges to render the image by URL; authenticated write and delete policies allow only devices connected to that account to change it. Removing an avatar deletes the stored object and clears the existing avatar URL field.

## Account Protection

Security is integrated into the Dein Account section rather than displayed as a separate section.

- A compact row immediately below the identity shows either Account gesichert or Noch nicht gesichert.
- The row also shows a short secondary explanation and a restrained shield icon.
- Tapping the row expands or collapses the available actions in place.
- Available actions preserve the existing behavior for creating or replacing a recovery code and restoring an account.
- The expanded state must not navigate away from the register.

## Device Pairing And Management

The existing pairing QR code, comparison code, expiry information, retry behavior, polling, and copy-link action remain available under Geraet verbinden.

The existing device list remains under Deine Geraete. Current-device identification, device renaming, and removal of other devices keep their existing behavior. Missing or failed pairing and device data render an inline retry or empty state without closing the register.

## Account Deletion

Account loeschen remains a separate danger area at the very bottom of the register. It uses the existing destructive color treatment and the existing Ja/Abbrechen safety confirmation. It is not folded into the account protection disclosure.

## Interaction And Accessibility

- Profile and options buttons remain symmetrically positioned at opposite screen edges.
- Opening one register closes the other before the new one animates in.
- Controls keep a minimum 44 by 44 pixel touch target.
- The register exposes correct expanded and hidden states to assistive technology.
- Focus remains inside the visible surface while editing or confirming sensitive actions.
- Reduced-motion preferences remove the travel animation without removing state feedback.

## Implementation Boundaries

- Reuse the existing profile markup generators, account services, pairing polling, recovery actions, and device management handlers where practical.
- Replace only the presentation container and identity editing interaction required by this design.
- Do not change account identity, pairing, recovery, device, or deletion data models as part of this task.
- Photo persistence uses the existing avatar URL field and a dedicated avatar service around Supabase Storage. The initials flow remains available if upload or network access fails.

## Verification

Browser coverage must verify:

- the register enters from the right and has only a left transparent fade;
- no hard left border or shadow is present;
- the old full-screen profile presentation is no longer used;
- display-name edit, save, keyboard save, and cancel behavior;
- avatar action choices without an avatar URL field;
- avatar resizing, account-scoped upload, removal, and initials fallback;
- compact security disclosure and existing recovery actions;
- QR pairing, device list, and retry states;
- account deletion remains at the bottom with confirmation;
- mobile containment, scrolling, touch targets, and readable contrast;
- options and profile registers cannot remain open simultaneously.
