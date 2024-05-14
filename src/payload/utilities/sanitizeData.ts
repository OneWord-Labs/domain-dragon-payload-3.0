export const sanitizeData = (data: any): any => {
  return data.map((item: any) => {
    const sanitizedItem: any = {}
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const sanitizedKey = key.replace(/\r/g, '').trim()
        if (typeof item[key] === 'string')
          sanitizedItem[sanitizedKey] = item[key].replace(/\r/g, '').trim()
        else sanitizedItem[sanitizedKey] = item[key]
      }
    }
    return sanitizedItem
  })
}
