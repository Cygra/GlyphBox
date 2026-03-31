// Background service worker for GlyphBox
// Opens the side panel when the extension action is clicked

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
