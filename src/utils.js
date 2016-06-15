// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
export const endsWith = (str, searchString, pos) => {
  const subjectString = str.toString()
  let position = pos
  if (typeof position !== 'number'
      || !isFinite(position)
      || Math.floor(position) !== position
      || position > subjectString.length) {
    position = subjectString.length
  }
  position -= searchString.length
  const lastIndex = subjectString.indexOf(searchString, position)
  return lastIndex !== -1 && lastIndex === position
}

