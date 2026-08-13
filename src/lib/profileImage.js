import imageCompression from 'browser-image-compression'

/**
 * Compress a profile photo and return a data URL small enough for POST /auth/register.
 */
export async function fileToProfileDataUrl(file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 512,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
    useWebWorker: true,
  })

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(compressed)
  })
}
