export function getSwalTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    background: isDark ? '#1a202c' : '#fff',
    color: isDark ? '#fff' : '#1a202c',
  };
}