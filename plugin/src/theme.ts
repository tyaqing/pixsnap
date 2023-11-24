import { inputAnatomy } from '@chakra-ui/anatomy'
import { theme as proTheme } from '@chakra-ui/pro-theme'
import { createMultiStyleConfigHelpers, defineStyle, defineStyleConfig } from '@chakra-ui/react'
import { extendTheme, theme as baseTheme } from '@chakra-ui/react'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
)

export const buttonTheme = defineStyleConfig({
  defaultProps: {
    colorScheme: 'cyan',
  },
  baseStyle: {
    // font: 'mono',
  },
})

export const selectTheme = defineStyleConfig({
  sizes: {
    sm: {
      rounded: '6px',
    },
  },
})

const size = {
  sm: defineStyle({
    h: '8',
  }),
}

export const inputTheme = defineMultiStyleConfig({
  sizes: {
    sm: definePartsStyle({
      field: size.sm,
      addon: size.sm,
    }),
  },
})
export const theme = extendTheme(proTheme, {
  colors: { ...baseTheme.colors, brand: baseTheme.colors.cyan },
  components: {
    Button: buttonTheme,
    Select: selectTheme,
    Input: inputTheme,
  },
})
