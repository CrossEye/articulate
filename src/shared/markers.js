// Marker increment logic -- to be ported from RHAM next-marker.js in Milestone 1
// Handles numeric (1, 2, 3), alphabetic (A, B, C), s-numbered (s1, s2),
// and Roman numeral (I, II, III) sequences.

const isRoman = (s) =>
  /^[IVXLCDM]+$/i.test(s)

const romanValues = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

const parseRoman = (s) =>
  [...s.toUpperCase()].reduce((acc, ch, i, arr) =>
    romanValues[ch] < (romanValues[arr[i + 1]] || 0)
      ? acc - romanValues[ch]
      : acc + romanValues[ch]
  , 0)

const toRoman = (n) => {
  const pairs = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let result = ''
  for (const [value, numeral] of pairs) {
    while (n >= value) {
      result += numeral
      n -= value
    }
  }
  return result
}

const nextMarker = (marker) => {
  if (/^\d+$/.test(marker))
    return String(Number(marker) + 1)
  if (/^s\d+$/.test(marker))
    return 's' + (Number(marker.slice(1)) + 1)
  if (/^[a-z]$/i.test(marker)) {
    const code = marker.charCodeAt(0)
    const next = String.fromCharCode(code + 1)
    return marker === marker.toUpperCase() ? next.toUpperCase() : next
  }
  if (isRoman(marker) && marker.length > 1) {
    const val = parseRoman(marker)
    const next = toRoman(val + 1)
    return marker === marker.toLowerCase() ? next.toLowerCase() : next
  }
  return marker
}

export { nextMarker, parseRoman, toRoman, isRoman }
