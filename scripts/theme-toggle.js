/**
 * Theme toggle functionality
 * Handles switching between light and dark themes
 */

class ThemeToggle {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  /**
   * Get theme from localStorage
   */
  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Set theme in localStorage
   */
  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    this.setStoredTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  /**
   * Create theme toggle button
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.setAttribute('title', 'Toggle light/dark theme');

    // Add sun icon (for dark mode)
    const sunIcon = document.createElement('div');
    sunIcon.className = 'sun-icon';
    sunIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`;

    // Add moon icon (for light mode)
    const moonIcon = document.createElement('div');
    moonIcon.className = 'moon-icon';
    moonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    button.appendChild(sunIcon);
    button.appendChild(moonIcon);

    // Add click event
    button.addEventListener('click', () => {
      this.toggleTheme();
    });

    return button;
  }

  /**
   * Initialize theme toggle
   */
  init() {
    // Apply initial theme
    this.applyTheme(this.theme);

    // Create and add toggle button
    const toggleButton = this.createToggleButton();
    document.body.appendChild(toggleButton);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        // Only auto-switch if user hasn't manually set a preference
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
  });
} else {
  new ThemeToggle();
}

export default ThemeToggle; 