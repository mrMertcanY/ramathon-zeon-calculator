import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function SpeedClickerGame({ onBack }) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('minigame_clicker_hs') || '0'));

  useEffect(() => {
    let interval;
    if (playing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (playing && timeLeft === 0) {
      setPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(interval);
  }, [playing, timeLeft]);

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('minigame_clicker_hs', score.toString());
      }
    }
  }, [gameOver, score, highScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameOver(false);
    setPlaying(true);
  };

  const handleClick = () => {
    if (playing) setScore(s => s + 1);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Button size="small" onClick={onBack} sx={{ position: 'absolute', left: 8, top: 8 }}>Geçmişe Dön</Button>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Tıklama Şovu</Typography>
      
      {!playing && !gameOver ? (
        <Button variant="contained" color="primary" size="large" onClick={startGame} sx={{ mt: 5, py: 2, px: 4, borderRadius: 8 }}>
          Başla (10 Saniye)
        </Button>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            <Typography variant="h6" color={timeLeft <= 3 ? "error" : "text.secondary"}>Süre: 00:{timeLeft.toString().padStart(2, '0')}</Typography>
            <Typography variant="h6" color="primary">Puan: {score}</Typography>
          </Box>

          <Button 
            fullWidth 
            disableRipple
            variant="contained"
            onClick={handleClick}
            disabled={gameOver}
            sx={{ 
              height: 200, 
              fontSize: '2rem', 
              fontWeight: 'black',
              backgroundColor: playing ? 'primary.dark' : 'rgba(255,255,255,0.05)',
              '&:active': { transform: 'scale(0.95)' },
              transition: 'transform 0.1s'
            }}
          >
            {gameOver ? `Skor: ${score}` : 'TIKLA!'}
          </Button>

          {gameOver && (
            <Box sx={{ mt: 3 }}>
              {score >= highScore && score > 0 && <Typography color="success.main" variant="h6" sx={{ mb: 1 }}>🔥 YENİ REKOR! 🔥</Typography>}
              <Button variant="outlined" onClick={startGame} sx={{ mt: 1 }}>Tekrar Oyna</Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
