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

// Taken from http://stackoverflow.com/a/9458996/96855
/*
const arrayBufferToBase64 = (buffer) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const bufferToBase64 =
  typeof window === 'undefined'
  ? buffer => buffer.toString('base64')
  : arrayBufferToBase64
  */

export const arrayBufferToBuffer = (response) => {
  if (Buffer.isBuffer(response.data)) return response
  response.data = new Buffer(response.data)
  return response
}
