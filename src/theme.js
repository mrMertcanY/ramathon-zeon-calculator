import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#EF4444', // Red accent
    },
    secondary: {
      main: '#22C55E', // Green accent
    },
    background: {
      default: '#050505',
      paper: '#131313',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#A1A1AA',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 900,
    },
    h2: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundImage: 'none',
          backgroundColor: 'rgba(19, 19, 19, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#EF4444',
          },
        },
        input: {
          padding: '16px',
          fontSize: '1.25rem',
        },
      },
    },
  },
});

export default theme;
