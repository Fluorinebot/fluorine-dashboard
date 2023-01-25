import { useState } from 'react';

const useTheme = () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('darkThemeEnabled');

    const [isDarkTheme, setDarkTheme] = useState<boolean>(currentTheme ? JSON.parse(currentTheme) : prefersDarkScheme);
    document.body.classList.add(isDarkTheme ? 'dark' : 'light');

    if (!currentTheme) {
        localStorage.setItem('darkThemeEnabled', JSON.stringify(prefersDarkScheme));
    }

    function setThemeStateFromButton() {
        localStorage.setItem('darkThemeEnabled', JSON.stringify(!isDarkTheme));
        setDarkTheme((dark: boolean) => !dark);
        document.body.classList.toggle(isDarkTheme ? 'dark' : 'light');
    }

    return { isDarkTheme, setThemeStateFromButton, setDarkTheme };
};

export default useTheme;
