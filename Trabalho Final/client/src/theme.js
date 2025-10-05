import { createTheme } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#c51162',
            contrastText: '#fff',
        },
        success: {
            main: green[600],
            contrastText: '#fff',
        },
        warning: {
            main: orange[600],
            contrastText: '#fff',
        },
        // --- FIM DA ADIÇÃO ---
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

export default theme;