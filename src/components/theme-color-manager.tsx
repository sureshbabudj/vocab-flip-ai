import { useEffect } from 'react';

export const ThemeColorManager: React.FC = () => {
  useEffect(() => {
    const updateThemeColor = () => {
      // Get the current theme
      const isDark = document.documentElement.classList.contains('dark');

      // Define theme colors based on CSS variables
      const lightThemeColor = '#FDFCFE'; // Light background
      const darkThemeColor = '#1C1C1E'; // Dark background (approximate)

      const themeColor = isDark ? darkThemeColor : lightThemeColor;

      // Update the theme-color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', themeColor);

      console.log(
        'Theme color updated:',
        themeColor,
        isDark ? '(dark)' : '(light)',
      );
    };

    // Initial update
    updateThemeColor();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateThemeColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};
