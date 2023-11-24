export function isRuntimeDev() {
  return import.meta.env.DEV
}

export function isWeb() {
  return import.meta.env.VITE_BUILD_TARGET === 'web'
}
