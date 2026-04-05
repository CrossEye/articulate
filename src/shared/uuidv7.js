import { randomBytes } from 'node:crypto'

// UUID v7: 48-bit millisecond timestamp + 4-bit version + 12-bit random
//          + 2-bit variant + 62-bit random
const uuidv7 = () => {
  const now = Date.now()
  const bytes = randomBytes(16)

  // Timestamp (48 bits, big-endian) in bytes 0–5
  bytes[0] = (now / 2 ** 40) & 0xff
  bytes[1] = (now / 2 ** 32) & 0xff
  bytes[2] = (now / 2 ** 24) & 0xff
  bytes[3] = (now / 2 ** 16) & 0xff
  bytes[4] = (now / 2 ** 8) & 0xff
  bytes[5] = now & 0xff

  // Version 7 (4 bits) in byte 6, high nibble
  bytes[6] = (bytes[6] & 0x0f) | 0x70

  // Variant 10 (2 bits) in byte 8, high bits
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = bytes.toString('hex')
  return (
    hex.slice(0, 8) + '-' +
    hex.slice(8, 12) + '-' +
    hex.slice(12, 16) + '-' +
    hex.slice(16, 20) + '-' +
    hex.slice(20)
  )
}

export { uuidv7 }
