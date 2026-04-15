/**
 * Shared formatters — used across ReviewScreen, SwapContext, and anywhere
 * USD or token amounts need consistent display.
 */

/**
 * Format a number as a USD string: $1,234.56
 * @param {number} n
 * @returns {string}
 */
export function formatUSD(n) {
  return `$${Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a token amount to a given number of decimal places with locale formatting.
 * @param {number} n
 * @param {number} decimals
 * @returns {string}
 */
export function formatTokenAmount(n, decimals) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Uppercase the first character of a string.
 * @param {string} s
 * @returns {string}
 */
export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
