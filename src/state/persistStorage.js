/**
 * redux-persist storage adapter for the browser.
 * Avoids broken default imports from `redux-persist/lib/storage` under Vite/ESM
 * (where storage.getItem may not be a function).
 */
export const persistStorage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
}
