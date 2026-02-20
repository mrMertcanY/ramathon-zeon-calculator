import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NecoIftarGame({ onBack }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const necoImgRef = useRef(null);
  
  const GAME_WIDTH = 350;
  const GAME_HEIGHT = 400;
  
  // Sadece UI katmanı (Başla butonu, Oyun Bitti ekranı) için React State tutuyoruz.
  // Animasyon döngüsü sırasında React state'i KULLANMIYORUZ (RAM enflasyonunu engeller).
  const [uiState, setUiState] = useState({
    isPlaying: false,
    gameOver: false,
    score: 0,
    lives: 3
  });
  
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('minigame_neco_hs') || '0'));

  // Oyunun tüm fizik/matematik değişkenleri bu Ref içinde mutasyona uğrar. Bellek dostudur.
  const gameRef = useRef({
    score: 0,
    lives: 3,
    neco: { x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60, width: 50, height: 50 },
    items: [],
    lastTime: 0,
    animId: null
  });

  const isDraggingRef = useRef(false);

  // Neco resmini bir kere önbelleğe (cache) alalım
  useEffect(() => {
    const img = new Image();
    img.src = '/logo/neco.png';
    necoImgRef.current = img;
  }, []);

  const startGame = () => {
    gameRef.current = {
      score: 0,
      lives: 3,
      neco: { x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60, width: 50, height: 50 },
      items: [],
      lastTime: performance.now(),
      animId: null
    };

    setUiState({
      isPlaying: true,
      gameOver: false,
      score: 0,
      lives: 3
    });

    gameRef.current.animId = requestAnimationFrame(gameLoop);
  };

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    updateNecoPosition(e.clientX);
    document.body.style.userSelect = 'none'; 
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current) updateNecoPosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    document.body.style.userSelect = '';
  };

  const updateNecoPosition = (clientX) => {
    if (!containerRef.current || !uiState.isPlaying || uiState.gameOver) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let newX = clientX - rect.left - 25; 
    
    if (newX < 0) newX = 0;
    if (newX > GAME_WIDTH - 50) newX = GAME_WIDTH - 50;
    
    gameRef.current.neco.x = newX;
  };

  const gameLoop = (currentTime) => {
    const state = gameRef.current;
    
    // Geçen süreyi (delta) bul. Sekme değiştirildiğinde veya lag olduğunda
    // fiziğin bozulmaması için delta'yı maksimum 50ms (0.05 saniye) ile sınırla.
    let deltaTime = currentTime - state.lastTime;
    if (deltaTime > 50) deltaTime = 50; 
    state.lastTime = currentTime;

    // ZORLUK AYARI (Difficulty Scaling)
    // Puan arttıkça çarpan 1.0'dan başlar ve her 30 puanda bir 1 artar.
    let speedMultiplier = 1 + (state.score / 30);
    // Maksimum Hız Sınırı (Cap): Oyun aşırı imkansız olmasın diye hızı en fazla 3.5 katına çıkart.
    speedMultiplier = Math.min(speedMultiplier, 3.5); 
    
    // Rastgele eşya spawn oranı
    const spawnRate = 0.015 * speedMultiplier; 
    
    if (Math.random() < spawnRate) {
      const isBomb = Math.random() < 0.25; 
      const types = ['🍎', '🍔', '🍕', '🌮', '🍩'];
      
      // Temel hızımız saniyede 150 piksel (150 * delta / 1000)
      const baseSpeed = 150;
      // Rastgele bir varyasyon ekle (bazı yiyecekler biraz daha hızlı/yavaş düşebilir)
      const randomVar = 0.8 + Math.random() * 0.5; 
      
      state.items.push({
        x: Math.random() * (GAME_WIDTH - 30),
        y: -30,
        width: 30,
        height: 30,
        isBomb: isBomb,
        speed: baseSpeed * randomVar * speedMultiplier,
        emoji: isBomb ? '💣' : types[Math.floor(Math.random() * types.length)]
      });
    }

    // Pozisyonları güncelle ve Çarpışma Tespitini (Collision) yap
    const shrink = 5;
    const nBox = {
      left: state.neco.x + shrink,
      right: state.neco.x + state.neco.width - shrink,
      top: state.neco.y + shrink,
      bottom: state.neco.y + state.neco.height - shrink
    };

    let hpLost = 0;
    let scoreGained = 0;

    // Bellekte dizi oluşturup (map/filter) atmak yerine geriye doğru döngü yaparak eleman siliyoruz (RAM'i korur).
    for (let i = state.items.length - 1; i >= 0; i--) {
      let item = state.items[i];
      // Hareketi zaman çarpanı ile hesaplayıp piksele çevir (px/s * s = px)
      item.y += item.speed * (deltaTime / 1000);

      const iBox = {
        left: item.x,
        right: item.x + item.width,
        top: item.y,
        bottom: item.y + item.height
      };

      const collision = (nBox.left < iBox.right && nBox.right > iBox.left && nBox.top < iBox.bottom && nBox.bottom > iBox.top);

      if (collision) {
        if (item.isBomb) hpLost += 1;
        else scoreGained += 1;
        
        state.items.splice(i, 1); // Eşyayı diziden çıkar
      } else if (item.y > GAME_HEIGHT) {
        state.items.splice(i, 1); // Ekrandan çıkan eşyayı bellekten sil
      }
    }

    // Skor ve Can güncellemesi
    const oldScore = state.score;
    const oldLives = state.lives;
    
    state.score += scoreGained;
    state.lives -= hpLost;

    // React state'ini SADECE skor veya can değiştiğinde güncelle. (Saniyede 60 kez gereksiz render'ı engeller)
    if (state.score !== oldScore || state.lives !== oldLives) {
      setUiState(prev => ({ ...prev, score: state.score, lives: state.lives }));
    }

    // Çizim İşlemleri (Render to Canvas)
    renderCanvas();

    // Oyun Bitti Kontrolü
    if (state.lives <= 0) {
      setUiState(prev => ({ ...prev, isPlaying: false, gameOver: true }));
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem('minigame_neco_hs', state.score.toString());
      }
      return; // Döngüyü durdur
    }

    // Döngüye devam
    state.animId = requestAnimationFrame(gameLoop);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameRef.current;

    // Ekranı Temizle
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Eşyaları (Emojiler) Çiz
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < state.items.length; i++) {
      let item = state.items[i];
      
      // Bombalarsa etrafına kırmızımsı bir gölge (glow) ekleyebiliriz
      if (item.isBomb) {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      // Emojiyi çiz (genişliğin yarısı kadar kaydırarak tam ortalarından düşürürüz)
      ctx.fillText(item.emoji, item.x + (item.width / 2), item.y);
    }
    
    // Gölgeyi sıfırla
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Neco'yu Çiz
    if (necoImgRef.current && necoImgRef.current.complete) {
      // Neco için küçük bir kırmızı gölge efekti (isteğe bağlı)
      ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      
      ctx.drawImage(necoImgRef.current, state.neco.x, state.neco.y, state.neco.width, state.neco.height);
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
  };

  // Event listener cleanup
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('pointerup', handlePointerUp);
      if (gameRef.current.animId) {
        cancelAnimationFrame(gameRef.current.animId);
      }
    };
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Button size="small" onClick={onBack} sx={{ position: 'absolute', left: 8, top: 8 }}>Geçmişe Dön</Button>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Neco İftar</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
        <Typography variant="h6" color="primary">Puan: {uiState.score}</Typography>
        <Typography variant="h6" color="error">Can: {'❤️'.repeat(Math.max(0, uiState.lives))}</Typography>
      </Box>

      {!uiState.isPlaying && !uiState.gameOver && (
        <Button variant="contained" color="primary" size="large" onClick={startGame} sx={{ mt: 2, py: 2, px: 4, borderRadius: 8 }}>
          Başla
        </Button>
      )}

      {/* Game Viewport Container */}
      {(uiState.isPlaying || uiState.gameOver) && (
        <Box 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: GAME_WIDTH,
            height: GAME_HEIGHT,
            margin: '0 auto',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            backgroundColor: 'rgba(20, 5, 5, 0.8)',
            overflow: 'hidden',
            borderRadius: 2,
            cursor: 'grab',
            touchAction: 'none', 
            mt: 1,
            userSelect: 'none' 
          }}
        >
          {/* SADECE BİR CANVAS. Tüm karmaşık işlemler burada yapılır, RAM şişmez. */}
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            style={{ display: 'block' }}
          />

          {/* Best Score display */}
          <Typography sx={{ position: 'absolute', top: 4, left: 8, fontSize: '0.8rem', color: 'primary.dark', pointerEvents: 'none' }}>
            Rekor: {highScore}
          </Typography>

          {/* Game Over Message Overlay */}
          {uiState.gameOver && (
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              pointerEvents: 'auto'
            }}>
              <Typography variant="h4" color="error" sx={{ fontWeight: 'bold', mb: 2 }}>OYUN BİTTİ</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>Toplanan İftar Yemeği: {uiState.score}</Typography>
              <Button variant="contained" size="large" onClick={(e) => { e.stopPropagation(); startGame(); }} sx={{ mt: 2 }}>
                Tekrar Oyna
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {(uiState.isPlaying || uiState.gameOver) && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
          Neco'yu farenle veya parmağınla sağa sola kaydırarak yemekleri topla, bombalara dikkat et!
        </Typography>
      )}
    </Box>
  );
}
