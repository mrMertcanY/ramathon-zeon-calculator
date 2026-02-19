import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

export const TYPES = {
  DONATION: { id: 'donation', label: 'Bağış', placeholder: 'TL miktarını girin', rate: 25 }, 
  SUBSCRIBER: { id: 'subscriber', label: 'Abone', placeholder: 'Abone sayısını girin', rate: 1 / 7 }, 
};

export const RATES = {
  donation: 0.04,
  subscriber: 7,
  blerp: 0.02,
  kicks: 0.016
};

export const TYPE_CONFIG = [
  { id: 'donation', label: 'Bağış', placeholder: 'TL miktarını girin' },
  { id: 'subscriber', label: 'Abone', placeholder: 'Abone sayısını girin' },
  { id: 'blerp', label: 'Blerp', placeholder: 'Blerp miktarını girin' },
  { id: 'kicks', label: 'Kicks', placeholder: 'Kicks miktarını girin' }
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  padding: 4,
  gap: 4,
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    borderRadius: 12,
    margin: 0,
    flex: 1,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: 12,
    },
    '&:first-of-type': {
      borderRadius: 12,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: '10px 16px',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.palette.text.primary,
  },
}));

export function TypeSelector({ activeType, onChange }) {
  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      onChange(newType);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={activeType}
      exclusive
      onChange={handleTypeChange}
      aria-label="calculation type"
    >
      {TYPE_CONFIG.map((type) => (
        <StyledToggleButton key={type.id} value={type.id}>
          {type.label}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
}
