declare module "*.scss" {
  const scss: Record<string, string>
  export default scss
}

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

