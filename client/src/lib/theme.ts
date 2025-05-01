export type Theme = 'light' | 'dark' | 'system';

// Function to get the system theme
export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

// Function to get the actual theme based on preference
export const getActiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

// Function to set theme class on document
export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Function to save theme preference to local storage
export const saveThemePreference = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
};

// Function to get saved theme from local storage
export const getSavedTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  return savedTheme || 'system';
};
