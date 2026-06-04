/**
 * Tally Prime keyboard navigation utilities (shared config & helpers).
 * Used by tally.html; mirrored in financial tracker/src/lib/tally-keyboard.ts
 */
(function (global) {
  /** Gateway menu items with Tally-style single-letter hotkeys */
  const GATEWAY_MENU = [
    { label: 'Create', hotkey: 'c', screen: 'create' },
    { label: 'Alter', hotkey: 'l', screen: 'alter' },
    { label: 'Chart of Accounts', hotkey: 'a', screen: 'coa' },
    { label: 'Vouchers', hotkey: 'v', screen: 'vouchers' },
    { label: 'Day Book', hotkey: 'd', screen: 'daybook' },
    { label: 'Banking', hotkey: 'n', screen: 'banking' },
    { label: 'Balance Sheet', hotkey: 'b', screen: 'balancesheet' },
    { label: 'Profit & Loss A/c', hotkey: 'p', screen: 'pnl' },
    { label: 'Ratio Analysis', hotkey: 'r', screen: 'ratio' },
    { label: 'Quit', hotkey: 'q', screen: 'quit' },
  ];

  const TOP_BAR_SHORTCUTS = [
    { hotkey: 'k', label: 'Company', action: 'company' },
    { hotkey: 'y', label: 'Data', action: 'data' },
    { hotkey: 'z', label: 'Exchange', action: 'exchange' },
    { hotkey: 'g', label: 'Go To', action: 'goto' },
    { hotkey: 'o', label: 'Import', action: 'import' },
    { hotkey: 'e', label: 'Export', action: 'export' },
  ];

  /** Side / bottom function-key labels shown in the UI */
  const FUNCTION_KEYS = {
    F1: { label: 'Help', action: 'help' },
    F2: { label: 'Date', action: 'date' },
    F3: { label: 'Company', action: 'company' },
    F4: { label: 'Post', action: 'post' },
    F5: { label: 'Dup', action: 'duplicate' },
    F6: { label: 'Cancel', action: 'cancel' },
    F7: { label: 'Addl', action: 'additional' },
    F8: { label: 'Cfg', action: 'config' },
    F9: { label: 'Rep', action: 'report' },
    F10: { label: 'Menu', action: 'menu' },
    F11: { label: 'Features', action: 'features' },
    F12: { label: 'Configure', action: 'configure' },
  };

  const MENU_COUNT = GATEWAY_MENU.length;

  /** True when focus is inside an input, textarea, select, or contenteditable */
  function isEditableTarget(target) {
    if (!target) return false;
    const el = target.nodeType === 1 ? target : target.parentElement;
    if (!el) return false;
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (el.isContentEditable) return true;
    if (el.closest && el.closest('[data-tally-modal] input, [data-tally-modal] textarea, [data-tally-modal] select')) {
      return true;
    }
    return false;
  }

  /** Wrap vertical menu index with loop at boundaries */
  function wrapMenuIndex(index, delta) {
    return (index + delta + MENU_COUNT) % MENU_COUNT;
  }

  /** Find gateway menu index by hotkey letter */
  function findMenuIndexByHotkey(key) {
    const k = key.toLowerCase();
    return GATEWAY_MENU.findIndex((item) => item.hotkey === k);
  }

  function isFunctionKey(key) {
    return /^F([1-9]|1[0-2])$/.test(key);
  }

  global.TallyKeyboard = {
    GATEWAY_MENU,
    TOP_BAR_SHORTCUTS,
    FUNCTION_KEYS,
    MENU_COUNT,
    isEditableTarget,
    wrapMenuIndex,
    findMenuIndexByHotkey,
    isFunctionKey,
  };
})(typeof window !== 'undefined' ? window : global);
