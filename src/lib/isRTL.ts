const isRTLChar = (char: string): boolean => {
  const regex = new RegExp('^[1-9]d{0,2}$')
  // Use Unicode Bidi Mirrored or Right-to-Left characters categories
  return (
    // Check for Right-to-Left characters
    /[\u0600-\u06FF]|[\u05D0-\u05EA]|[\u0780-\u07A6]|[\u06F0-\u06FF]/u.test(char)
  )
}

export const isRTL = (text: string): boolean => {
  return Array.from(text).some((char) => isRTLChar(char))
}
