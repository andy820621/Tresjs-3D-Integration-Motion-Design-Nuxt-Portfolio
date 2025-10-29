<script setup lang="ts">
import { reactiveTransform } from '@vueuse/motion'

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

// 設定預設值
const duration = props.duration ?? 2000
const rx = props.rx ?? ''
const ry = props.ry ?? ''
const otherProps = props.otherProps ?? {}

// 參考和動畫值
const pathRef = ref<SVGRectElement | null>(null)
const progress = ref(0)

// 更新進度的函數
function updateProgress(timestamp: number) {
  const length = pathRef.value?.getTotalLength()
  if (length) {
    const pxPerMillisecond = length / duration
    progress.value = (timestamp * pxPerMillisecond) % length
  }
  requestAnimationFrame(updateProgress)
}

// 在組件掛載時啟動動畫
onMounted(() => {
  requestAnimationFrame(updateProgress)
})

// 計算 x 和 y 坐標
const x = computed(() => {
  if (pathRef.value) {
    return pathRef.value.getPointAtLength(progress.value).x
  }
  return 0
})

const y = computed(() => {
  if (pathRef.value) {
    return pathRef.value.getPointAtLength(progress.value).y
  }
  return 0
})

const { transform } = reactiveTransform({
  translateX: `${x.value}px - 50%`,
  translateY: `${y.value}px - 50%`,
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
      style="position: absolute; top: 0; left: 0; display: inline-block;"
      :style="{ transform }"
    >
      <slot />
    </div>
  </div>
</template>
