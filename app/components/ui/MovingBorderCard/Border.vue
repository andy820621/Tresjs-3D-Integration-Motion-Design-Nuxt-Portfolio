<script setup lang="ts">
import { useElementTransform } from '@vueuse/motion'

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
const ballRef = ref<HTMLElement | null>(null)
const progress = ref(0)

const { transform } = useElementTransform(ballRef)

let animationFrameId: number

function updateProgress(timestamp: number) {
  const length = pathRef.value?.getTotalLength() || 0
  const pxPerMillisecond = length / props.duration
  progress.value = (timestamp * pxPerMillisecond) % length
  animationFrameId = requestAnimationFrame(updateProgress)
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(updateProgress)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})

const position = computed(() => {
  if (pathRef.value && ballRef.value) {
    const point = pathRef.value.getPointAtLength(progress.value)
    const ballRect = ballRef.value.getBoundingClientRect()
    return {
      x: point.x - ballRect.width / 2,
      y: point.y - ballRect.height / 2,
    }
  }
  return { x: 0, y: 0 }
})

watch(position, (newPosition) => {
  transform.x = `${newPosition.x}px`
  transform.y = `${newPosition.y}px`
}, { immediate: true })
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    class="absolute h-full w-full"
    width="100%"
    height="100%"
    v-bind="props.otherProps"
  >
    <rect
      ref="pathRef"
      fill="none"
      stroke="transparent"
      stroke-width="0"
      width="100%"
      height="100%"
      :rx="props.rx"
      :ry="props.ry"
    />
  </svg>
  <div
    ref="ballRef"
    class="absolute top-0 left-0 inline-block"
  >
    <slot />
  </div>
</template>
