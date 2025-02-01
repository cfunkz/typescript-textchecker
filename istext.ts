import fs from 'fs'

const checkByteContent = (filepath: string): boolean => {
  try {
    const buffer = fs.readFileSync(filepath)
    if (buffer.length === 0) return false // Return false for empty files

    const sampleSize = buffer.length
    let nonTextCount = 0

    // Count the unprintable chars in the file
    for (let i = 0; i < sampleSize; i++) {
      const byte = buffer[i]
      // Check for unprintable chars (not text)
      if ((byte < 32 || byte > 126) && ![9, 10, 13].includes(byte)) {
        nonTextCount++
      }
    }

    // False if more than 1% of the file is unprintable
    return (nonTextCount / sampleSize) < 0.01
  } catch (error) {
    console.error('Error during byte check:', error)
    return false
  }
}

// Main function
export const isTextFile = async (filepath: string): Promise<boolean> => {
  return checkByteContent(filepath)
}
