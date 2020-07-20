export function isNumber (value) {
  // condition checks that the value is equal to the number.
  // Look here: https://stackoverflow.com/a/16655847
  return Number(parseFloat(value)) === value
}
