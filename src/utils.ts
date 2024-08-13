import * as d3 from 'd3';

/**
 * Maps a numerical desirability value to a corresponding color using a quantized color scale.
 *
 * This function uses D3's `scaleQuantize` to map an input value between -1 and 1
 * to a discrete color from a predefined range. The color scale is intended to represent
 * a gradient from undesirable to neutral to desirable, with the colors transitioning
 * from warm to cool.
 *
 * @param {number} value - A numerical value representing the desirability, 
 *                         expected to be within the range [-1, 1].
 * @returns {string} A color code in hexadecimal format that corresponds to the 
 *                   input value on the desirability scale.
 *
 * Example:
 * ```typescript
 * const color = mapDesirabilityToColor(0.5);
 * console.log(color); // might output "#aee5a3"
 * ```
 */
export const mapDesirabilityToColor = (value: number) => {
  const colorScale = d3.scaleQuantize<string>()
    .domain([-1, 1])
    .range(["#fc9d5a", "#ffb582", "#ffceab", "#ffe6d5", "#ffffff", "#d7f3d1", "#aee5a3", "#81d876", "#48c946"]);
  return colorScale(value);
}

/**
 * Maps a string value to a corresponding CSS background style.
 *
 * This function checks if the provided string starts with the word "Unknown."
 * If it does, it returns a CSS linear gradient that creates a striped pattern.
 * If the value is undefined or doesn't start with "Unknown," it returns 'transparent'.
 * 
 * This can be useful for visually indicating unknown or unspecified values in a UI.
 *
 * @param {string | undefined} value - A string value that may be undefined. The function 
 *                                     checks if this value starts with 'Unknown'.
 * @returns {string} A CSS background property value. If the value starts with 'Unknown',
 *                   it returns a striped pattern as a linear gradient. Otherwise, it returns 'transparent'.
 */
export const mapValueToBackground = (value: string | undefined) => {
  if (value?.startsWith('Unknown')) {
    return 'linear-gradient(135deg, transparent 45%, black 45%, black 55%, transparent 55%)';
  } else {
    return 'transparent';
  }
}

