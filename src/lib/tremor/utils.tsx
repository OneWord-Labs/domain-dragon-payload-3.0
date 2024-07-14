import { DeltaTypes } from './constants'
import { Color, getIsBaseColor, ValueFormatter } from './inputTypes'

export const mapInputsToDeltaType = (deltaType: string, isIncreasePositive: boolean): string => {
  if (isIncreasePositive || deltaType === DeltaTypes.Unchanged) {
    return deltaType
  }
  switch (deltaType) {
    case DeltaTypes.Increase:
      return DeltaTypes.Decrease
    case DeltaTypes.ModerateIncrease:
      return DeltaTypes.ModerateDecrease
    case DeltaTypes.Decrease:
      return DeltaTypes.Increase
    case DeltaTypes.ModerateDecrease:
      return DeltaTypes.ModerateIncrease
  }
  return ''
}

export const defaultValueFormatter: ValueFormatter = (value: number) => value.toString()

export const currencyValueFormatter: ValueFormatter = (e: number) =>
  `$ ${Intl.NumberFormat('en-US').format(e)}`

export const sumNumericArray = (arr: number[]) => arr.reduce((prefixSum, num) => prefixSum + num, 0)

export const isValueInArray = (value: any, array: any[]): boolean => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true
    }
  }
  return false
}

export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

export function makeClassName(componentName: string) {
  return (className: string) => {
    return `tremor-${componentName}-${className}`
  }
}

interface ColorClassNames {
  bgColor: string
  hoverBgColor: string
  selectBgColor: string
  textColor: string
  selectTextColor: string
  hoverTextColor: string
  borderColor: string
  selectBorderColor: string
  hoverBorderColor: string
  ringColor: string
  strokeColor: string
  fillColor: string
}

/**
 * Returns boolean based on a determination that a color should be considered an "arbitrary"
 * Tailwind CSS class.
 * @see {@link https://tailwindcss.com/docs/background-color#arbitrary-values | Tailwind CSS docs}
 */
const getIsArbitraryColor = (color: Color | string) =>
  color.includes('#') || color.includes('--') || color.includes('rgb')

export function getColorClassNames(color: Color | string, shade?: number): ColorClassNames {
  const isBaseColor = getIsBaseColor(color)
  if (color === 'white' || color === 'black' || color === 'transparent' || !shade || !isBaseColor) {
    const unshadedColor = !getIsArbitraryColor(color) ? color : `[${color}]`
    return {
      bgColor: `bg-${unshadedColor} dark:bg-${unshadedColor}`,
      hoverBgColor: `hover:bg-${unshadedColor} dark:hover:bg-${unshadedColor}`,
      selectBgColor: `ui-selected:bg-${unshadedColor} dark:ui-selected:bg-${unshadedColor}`,
      textColor: `text-${unshadedColor} dark:text-${unshadedColor}`,
      selectTextColor: `ui-selected:text-${unshadedColor} dark:ui-selected:text-${unshadedColor}`,
      hoverTextColor: `hover:text-${unshadedColor} dark:hover:text-${unshadedColor}`,
      borderColor: `border-${unshadedColor} dark:border-${unshadedColor}`,
      selectBorderColor: `ui-selected:border-${unshadedColor} dark:ui-selected:border-${unshadedColor}`,
      hoverBorderColor: `hover:border-${unshadedColor} dark:hover:border-${unshadedColor}`,
      ringColor: `ring-${unshadedColor} dark:ring-${unshadedColor}`,
      strokeColor: `stroke-${unshadedColor} dark:stroke-${unshadedColor}`,
      fillColor: `fill-${unshadedColor} dark:fill-${unshadedColor}`,
    }
  }
  return {
    bgColor: `bg-${color}-${shade} dark:bg-${color}-${shade}`,
    selectBgColor: `ui-selected:bg-${color}-${shade} dark:ui-selected:bg-${color}-${shade}`,
    hoverBgColor: `hover:bg-${color}-${shade} dark:hover:bg-${color}-${shade}`,
    textColor: `text-${color}-${shade} dark:text-${color}-${shade}`,
    selectTextColor: `ui-selected:text-${color}-${shade} dark:ui-selected:text-${color}-${shade}`,
    hoverTextColor: `hover:text-${color}-${shade} dark:hover:text-${color}-${shade}`,
    borderColor: `border-${color}-${shade} dark:border-${color}-${shade}`,
    selectBorderColor: `ui-selected:border-${color}-${shade} dark:ui-selected:border-${color}-${shade}`,
    hoverBorderColor: `hover:border-${color}-${shade} dark:hover:border-${color}-${shade}`,
    ringColor: `ring-${color}-${shade} dark:ring-${color}-${shade}`,
    strokeColor: `stroke-${color}-${shade} dark:stroke-${color}-${shade}`,
    fillColor: `fill-${color}-${shade} dark:fill-${color}-${shade}`,
  }
}

export const constructCategoryColors = (
  categories: string[],
  colors: (Color | string)[],
): Map<string, Color | string> => {
  const categoryColors = new Map<string, Color | string>()
  categories.forEach((category, idx) => {
    categoryColors.set(category, colors[idx % colors.length])
  })
  return categoryColors
}

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? 'auto' : minValue ?? 0
  const maxDomain = maxValue ?? 'auto'
  return [minDomain, maxDomain]
}

export const constructCategories = (data: any[], color?: string): string[] => {
  if (!color) {
    return []
  }

  const categories = new Set<string>()
  data.forEach((datum) => {
    categories.add(datum[color])
  })
  return Array.from(categories)
}

export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null)
    return false

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false
  }

  return true
}

// export function deepEqual(obj1: unknown, obj2: unknown): boolean {
//   if (obj1 === obj2) return true;

//   if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null)
//     return false;

//   if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) return false;

//   const keys1 = Object.keys(obj1);
//   const keys2 = new Set(Object.keys(obj2));

//   if (keys1.length !== keys2.size) return false;

//   for (const key of keys1) {
//     if (
//       !keys2.has(key) ||
//       !deepEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])
//     )
//       return false;
//   }

//   return true;
// }

export function hasOnlyOneValueForThisKey(array: any[], keyToCheck: string) {
  const val = []

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck])
      if (val.length > 1) {
        return false
      }
    }
  }

  return true
}
