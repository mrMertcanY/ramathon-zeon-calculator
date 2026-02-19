import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const UNITS = [
  { id: 'hours', label: 'Saat' },
  { id: 'minutes', label: 'Dakika' },
  { id: 'seconds', label: 'Saniye' }
];

const StyledUnitToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: 'none',
  borderRadius: 0,
  color: theme.palette.text.secondary,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '6px 12px',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
  },
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 1,
      boxShadow: `0 0 8px ${theme.palette.primary.main}80`,
    }
  },
}));

export function UnitSelector({ activeUnit, onChange }) {
  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      onChange(newUnit);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 4, 
      pt: 3, 
      borderTop: '1px solid rgba(255,255,255,0.05)' 
    }}>
      <ToggleButtonGroup
        value={activeUnit}
        exclusive
        onChange={handleUnitChange}
        aria-label="time unit"
        sx={{ gap: 2 }}
      >
        {UNITS.map((unit) => (
          <StyledUnitToggleButton key={unit.id} value={unit.id} disableRipple>
            {unit.label}
          </StyledUnitToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
