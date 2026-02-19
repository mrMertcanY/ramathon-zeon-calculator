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
import CustomScrollbar from './components/CustomScrollbar';
import theme from './theme';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: 0 });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          background: 'radial-gradient(ellipse at top, rgba(26, 5, 5, 0.8) 0%, transparent 100%)', // Subtle red tint at top, transparent for grid
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.15), transparent 40%)`,
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'background 0.1s ease',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 0,
            // Create the 3D pop effect
            transform: `scale(1.1)`,
            transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
          }
        }}
      >
        <CustomScrollbar>
          <Box 
            sx={{ 
              minHeight: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: { xs: 4, sm: 8 }
            }}
          >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
        </CustomScrollbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
