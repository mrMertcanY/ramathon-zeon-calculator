import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CloseIcon from '@mui/icons-material/Close';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { styled, keyframes } from '@mui/material/styles';

import SpeedClickerGame from './games/SpeedClicker';
import ReactionGame from './games/ReactionGame';
import NecoIftarGame from './games/NecoIftar';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const GameButton = styled(Button)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
    transform: 'translateY(-4px)',
  }
}));

// Main MiniGames Component
export default function MiniGames({ onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // 'reaction' or 'clicker'

  const handleOpen = () => {
    setOpen(true);
    if (onOpenChange) onOpenChange(true);
  };
  const handleClose = () => {
    setOpen(false);
    setActiveGame(null);
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        onClick={handleOpen}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          animation: `${pulseAnimation} 2s infinite`,
          zIndex: 9999
        }}
        aria-label="games"
      >
        <SportsEsportsIcon />
      </Fab>

      {/* Main Games Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 5, 5, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'white',
            borderRadius: 3,
            minHeight: '400px'
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>

          {!activeGame ? (
            <GameMenu setActiveGame={setActiveGame} />
          ) : activeGame === 'reaction' ? (
            <ReactionGame onBack={() => setActiveGame(null)} />
          ) : activeGame === 'neco' ? (
            <NecoIftarGame onBack={() => setActiveGame(null)} />
          ) : (
            <SpeedClickerGame onBack={() => setActiveGame(null)} />
          )}
        </Box>
      </Dialog>
    </>
  );
}

// Menu Selection View
function GameMenu({ setActiveGame }) {
  const reactionHighScore = localStorage.getItem('minigame_reaction_hs') || '0';
  const clickerHighScore = localStorage.getItem('minigame_clicker_hs') || '0';

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
        Uyku Açıcılar
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Yayın sırasında kendine gelmek için mini oyunlar oyna. Rekorları kır!
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <GameButton onClick={() => setActiveGame('clicker')}>
            <TouchAppIcon sx={{ fontSize: 48, mb: 1, color: 'primary.light' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>Tıklama Şovu</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              10 saniyede kaç kere tıklayabilirsin?
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 'auto' }}>
              Rekor: {clickerHighScore} kez
            </Typography>
          </GameButton>
        </Box>

        <Box sx={{ flex: 1 }}>
          <GameButton onClick={() => setActiveGame('reaction')}>
            <FlashOnIcon sx={{ fontSize: 48, mb: 1, color: '#f59e0b' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>Refleks Testi</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
               Yeşil olunca hemen tıkla! (MS cinsinden)
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#f59e0b', mt: 'auto' }}>
              Rekor: {reactionHighScore} ms
            </Typography>
          </GameButton>
        </Box>

        <Box sx={{ flex: 1 }}>
          <GameButton onClick={() => setActiveGame('neco')}>
            <RestaurantIcon sx={{ fontSize: 48, mb: 1, color: '#10b981' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>Neco İftar</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
               Neco'yu kaydır, yemekleri kap, bombalardan kaç!
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#10b981', mt: 'auto' }}>
              Rekor: {localStorage.getItem('minigame_neco_hs') || '0'} 
            </Typography>
          </GameButton>
        </Box>
      </Box>
    </Box>
  );
}
