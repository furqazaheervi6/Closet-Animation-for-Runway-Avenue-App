/**
 * closet-door.js
 * Runway Avenue — Closet door open/close animation module.
 *
 * Depends on:
 *   - #door-left, #door-right   (.door--left / .door--right  CSS classes)
 *   - #closet-cta               (open prompt button)
 *   - #closet-interior          (hidden content behind the doors)
 *   - #btn-door                 (header toggle button)
 *   - App.state                 (shared state object)
 *   - markStep()                (progress step helper)
 *
 * CSS classes toggled:
 *   .is-open     — triggers the rotateY perspective transform on each door
 *   .is-hidden   — hides the CTA overlay
 *   .is-visible  — reveals the closet interior
 *
 * Public API:
 *   ClosetDoor.toggle()   — open if closed, close if open
 *   ClosetDoor.open()     — open (idempotent)
 *   ClosetDoor.close()    — close (idempotent)
 */

const ClosetDoor = (() => {
  /* ── Private refs (resolved lazily on first call) ── */
  let _doorL, _doorR, _cta, _interior, _btnDoor;

  /** Resolve DOM refs once, cache them for subsequent calls. */
  function _resolve() {
    _doorL    = _doorL    || document.getElementById('door-left');
    _doorR    = _doorR    || document.getElementById('door-right');
    _cta      = _cta      || document.getElementById('closet-cta');
    _interior = _interior || document.getElementById('closet-interior');
    _btnDoor  = _btnDoor  || document.getElementById('btn-door');
  }

  /**
   * Toggle the closet open or closed.
   * Reads and writes App.state.doorOpen.
   */
  function toggle() {
    _resolve();
    App.state.doorOpen = !App.state.doorOpen;
    const open = App.state.doorOpen;

    /* Door panels: rotateY via .is-open CSS class */
    _doorL.classList.toggle('is-open', open);
    _doorR.classList.toggle('is-open', open);

    /* CTA overlay: hide when open */
    _cta.classList.toggle('is-hidden', open);

    /* Button label */
    _btnDoor.textContent = open ? 'Close Closet' : 'Open Closet';

    if (open) {
      /*
       * Reveal interior partway through the 750ms door-swing so clothes
       * appear exactly as the doors clear the frame — not before.
       */
      setTimeout(() => _interior.classList.add('is-visible'), 380);
      if (typeof markStep === 'function') markStep('step-closet');
    } else {
      _interior.classList.remove('is-visible');
    }
  }

  /**
   * Programmatically open the closet without toggling (idempotent).
   * Safe to call even if the closet is already open.
   */
  function open() {
    if (!App.state.doorOpen) toggle();
  }

  /**
   * Programmatically close the closet without toggling (idempotent).
   * Safe to call even if the closet is already closed.
   */
  function close() {
    if (App.state.doorOpen) toggle();
  }

  /* Public API */
  return { toggle, open, close };
})();
