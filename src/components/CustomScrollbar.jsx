import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

const CustomScrollbar = ({ children }) => {
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(50);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Yeni durum

  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);
  const lastScrollTop = useRef(0);
  const scrollEndTimer = useRef(null);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    
    if (scrollHeight <= clientHeight) {
      setShowScrollbar(false);
      return;
    }
    
    setShowScrollbar(true);
    // Aktif kaydırma durumunu ayarla (glow için)
    setIsScrolling(true);
    
    const currentScrollTop = scrollTop;
    lastScrollTop.current = currentScrollTop;
    
    // Clear the scroll end timer and start a new one
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150); // Kaydırma bittikten 150ms sonra glow söner

    const maxScrollTop = scrollHeight - clientHeight;
    const progress = currentScrollTop / maxScrollTop;
    setScrollProgress(progress);
    
    // Calculate thumb height proportionally (minimum 30px)
    const calculatedHeight = (clientHeight / scrollHeight) * clientHeight;
    setThumbHeight(Math.max(30, calculatedHeight));
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    
    // Also observe DOM mutations inside children to update scrollbar if content size changes
    const observer = new MutationObserver(handleScroll);
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true, characterData: true });
    }
    
    return () => {
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
    };
  }, [handleScroll]);

  const onPointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = contentRef.current.scrollTop;
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = useCallback((e) => {
    if (!isDragging || !contentRef.current) return;
    
    const { scrollHeight, clientHeight } = contentRef.current;
    
    // Height of the track area minus the thumb creates the scrollable drag range for the thumb
    const trackMax = clientHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    
    if (trackMax === 0) return;
    
    const deltaY = e.clientY - dragStartY.current;
    const scrollDelta = (deltaY / trackMax) * maxScrollTop;
    
    contentRef.current.scrollTop = dragStartScrollTop.current + scrollDelta;
  }, [isDragging, thumbHeight]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        overflow: 'hidden' 
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Scrollable Content Container */}
      <Box
        ref={contentRef}
        onScroll={handleScroll}
        sx={{
          flexGrow: 1,
          height: '100%',
          overflowY: 'auto',
          scrollBehavior: isDragging ? 'auto' : 'smooth', // Pürüzsüz tekerlek, anlık sürükleme
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' } // Chrome/Safari/Edge
        }}
      >
        {children}
      </Box>

      {/* Floating Track & Thumb */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '14px',
          height: '100%',
          transition: 'opacity 0.4s ease',
          opacity: showScrollbar && (isHovering || isDragging || isScrolling) ? 1 : 0,
          zIndex: 9999,
          pointerEvents: 'none' // Let clicks pass if not on thumb
        }}
      >
        {/* Thumb */}
        <Box
          onPointerDown={onPointerDown}
          sx={{
            position: 'absolute',
            right: '4px', // Margin from screen edge
            width: '6px',
            height: `${thumbHeight}px`,
            top: `calc(${scrollProgress * 100}% - ${scrollProgress * thumbHeight}px)`,
            borderRadius: '10px',
            pointerEvents: 'auto',
            cursor: isDragging ? 'grabbing' : 'grab',
            // SADECE renk, gölge ve transparanlık için animasyon
            transition: isDragging ? 'none' : 'background-color 0.2s ease, box-shadow 0.2s ease',
            
            // Standart Karanlık/Kırmızı Durum (Durduğunda Saydam ve Mat)
            backgroundColor: 'rgba(239, 68, 68, 0.4)',
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.2), inset 0 0 2px rgba(239, 68, 68, 0.1)',
            
            // Kaydırma (Tekerlek), Sürükleme veya Üzerine Gelme Durumunda Glow Efekti (Aktif)
            ...((isDragging || isHovering || isScrolling) && {
              backgroundColor: '#ef4444',
              boxShadow: '0 0 15px rgba(239, 68, 68, 1), 0 0 5px rgba(239, 68, 68, 0.8) inset'
            })
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomScrollbar;
