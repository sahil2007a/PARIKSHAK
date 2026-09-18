export const THEME = {
  colors: {
    primary: '#FF5722',         // Fiery Orange
    primaryGlow: '#FF9100',     // Glowing Ember
    goldCore: '#FFD700',        // Incandescent Core
    cyanAccent: '#00E5FF',      // AR Sci-Fi Cyan
    success: '#00E676',         // Bright Green
    danger: '#FF1744',          // Danger Red
    warning: '#FFEA00',         // Warning Yellow
    
    // Backgrounds & Glassmorphism
    bgDark: '#080A0F',
    cardGlass: 'rgba(15, 20, 28, 0.82)',
    cardGlassLight: 'rgba(25, 32, 45, 0.65)',
    cardBorder: 'rgba(255, 87, 34, 0.35)',
    cardBorderSubtle: 'rgba(255, 255, 255, 0.12)',
    
    // Typography
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textHighlight: '#FFE082',
  },
  
  shadows: {
    fireGlow: {
      shadowColor: '#FF5722',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.85,
      shadowRadius: 18,
      elevation: 10,
    },
    cyanGlow: {
      shadowColor: '#00E5FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.75,
      shadowRadius: 12,
      elevation: 8,
    },
    cardShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
      elevation: 6,
    }
  },

  targetCategories: [
    { id: 'bench', name: 'Park / Workshop Bench', isDefault: true },
    { id: 'lathe machine', name: 'Industrial Lathe Machine', isDefault: true },
    { id: 'electric pole', name: 'Electric / Utility Pole', isDefault: true },
    { id: 'chair', name: 'Chair / Seat', isDefault: true },
    { id: 'laptop', name: 'Laptop / Screen', isDefault: true },
    { id: 'bottle', name: 'Water / Drink Bottle', isDefault: true },
    { id: 'cup', name: 'Coffee Cup / Mug', isDefault: true },
    { id: 'cell phone', name: 'Smartphone / Tablet', isDefault: false },
    { id: 'person', name: 'Person (Self Test)', isDefault: false },
  ]
};
