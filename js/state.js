// Global state management
export class State {
  constructor(storage) {
    this.storage = storage;
    this.data = storage.load();
    this.listeners = new Map();
    this.saveTimeout = null;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.notifyListeners(key, value);
    this.debouncedSave();
  }

  update(updates) {
    Object.keys(updates).forEach((key) => {
      this.data[key] = updates[key];
      this.notifyListeners(key, updates[key]);
    });
    this.debouncedSave();
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  notifyListeners(key, value) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach((callback) => callback(value));
    }
  }

  debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 500);
  }

  save() {
    return this.storage.save(this.data);
  }

  clear() {
    this.data = this.storage.getDefaultData();
    return this.storage.clear();
  }
}
