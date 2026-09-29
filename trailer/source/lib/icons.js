/* Icônes au trait (24×24), dessinées pour le trailer. */
window.ICONS = {
  home: '<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.8V20h12.4V9.8"/><path d="M10 20v-5.2h4V20"/>',
  book: '<path d="M3.5 5.6c2.9-1.4 5.8-1.4 8.5.6v13.6c-2.7-2-5.6-2-8.5-.6z"/><path d="M20.5 5.6c-2.9-1.4-5.8-1.4-8.5.6v13.6c2.7-2 5.6-2 8.5-.6z"/>',
  cards: '<rect x="3.5" y="7" width="12.5" height="13.5" rx="2"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V16"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2"/>',
  frise: '<path d="M2.8 12h18.4"/><circle cx="6" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18" cy="12" r="1.9"/><path d="M6 8V6M12 16v2M18 8V6"/>',
  timer: '<circle cx="12" cy="13.5" r="7.3"/><path d="M12 13.5V9.6M9.6 2.8h4.8M18.4 6.6l1.4-1.4"/>',
  mic: '<rect x="9" y="3.2" width="6" height="10.8" rx="3"/><path d="M5.6 11a6.4 6.4 0 0 0 12.8 0M12 17.4V20.8"/>',
  check: '<path d="M5 12.6l4.4 4.4L19.2 7.2"/>',
  x: '<path d="M7 7l10 10M17 7 7 17"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/>',
  spark: '<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4 18 18M18 6l-2.6 2.6M8.6 15.4 6 18"/>',
  quote: '<path d="M4.5 17.5c0-5.8 1.9-8.8 5.8-9.8M13.5 17.5c0-5.8 1.9-8.8 5.8-9.8"/><path d="M4.5 17.5h4.7v-4.7H4.5zM13.5 17.5h4.7v-4.7h-4.7z"/>',
};
window.icon = (n, size = 20, extra = "") =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" ${extra}>${window.ICONS[n] || ""}</svg>`;
