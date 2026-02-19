import { useState, useMemo } from 'react';
import { TypeSelector, TYPE_CONFIG, RATES } from './TypeSelector';
import { UnitSelector } from './UnitSelector';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

export default function Calculator() {
  const [inputType, setInputType] = useState('donation');
  // Independent state for each input type
  const [inputValues, setInputValues] = useState({
    donation: '',
    subscriber: '',
    blerp: '',
    kicks: ''
  });
  const [outputUnit, setOutputUnit] = useState('minutes');

  const activeConfig = TYPE_CONFIG.find(t => t.id === inputType);

  // Handle input change for the specific type
  const handleInputChange = (event) => {
    const val = event.target.value;
    setInputValues(prev => ({
      ...prev,
      [inputType]: val
    }));
  };

  const currentInputValue = inputValues[inputType];

  const result = useMemo(() => {
    const val = parseFloat(currentInputValue);
    if (isNaN(val) || val < 0) return 0;

    const minutes = val * RATES[inputType];

    if (outputUnit === 'hours') return minutes / 60;
    if (outputUnit === 'seconds') return minutes * 60;
    return minutes;
  }, [inputType, currentInputValue, outputUnit]);

  // Format the result
  const formattedResult = useMemo(() => {
    if (result === 0) return "0";
    
    // For integers or clean decimals, don't show too many places
    const str = result.toFixed(2);
    return str.endsWith('.00') ? str.slice(0, -3) : str;
  }, [result]);

  return (
    <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      <Card elevation={24}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="overline" 
            display="block" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 3, letterSpacing: 2, fontWeight: 500 }}
          >
            Ne yapıyordu ya?
          </Typography>

          <TypeSelector activeType={inputType} onChange={setInputType} />

          <Box sx={{ mb: 4 }}>
             <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block', fontWeight: 500 }}>
               {activeConfig.label} Girişi
             </Typography>
             <TextField
               fullWidth
               type="number"
               variant="outlined"
               placeholder={activeConfig.placeholder}
               value={currentInputValue}
               onChange={handleInputChange}
               InputProps={{
                 // endAdornment: <InputAdornment position="end">{inputType === 'donation' ? 'TL' : ''}</InputAdornment>,
                 sx: { 
                   color: 'common.white',
                   fontWeight: 500,
                 }
               }}
               sx={{
                 input: { textAlign: 'left' }
               }}
             />
          </Box>

          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              Hesaplanan Süre
            </Typography>
            <Typography 
              variant="h2" 
              component="div" 
              color="common.white"
              sx={{ 
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              {formattedResult}
              <Typography 
                component="span" 
                variant="h5" 
                color="primary" 
                sx={{ ml: 1, fontWeight: 700 }}
              >
                {outputUnit === 'hours' ? 'sa' : outputUnit === 'minutes' ? 'dk' : 'sn'}
              </Typography>
            </Typography>
          </Box>

          <UnitSelector activeUnit={outputUnit} onChange={setOutputUnit} />
        </CardContent>
      </Card>
      
      {/* Footer Status - Optional */}
      {/* 
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            px: 2, 
            py: 1, 
            borderRadius: 99, 
            bgcolor: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.05)' 
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            Sistem Aktif
          </Typography>
        </Box>
      </Box>
      */}
    </Box>
  );
}
