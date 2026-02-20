import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ReactionGame({ onBack }) {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, active, done, early
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const timeoutRef = useRef(null);
  
  const currentHighScoreStr = localStorage.getItem('minigame_reaction_hs');
  const [highScore, setHighScore] = useState(currentHighScoreStr ? parseInt(currentHighScoreStr) : null);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 2000; // 2 to 5 seconds
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setGameState('active');
      setStartTime(Date.now());
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (gameState === 'ready') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'active') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('done');
      
      if (highScore === null || time < highScore) {
        setHighScore(time);
        localStorage.setItem('minigame_reaction_hs', time.toString());
      }
    } else if (gameState === 'done' || gameState === 'early' || gameState === 'waiting') {
      startGame();
    }
  };

  // Colors and texts based on state
  const config = {
    waiting: { color: 'primary.dark', text: 'Başlamak için tıkla' },
    ready:   { color: 'error.main', text: 'Kırmızı, bekle...' },
    active:  { color: 'success.main', text: 'ŞİMDİ TIKLA!' },
    done:    { color: 'text.secondary', text: `${reactionTime} ms. Tekrar için tıkla.` },
    early:   { color: 'info.main', text: 'Çok erken! Tekrar için tıkla.' },
  };

  const currentConf = config[gameState];

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Button size="small" onClick={onBack} sx={{ position: 'absolute', left: 8, top: 8 }}>Geçmişe Dön</Button>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Refleks Testi</Typography>
      
      <Box 
        onClick={handleClick}
        sx={{
          height: 250,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentConf.color,
          cursor: 'pointer',
          userSelect: 'none',
          transition: gameState === 'active' ? 'none' : 'background-color 0.3s',
          border: '2px solid rgba(255,255,255,0.1)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {currentConf.text}
        </Typography>
      </Box>

      {gameState === 'done' && reactionTime <= highScore && (
        <Typography color="success.main" variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
          ⚡ En İyi Refleks! ⚡
        </Typography>
      )}
    </Box>
  );
}
