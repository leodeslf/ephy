// Util.
const radian = Math.PI * 2;

/**
 * Returns the greatest common divisor for `a` and `b`.
 * Concept ref. at: https://en.wikipedia.org/wiki/Greatest_common_divisor
 * @param {number} a
 * @param {number} b
 * @returns {number | false} gcd
 */
function gcd(a, b, isRecursion) {
  if (a === b) return a;

  const max = a > b ? a : b;
  const min = a < b ? a : b;
  if (min === 0) return !isRecursion ? false : max;

  return gcd(max % min, min, true);
}

export { radian, gcd };
