/**
 * Manim-style colors and color utilities
 */
export declare const COLORS: {
    BLACK: string;
    WHITE: string;
    BLUE: string;
    RED: string;
    GREEN: string;
    YELLOW: string;
    PURPLE: string;
    CYAN: string;
    ORANGE: string;
    PINK: string;
    LIGHT_GRAY: string;
    GRAY: string;
    DARK_GRAY: string;
    LIGHT_BLUE: string;
    LIGHT_RED: string;
    LIGHT_GREEN: string;
    LIGHT_PURPLE: string;
    LIGHT_CYAN: string;
    LIGHT_ORANGE: string;
    LIGHT_PINK: string;
    DARK_BLUE: string;
    DARK_RED: string;
    DARK_GREEN: string;
    DARK_PURPLE: string;
    DARK_CYAN: string;
    DARK_ORANGE: string;
    GOLD: string;
    SILVER: string;
    BROWN: string;
    MAROON: string;
    NAVY: string;
    TEAL: string;
    OLIVE: string;
    LIME: string;
    INDIGO: string;
    VIOLET: string;
};
/**
 * Linear interpolation between two colors
 */
export declare function interpolateColor(color1: string, color2: string, t: number): string;
/**
 * Convert hex color to RGB
 */
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
} | null;
/**
 * Convert RGB to hex
 */
export declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * Get color from name
 */
export declare function getColor(name: keyof typeof COLORS): string;
/**
 * Create a color fade (gradient)
 */
export declare function colorGradient(color1: string, color2: string, steps: number): string[];
/**
 * Lighten a color
 */
export declare function lighten(color: string, amount?: number): string;
/**
 * Darken a color
 */
export declare function darken(color: string, amount?: number): string;
/**
 * Invert a color
 */
export declare function invert(color: string): string;
//# sourceMappingURL=Colors.d.ts.map