import imageCompression from 'browser-image-compression'

/** Max stored profile photo size after compression (decoded). */
export const MAX_PROFILE_IMAGE_KB = 280

export function profileImageTooLargeMessage() {
  return `La capacité de l'image est trop grande. Taille maximale : ${MAX_PROFILE_IMAGE_KB} Ko`
}

export function isProfileImageTooLargeError(error) {
  const msg = String(error?.message || error || '')
  return (
    error?.name === 'ProfileImageTooLargeError' ||
    /too large|trop grande|400_000|500_000|picture:/i.test(msg)
  )
}

export class ProfileImageTooLargeError extends Error {
  constructor() {
    super(profileImageTooLargeMessage())
    this.name = 'ProfileImageTooLargeError'
  }
}

function dataUrlBytes(dataUrl) {
  const comma = dataUrl.indexOf(',')
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  return Math.ceil((b64.length * 3) / 4)
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Accept any original photo size, compress until it fits the KB limit.
 * Throws ProfileImageTooLargeError only if it still cannot fit.
 */
export async function fileToProfileDataUrl(file) {
  const maxBytes = MAX_PROFILE_IMAGE_KB * 1024
  const passes = [
    { maxSizeMB: 0.28, maxWidthOrHeight: 1920, initialQuality: 0.85 },
    { maxSizeMB: 0.22, maxWidthOrHeight: 1024, initialQuality: 0.75 },
    { maxSizeMB: 0.18, maxWidthOrHeight: 640, initialQuality: 0.65 },
    { maxSizeMB: 0.12, maxWidthOrHeight: 400, initialQuality: 0.5 },
  ]

  let lastDataUrl = ''

  for (const options of passes) {
    const compressed = await imageCompression(file, {
      ...options,
      fileType: 'image/jpeg',
      useWebWorker: true,
    })
    lastDataUrl = await fileToDataUrl(compressed)
    if (dataUrlBytes(lastDataUrl) <= maxBytes) {
      return lastDataUrl
    }
  }

  throw new ProfileImageTooLargeError()
}
