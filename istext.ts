import fs from 'fs'
import { fileTypeFromFile } from 'file-type'

// Check if MIME type includes text/
const checkMimeType = async (filepath: string): Promise<boolean> => {
  try {
    const fileType = await fileTypeFromFile(filepath)
    return fileType ? fileType.mime.startsWith('text/') : false
  } catch (error) {
    console.error('Error during MIME check:', error)
    return false
  }
}

// Start byte check to see if file has any weird characters
const checkByteContent = (filepath: string): boolean => {
  try {
    const buffer = fs.readFileSync(filepath)
    if (buffer.length === 0) return false // Return false for empty files

    const sampleSize = buffer.length
    let nonTextCount = 0

    // Count the non-text chars in the file
    for (let i = 0; i < sampleSize; i++) {
      const byte = buffer[i]
      // Check for unprintable chars (not text)
      if ((byte < 32 || byte > 126) && ![9, 10, 13].includes(byte)) {
        nonTextCount++
      }
    }

    // False if more than 1% of the file is non-text
    return (nonTextCount / sampleSize) < 0.01
  } catch (error) {
    console.error('Error during byte check:', error)
    return false
  }
}

// Main function
export const isTextFile = async (filepath: string): Promise<boolean> => {
  const isMimeText = await checkMimeType(filepath)
  if (isMimeText) return true

  // If MIME check fails, do byte check
  return checkByteContent(filepath)
}
