import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Calculator from './components/Calculator';
import TimeAdder from './components/TimeAdder';
import theme from './theme';

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at top, rgba(26, 5, 5, 0.8) 0%, transparent 100%)', // Subtle red tint at top, transparent for grid
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1200px',
            height: '100%',
            background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
              Ramathon <Box component="span" sx={{ color: 'primary.main' }}>Zeon</Box>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Yayın Süresi Hesaplayıcı
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Tabs 
              value={tabIndex} 
              onChange={handleTabChange} 
              textColor="primary"
              indicatorColor="primary"
              sx={{ 
                '& .MuiTab-root': { color: 'text.secondary', fontWeight: 700 },
                '& .Mui-selected': { color: 'white' }
              }}
            >
              <Tab label="Süre Ekle" />
              <Tab label="Toplam Süre" />
            </Tabs>
          </Box>

          <Box sx={{ display: tabIndex === 0 ? 'block' : 'none' }}>
            <Calculator />
          </Box>
          <Box sx={{ display: tabIndex === 1 ? 'block' : 'none' }}>
            <TimeAdder />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
