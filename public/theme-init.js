/**
 * Applies the stored palette before first paint so the app never flashes the
 * default theme. Loaded synchronously from <head>.
 *
 * Kept in sync by hand with src/lib/themes.ts — it must stay dependency-free
 * and tiny, because it blocks rendering.
 */
(function () {
  try {
    var MODES = {
      seal: 'dark',
      stamp: 'dark',
      verdigris: 'dark',
      signal: 'dark',
      document: 'light',
    };
    var stored = localStorage.getItem('agent-wallet-theme');
    var theme = Object.prototype.hasOwnProperty.call(MODES, stored) ? stored : 'seal';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (MODES[theme] === 'dark') root.classList.add('dark');
  } catch {
    // Storage can throw in private browsing. The CSS default already covers us.
  }
})();
