export function getRandomId() {
  return Math.floor(
    Math.pow(10, 5 - 1) + Math.random() * 9 * Math.pow(10, 5 - 1)
  )
}
