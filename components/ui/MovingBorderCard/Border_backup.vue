<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMotion } from '@vueuse/motion'

const props = withDefaults(defineProps<{
  duration?: number
  rx?: string
  ry?: string
  otherProps?: Record<string, any>
}>(), {
  duration: 2000,
  rx: '',
  ry: '',
  otherProps: () => ({}),
})

const pathRef = ref<SVGRectElement | null>(null)
const progress = ref(0)

let animationFrameId: number

function updateProgress(timestamp: number) {
  const length = pathRef.value?.getTotalLength()
  if (length) {
    const pxPerMillisecond = length / props.duration
    progress.value = (timestamp * pxPerMillisecond) % length
  }
  animationFrameId = requestAnimationFrame(updateProgress)
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(updateProgress)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})

const position = computed(() => {
  if (pathRef.value) {
    const point = pathRef.value.getPointAtLength(progress.value)
    return {
      x: point.x,
      y: point.y,
    }
  }
  return { x: 0, y: 0 }
})
</script>

<template>
  <div class="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      class="absolute h-full w-full"
      width="100%"
      height="100%"
      v-bind="otherProps"
    >
      <rect
        ref="pathRef"
        fill="none"
        width="100%"
        height="100%"
        :rx="rx"
        :ry="ry"
      />
    </svg>
    <div
      v-motion
      :initial="{ x: 0, y: 0 }"
      :enter="{
        x: position.x,
        y: position.y,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      }"
      style="position: absolute; top: 0; left: 0; display: inline-block; transform: translate(-50%, -50%);"
    >
      <slot />
    </div>
  </div>
</template>
