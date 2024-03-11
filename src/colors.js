const sectionBgBase = 'bg-gradient-to-tr'
export const sectionBgLogin = `${sectionBgBase} from-gray-600 via-gray-900 to-gray-700`
export const sectionBgLoginDark = `${sectionBgBase} from-gray-900 via-gray-600 to-red-900`
export const sectionBgError = `${sectionBgBase} from-pink-400 via-red-500 to-yellow-500`
export const sectionBgErrorDark = `${sectionBgBase} from-pink-900 via-red-900 to-yellow-900`
export const sectionBgSignup = `${sectionBgBase} from-yellow-400 via-red-500 to-purple-500`
export const sectionBgSignupDark = `${sectionBgBase} from-yellow-900 via-red-900 to-purple-900`
export const sectionBgRemind = `${sectionBgBase} from-red-400 via-yellow-500 to-blue-500`
export const sectionBgRemindDark = `${sectionBgBase} from-red-900 via-yellow-900 to-blue-900`

export const colorsBg = {
  white: 'bg-white text-black',
  light: 'bg-gray-400 text-black',
  success: 'bg-emerald-600 text-white',
  danger: 'bg-red-600 text-white',
  warning: 'bg-yellow-600 text-white',
  info: 'bg-blue-600 text-white',
  teal: 'bg-teal-600 text-white',
  orange: 'bg-orange-500 text-white',
  cyan: 'bg-cyan-600 text-white',
  dark:'bg-gray-800 text-white'
}

export const colorsBgHover = {
  white: 'hover:bg-gray-50',
  light: 'hover:bg-gray-300',
  success: 'hover:bg-emerald-700',
  danger: 'hover:bg-red-700',
  warning: 'hover:bg-yellow-700',
  info: 'hover:bg-blue-700',
  orange: 'hover:bg-orange-600',
  cyan: 'hover:bg-cyan-500',
}

export const colorsBorders = {
  white: 'border-gray-300',
  light: 'border-gray-400 dark:border-gray-400',
  success: 'border-emerald-700',
  danger: 'border-red-700',
  warning: 'border-yellow-700',
  info: 'border-blue-700',
  teal: 'border-teal-700',
  orange: 'border-orange-500',
  cyan: 'border-cyan-600',
  dark:'border-gray-800'
}

export const colorsText = {
  white: 'text-black dark:text-gray-100',
  light: 'text-gray-700 dark:text-gray-800',
  success: 'text-emerald-600',
  danger: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  orange: 'text-orange-500',
  cyan: 'text-cyan-600'
}

export const colorsOutline = {
  white: [colorsText.white, colorsBorders.white],
  light: [colorsText.light, colorsBorders.light],
  success: [colorsText.success, colorsBorders.success],
  danger: [colorsText.danger, colorsBorders.danger],
  warning: [colorsText.warning, colorsBorders.warning],
  info: [colorsText.info, colorsBorders.info],
  orange: [colorsText.orange, colorsBorders.orange],
  cyan: [colorsText.cyan, colorsBorders.cyan]
}

export const colorsOutlineHover = {
  white: 'hover:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-200',
  light: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
  success: 'hover:bg-emerald-700 hover:text-white',
  danger: 'hover:bg-red-700 hover:text-white',
  warning: 'hover:bg-yellow-700 hover:text-white',
  info: 'hover:bg-blue-700 hover:text-white',
  orange: 'hover:bg-orange-600 hover:text-white',
  cyan: 'hover:bg-cyan-500 hover:text-white',
}

export const getButtonColor = (color, isOutlined, hasHover) => {
  const base = [
    isOutlined ? colorsText[color] : colorsBg[color],
    colorsBorders[color]
  ]

  if (hasHover) {
    base.push(isOutlined ? colorsOutlineHover[color] : colorsBgHover[color])
  }

  return base
}

export const controlTextColor = (error, success) => {
  if (error) {
    return 'text-red-600'
  }

  if (success) {
    return 'text-emerald-600'
  }

  return null
}
