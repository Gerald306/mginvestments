// Service to notify when teachers or schools are pushed to website
// This allows communication between admin dashboard and main page

class WebsiteUpdateNotifier {
  private listeners: Set<() => void> = new Set();
  private teachersStorageKey = 'mg_website_teachers_updated';
  private schoolsStorageKey = 'mg_website_schools_updated';

  // Subscribe to website update notifications
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners that teachers have been updated
  notifyTeachersUpdated(): void {
    // Update localStorage to persist across page refreshes
    localStorage.setItem(this.teachersStorageKey, Date.now().toString());

    // Notify all current listeners
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in website update listener:', error);
      }
    });

    // Also dispatch a custom event for cross-tab communication
    window.dispatchEvent(new CustomEvent('teachersUpdated', {
      detail: { timestamp: Date.now() }
    }));
  }

  // Notify all listeners that schools have been updated
  notifySchoolsUpdated(): void {
    // Update localStorage to persist across page refreshes
    localStorage.setItem(this.schoolsStorageKey, Date.now().toString());

    // Notify all current listeners
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in website update listener:', error);
      }
    });

    // Also dispatch a custom event for cross-tab communication
    window.dispatchEvent(new CustomEvent('schoolsUpdated', {
      detail: { timestamp: Date.now() }
    }));
  }

  // Check if teachers were recently updated (within last 5 minutes)
  wasTeachersRecentlyUpdated(): boolean {
    const lastUpdate = localStorage.getItem(this.teachersStorageKey);
    if (!lastUpdate) return false;

    const updateTime = parseInt(lastUpdate);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return (now - updateTime) < fiveMinutes;
  }

  // Check if schools were recently updated (within last 5 minutes)
  wasSchoolsRecentlyUpdated(): boolean {
    const lastUpdate = localStorage.getItem(this.schoolsStorageKey);
    if (!lastUpdate) return false;

    const updateTime = parseInt(lastUpdate);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return (now - updateTime) < fiveMinutes;
  }

  // Get last teachers update timestamp
  getLastTeachersUpdateTime(): Date | null {
    const lastUpdate = localStorage.getItem(this.teachersStorageKey);
    if (!lastUpdate) return null;

    return new Date(parseInt(lastUpdate));
  }

  // Get last schools update timestamp
  getLastSchoolsUpdateTime(): Date | null {
    const lastUpdate = localStorage.getItem(this.schoolsStorageKey);
    if (!lastUpdate) return null;

    return new Date(parseInt(lastUpdate));
  }

  // Clear teachers update notification
  clearTeachersUpdateNotification(): void {
    localStorage.removeItem(this.teachersStorageKey);
  }

  // Clear schools update notification
  clearSchoolsUpdateNotification(): void {
    localStorage.removeItem(this.schoolsStorageKey);
  }

  // Listen for storage changes (for cross-tab communication)
  startListening(): void {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if ((event.key === this.teachersStorageKey || event.key === this.schoolsStorageKey) && event.newValue) {
        this.listeners.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('Error in storage update listener:', error);
          }
        });
      }
    });

    // Listen for custom events from same tab
    window.addEventListener('teachersUpdated', () => {
      // Event already handled by notifyTeachersUpdated, but this ensures consistency
    });

    window.addEventListener('schoolsUpdated', () => {
      // Event already handled by notifySchoolsUpdated, but this ensures consistency
    });
  }

  // Stop listening (cleanup)
  stopListening(): void {
    this.listeners.clear();
  }
}

// Create and export singleton instance
export const websiteUpdateNotifier = new WebsiteUpdateNotifier();

// Start listening when module is imported
websiteUpdateNotifier.startListening();

export default websiteUpdateNotifier;
