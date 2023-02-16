import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        brand: {
            50: '#eff5ff',
            100: '#dbe8fe',
            200: '#bfd7fe',
            300: '#92befe',
            400: '#5f9afb',
            500: '#3974f7',
            600: '#2455ec',
            700: '#1c41d9',
            800: '#1d36b0',
            900: '#1d328b'
        },
        fixedBlue: {
            100: '#3974f7'
        },
        gray: {
            '50': '#f6f6f7',
            '100': '#e1e4e6',
            '200': '#c2c8cd',
            '300': '#9ca3ac',
            '400': '#777f8a',
            '500': '#5c6570',
            '600': '#485059',
            '700': '#3c4149',
            '800': '#33373c',
            '900': '#202225'
        }
    }
});

export default theme;
