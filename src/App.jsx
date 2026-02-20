import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Calculator from './components/Calculator';
import CustomScrollbar from './components/CustomScrollbar';
import MiniGames from './components/MiniGames';
import theme from './theme';
import TimeAdder from './components/TimeAdder';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [gamesOpen, setGamesOpen] = useState(false);
  const containerRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };

    let isThrottled = false;
    const handleMouseMove = (e) => {
      // Performans optimizasyonu: Oyun açıkken mouse işlemini iptal et
      if (gamesOpen) return;
      if (isThrottled) return;
      isThrottled = true;
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
          containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
        isThrottled = false;
      });
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gamesOpen]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        ref={containerRef}
        style={{
          '--mouse-x': `${typeof window !== 'undefined' ? window.innerWidth / 2 : 0}px`,
          '--mouse-y': '0px'
        }}
        sx={{
          height: '100vh',
          width: '100vw',
          background: 'radial-gradient(ellipse at top, rgba(26, 5, 5, 0.8) 0%, transparent 100%)', // Subtle red tint at top, transparent for grid
          position: 'relative',
          overflow: 'hidden',
          '&::before': gamesOpen ? { display: 'none' } : {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Kırmızı glow, daha küçük alan (350px -> 250px)
            background: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(239, 68, 68, 0.4), transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'opacity 0.1s ease',
          },
          '&::after': gamesOpen ? { display: 'none' } : {
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
            // Daha küçük maske alanı (350px -> 200px)
            maskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1), transparent 100%)`,
            WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1), transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 0,
            // 3D pop efekti (scale 1.1 -> 1.2 ve transform origin ile)
            transform: `scale(1.2)`,
            transformOrigin: `var(--mouse-x) var(--mouse-y)`,
            transition: 'opacity 0.1s ease',
          }
        }}
      >
        <Box 
          component="img"
          src="/logo/faviconremovebg.png"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.15, // Subtle background effect
            width: '80%',
            maxWidth: '600px',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
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
        <MiniGames onOpenChange={setGamesOpen} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
