<script setup lang="ts">
import { type ResolvedRegister, type State, hydrate } from '@wagmi/core'
import { defineComponent, onMounted, provide, ref } from 'vue'
import { configKey } from '../plugin'

export type WagmiProviderOptions = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export const WagmiProvider = defineComponent({
  name: 'WagmiProvider',
  props: {
    config: {
      type: Object as () => WagmiProviderOptions['config'],
      required: true,
    },
    initialState: {
      type: Object as () => WagmiProviderOptions['initialState'],
      default: undefined,
    },
    reconnectOnMount: {
      type: Boolean as () => WagmiProviderOptions['reconnectOnMount'],
      default: true,
    },
  },
  setup(props, { slots }) {
    const state = ref(props.initialState)
    const { config, reconnectOnMount } = props

    const { onMount } = hydrate(config, { ...props, reconnectOnMount })

    onMounted(() => {
      onMount()
    })

    provide(configKey, { config, state })

    return () => slots.default?.()
  },
})
</script>