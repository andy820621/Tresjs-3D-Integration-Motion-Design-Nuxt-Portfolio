<script setup lang="ts">
import ShaderMaterial from './ShaderMaterial.vue'

defineProps<{
  source: string
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number
      type: string
    }
  }
  maxFps?: number
}>()
</script>

<template>
  <TresCanvas>
    <TresOrthographicCamera /> <!-- // or <TresPerspectiveCamera /> -->
    <ShaderMaterial
      :source="source"
      :uniforms="uniforms"
      :max-fps="maxFps"
    />
  </TresCanvas>
</template>
