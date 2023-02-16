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
        }
    }
});

export default theme;
