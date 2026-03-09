/**
 * Manim-style colors and color utilities
 */
// ============================================
// MANIM STANDARD COLORS
// ============================================
export const COLORS = {
    // Primary colors
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    BLUE: '#0087FF',
    RED: '#FC6255',
    GREEN: '#35B100',
    YELLOW: '#FFFF00',
    PURPLE: '#9D4EDD',
    CYAN: '#00D9FF',
    ORANGE: '#FF8C42',
    PINK: '#FF006E',
    // Light variants
    LIGHT_GRAY: '#BBBBBB',
    GRAY: '#888888',
    DARK_GRAY: '#444444',
    // Extended palette
    LIGHT_BLUE: '#61C0FF',
    LIGHT_RED: '#FF9999',
    LIGHT_GREEN: '#78E97B',
    LIGHT_PURPLE: '#D5ACFF',
    LIGHT_CYAN: '#6FE7E8',
    LIGHT_ORANGE: '#FFB366',
    LIGHT_PINK: '#FF99CC',
    // Dark variants
    DARK_BLUE: '#0052CC',
    DARK_RED: '#990000',
    DARK_GREEN: '#003300',
    DARK_PURPLE: '#440066',
    DARK_CYAN: '#004466',
    DARK_ORANGE: '#993300',
    // Special colors
    GOLD: '#FFD700',
    SILVER: '#C0C0C0',
    BROWN: '#8B4513',
    MAROON: '#800000',
    NAVY: '#000080',
    TEAL: '#008080',
    OLIVE: '#808000',
    LIME: '#00FF00',
    INDIGO: '#4B0082',
    VIOLET: '#EE82EE'
};
// ============================================
// COLOR UTILITIES
// ============================================
/**
 * Linear interpolation between two colors
 */
export function interpolateColor(color1, color2, t) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2)
        return color1;
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return rgbToHex(r, g, b);
}
/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
/**
 * Convert RGB to hex
 */
export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}
/**
 * Get color from name
 */
export function getColor(name) {
    return COLORS[name];
}
/**
 * Create a color fade (gradient)
 */
export function colorGradient(color1, color2, steps) {
    const gradient = [];
    for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        gradient.push(interpolateColor(color1, color2, t));
    }
    return gradient;
}
/**
 * Lighten a color
 */
export function lighten(color, amount = 0.2) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return color;
    return rgbToHex(Math.min(255, Math.round(rgb.r + 255 * amount)), Math.min(255, Math.round(rgb.g + 255 * amount)), Math.min(255, Math.round(rgb.b + 255 * amount)));
}
/**
 * Darken a color
 */
export function darken(color, amount = 0.2) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return color;
    return rgbToHex(Math.max(0, Math.round(rgb.r - 255 * amount)), Math.max(0, Math.round(rgb.g - 255 * amount)), Math.max(0, Math.round(rgb.b - 255 * amount)));
}
/**
 * Invert a color
 */
export function invert(color) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return color;
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}
//# sourceMappingURL=Colors.js.map