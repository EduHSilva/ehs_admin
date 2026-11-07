export const gradientBgBase = 'bg-linear-to-tr'
export const gradientBgPurplePink = `${gradientBgBase} from-purple-400 via-pink-500 to-red-500`
export const gradientBgDark = `${gradientBgBase} from-zinc-700 via-zinc-900 to-zinc-800`
export const gradientBgPinkRed = `${gradientBgBase} from-pink-400 via-red-500 to-yellow-500`
export const gradientBgSlateBlue = `${gradientBgBase} from-zinc-100 via-zinc-50 to-indigo-100`

export const colorsBgLight = {
  white: 'bg-white text-black',
  light: 'bg-white text-black dark:bg-zinc-900/70 dark:text-white',
  contrast: 'bg-zinc-800 text-white dark:bg-white dark:text-black',
  success: 'bg-emerald-500 border-emerald-500 text-white',
  danger: 'bg-red-500 border-red-500 text-white',
  warning: 'bg-yellow-500 border-yellow-500 text-white',
  info: 'bg-indigo-500 border-indigo-500 text-white',
}

export const colorsText = {
  white: 'text-black dark:text-zinc-100',
  light: 'text-zinc-700 dark:text-zinc-400',
  contrast: 'dark:text-white',
  success: 'text-emerald-500',
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-indigo-500',
}

export const colorsOutline = {
  white: [colorsText.white, 'border-zinc-100'],
  light: [colorsText.light, 'border-zinc-100'],
  contrast: [colorsText.contrast, 'border-zinc-900 dark:border-zinc-100'],
  success: [colorsText.success, 'border-emerald-500'],
  danger: [colorsText.danger, 'border-red-500'],
  warning: [colorsText.warning, 'border-yellow-500'],
  info: [colorsText.info, 'border-indigo-500'],
}

type ButtonColor = 'white' | 'whiteDark' | 'lightDark' | 'contrast' | 'success' | 'danger' | 'warning' | 'info'

const buttonColorKeys: Record<ButtonColor, true> = {
  white: true,
  whiteDark: true,
  lightDark: true,
  contrast: true,
  success: true,
  danger: true,
  warning: true,
  info: true,
}

const isButtonColor = (value: string): value is ButtonColor =>
  Object.prototype.hasOwnProperty.call(buttonColorKeys, value)

export const getButtonColor = (
  color: ButtonColor | string,
  isOutlined: boolean,
  hasHover: boolean,
  isActive = false,
): string | string[] => {
  const colors: {
    ring: Record<ButtonColor, string>
    active: Record<ButtonColor, string>
    bg: Record<ButtonColor, string>
    bgHover: Record<ButtonColor, string>
    borders: Record<ButtonColor, string>
    text: Record<ButtonColor, string>
    outlineHover: Record<ButtonColor, string>
  } = {
    ring: {
      white: 'ring-zinc-200 dark:ring-zinc-500',
      whiteDark: 'ring-zinc-200 dark:ring-zinc-500',
      lightDark: 'ring-zinc-200 dark:ring-zinc-500',
      contrast: 'ring-zinc-300 dark:ring-zinc-400',
      success: 'ring-emerald-300 dark:ring-emerald-700',
      danger: 'ring-red-300 dark:ring-red-700',
      warning: 'ring-yellow-300 dark:ring-yellow-700',
      info: 'ring-indigo-300 dark:ring-indigo-700',
    },
    active: {
      white: 'bg-zinc-100',
      whiteDark: 'bg-zinc-100 dark:bg-zinc-800',
      lightDark: 'bg-zinc-200 dark:bg-zinc-700',
      contrast: 'bg-zinc-700 dark:bg-zinc-100',
      success: 'bg-emerald-700 dark:bg-emerald-600',
      danger: 'bg-red-700 dark:bg-red-600',
      warning: 'bg-yellow-700 dark:bg-yellow-600',
      info: 'bg-indigo-700 dark:bg-indigo-600',
    },
    bg: {
      white: 'bg-white text-black',
      whiteDark: 'bg-white text-black dark:bg-zinc-900 dark:text-white',
      lightDark: 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white',
      contrast: 'bg-zinc-800 text-white dark:bg-white dark:text-black',
      success: 'bg-emerald-600 dark:bg-emerald-500 text-white',
      danger: 'bg-red-600 dark:bg-red-500 text-white',
      warning: 'bg-yellow-600 dark:bg-yellow-500 text-white',
      info: 'bg-indigo-600 dark:bg-indigo-500 text-white',
    },
    bgHover: {
      white: 'hover:bg-zinc-100',
      whiteDark: 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
      lightDark: 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
      contrast: 'hover:bg-zinc-700 dark:hover:bg-zinc-100',
      success:
        'hover:bg-emerald-700 hover:border-emerald-700 dark:hover:bg-emerald-600 dark:hover:border-emerald-600',
      danger:
        'hover:bg-red-700 hover:border-red-700 dark:hover:bg-red-600 dark:hover:border-red-600',
      warning:
        'hover:bg-yellow-700 hover:border-yellow-700 dark:hover:bg-yellow-600 dark:hover:border-yellow-600',
      info: 'hover:bg-indigo-700 hover:border-indigo-700 dark:hover:bg-indigo-600 dark:hover:border-indigo-600',
    },
    borders: {
      white: 'border-white',
      whiteDark: 'border-white dark:border-zinc-900',
      lightDark: 'border-zinc-100 dark:border-zinc-800',
      contrast: 'border-zinc-800 dark:border-white',
      success: 'border-emerald-600 dark:border-emerald-500',
      danger: 'border-red-600 dark:border-red-500',
      warning: 'border-yellow-600 dark:border-yellow-500',
      info: 'border-indigo-600 dark:border-indigo-500',
    },
    text: {
      white: 'text-black dark:text-zinc-100',
      whiteDark: 'text-black dark:text-zinc-100',
      lightDark: 'text-zinc-700 dark:text-zinc-400',
      contrast: 'dark:text-zinc-100',
      success: 'text-emerald-600 dark:text-emerald-500',
      danger: 'text-red-600 dark:text-red-500',
      warning: 'text-yellow-600 dark:text-yellow-500',
      info: 'text-indigo-600 dark:text-indigo-500',
    },
    outlineHover: {
      white: 'hover:bg-zinc-100',
      whiteDark: 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
      lightDark: 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
      contrast:
        'hover:bg-zinc-800 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-black',
      success:
        'hover:bg-emerald-600 hover:text-white hover:text-white dark:hover:text-white dark:hover:border-emerald-600',
      danger:
        'hover:bg-red-600 hover:text-white hover:text-white dark:hover:text-white dark:hover:border-red-600',
      warning:
        'hover:bg-yellow-600 hover:text-white hover:text-white dark:hover:text-white dark:hover:border-yellow-600',
      info: 'hover:bg-indigo-600 hover:text-white dark:hover:text-white dark:hover:border-indigo-600',
    },
  }

  if (!isButtonColor(color)) {
    return color
  }

  const themeColor = color
  const isOutlinedProcessed = isOutlined && ['white', 'whiteDark', 'lightDark'].indexOf(color) < 0
  const base: string[] = [colors.borders[themeColor], colors.ring[themeColor]]

  if (isActive) {
    base.push(colors.active[themeColor])
  } else {
    base.push(isOutlinedProcessed ? colors.text[themeColor] : colors.bg[themeColor])
  }

  if (hasHover) {
    base.push(isOutlinedProcessed ? colors.outlineHover[themeColor] : colors.bgHover[themeColor])
  }

  return base
}
