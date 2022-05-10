import { extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#eaeeff',
      },
      '.root': {
        minHeight: '100vh',
      },
    },
  },
  fonts: {
    body: 'Poppins, sans-serif',
  },
  colors: {
    brand: {
      50: '#ccdff7',
      100: '#9ab2d0',
      300: '#4e78ad',
      500: '#023e8a',
      700: '#012b61',
      900: '#011937',
    },
  },
});
