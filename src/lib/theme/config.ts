export const theme = {
  colors: {
    primary: '#0F172A', // Slate 900 - Deep industrial blue/black
    secondary: '#334155', // Slate 700
    accent: '#57534e', // Stone 600 - Warm brown tone
    background: '#ffffff',
    surface: '#F8FAFC', // Slate 50
    text: '#0F172A',
    textMuted: '#64748B',
  },
  fonts: {
    display: 'Manrope, sans-serif',
    body: 'Inter, sans-serif',
    heritage: 'Playfair Display, serif',
  },
  radius: 'sm', // Industrial feel = tighter radii
  animation: {
    duration: {
      fast: 0.3,
      medium: 0.6,
      slow: 1.2,
    },
    ease: {
      out: 'power2.out',
      inOut: 'power2.inOut',
      sharp: 'expo.out',
    }
  }
}
