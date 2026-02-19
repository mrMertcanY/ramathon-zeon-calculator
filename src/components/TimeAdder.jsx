import { useState, useMemo, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Move TimeInput outside to prevent re-renders losing focus
const TimeInput = ({ label, value, onChange }) => (
  <TextField
    label={label}
    type="number"
    value={value}
    onChange={onChange}
    variant="outlined"
    size="small"
    InputLabelProps={{ shrink: true, style: { color: '#EF4444' } }}
    sx={{ 
      '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255,255,255,0.03)' },
      '& input': { textAlign: 'center' }
    }}
  />
);

export default function TimeAdder() {
  // Fixed finish date: 18.02.2026 - 18:36
  const START_DATE = new Date('2026-02-18T18:36:00'); 
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsedDuration = useMemo(() => {
    const diff = Math.max(0, Math.floor((currentTime - START_DATE) / 1000));
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return { d, h, m, s, totalSeconds: diff };
  }, [currentTime]);

  const [addTime, setAddTime] = useState({ days: '', hours: '', minutes: '', seconds: '' });

  const handleAddChange = (field) => (event) => {
    setAddTime({ ...addTime, [field]: event.target.value });
  };

  const totalDuration = useMemo(() => {
    const getSeconds = (t) => {
      const d = parseInt(t.days || 0) * 86400;
      const h = parseInt(t.hours || 0) * 3600;
      const m = parseInt(t.minutes || 0) * 60;
      const s = parseInt(t.seconds || 0);
      return d + h + m + s;
    };

    const totalSec = elapsedDuration.totalSeconds + getSeconds(addTime);

    // Calculate total hours directly instead of separating days for the RESULT
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return { h, m, s };
  }, [elapsedDuration, addTime]);

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Card elevation={24}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="overline" display="block" align="center" color="text.secondary" sx={{ mb: 3, letterSpacing: 2 }}>
            Ne yapıyordu ya?
          </Typography>

          {/* Current Time Section (Read Only) */}
          <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="white" sx={{ mb: 2, fontWeight: 700 }}>
              Mevcut Yayın Süresi
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h5" color="white" fontWeight="700">
                {elapsedDuration.d}<span style={{ fontSize: '0.8rem', color: '#EF4444', marginLeft: 2 }}>G</span>
              </Typography>
              <Typography variant="h5" color="white" fontWeight="700">
                {elapsedDuration.h}<span style={{ fontSize: '0.8rem', color: '#EF4444', marginLeft: 2 }}>Sa</span>
              </Typography>
              <Typography variant="h5" color="white" fontWeight="700">
                {elapsedDuration.m}<span style={{ fontSize: '0.8rem', color: '#EF4444', marginLeft: 2 }}>Dk</span>
              </Typography>
              <Typography variant="h5" color="white" fontWeight="700">
                {elapsedDuration.s}<span style={{ fontSize: '0.8rem', color: '#EF4444', marginLeft: 2 }}>Sn</span>
              </Typography>
            </Box>
            <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>
              Başlangıç: 18.02.2026 - 18:36
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, color: 'text.secondary' }}>
            <AddCircleOutlineIcon sx={{ fontSize: 32, opacity: 0.5 }} />
          </Box>

          {/* Add Time Section */}
          <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" color="white" sx={{ mb: 2, fontWeight: 700 }}>
              Eklenecek Süre
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}><TimeInput label="Gün" value={addTime.days} onChange={handleAddChange('days')} /></Grid>
              <Grid item xs={3}><TimeInput label="Saat" value={addTime.hours} onChange={handleAddChange('hours')} /></Grid>
              <Grid item xs={3}><TimeInput label="Dk" value={addTime.minutes} onChange={handleAddChange('minutes')} /></Grid>
              <Grid item xs={3}><TimeInput label="Sn" value={addTime.seconds} onChange={handleAddChange('seconds')} /></Grid>
            </Grid>
          </Box>

          {/* Result Section */}
          <Box sx={{ textAlign: 'center', py: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Toplam Süre
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h4" color="white" fontWeight="900">
                {totalDuration.h}<span style={{ fontSize: '1rem', color: '#EF4444', marginLeft: 2 }}>Sa</span>
              </Typography>
              <Typography variant="h4" color="white" fontWeight="900">
                {totalDuration.m}<span style={{ fontSize: '1rem', color: '#EF4444', marginLeft: 2 }}>Dk</span>
              </Typography>
              <Typography variant="h4" color="white" fontWeight="900">
                {totalDuration.s}<span style={{ fontSize: '1rem', color: '#EF4444', marginLeft: 2 }}>Sn</span>
              </Typography>
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
