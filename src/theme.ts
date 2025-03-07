
import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#6366F1',
    secondary: '#A5B4FC',
    success: '#22C55E',
    error: '#EF4444',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#2A2A2A',
    card: '#252525',
    inactive: '#6B7280',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  typography: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  }
};
