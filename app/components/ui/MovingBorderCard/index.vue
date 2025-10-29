<script setup lang="ts">
import MovingBorder from './Border.vue'

// 定義 props
const props = withDefaults(defineProps<{
  borderRadius?: string
  as?: string | object
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
}>(), {
  borderRadius: '1.75rem',
  as: 'button',
})

// 使用 computed 屬性來組合 class
const containerClasses = computed(() => [
  'bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1',
  props.containerClassName,
])

const borderClasses = computed(() => [
  'h-20 w-20 opacity-[0.8] bg-[radial-gradient(#CBACF9_40%,transparent_60%)]',
  props.borderClassName,
])

const contentClasses = computed(() => [
  'relative bg-slate-900/[0.] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased',
  props.className,
])
</script>

<template>
  <component
    :is="as"
    :class="containerClasses"
    :style="{ borderRadius }"
    v-bind="$attrs"
  >
    <!-- 背景移動球體動畫容器 -->
    <div
      class="absolute inset-0"
      :style="{ borderRadius: `calc(${borderRadius} * 0.96)` }"
    >
      <ClientOnly>
        <MovingBorder :duration="duration" rx="30%" ry="30%">
          <div :class="borderClasses" />
        </MovingBorder>
      </ClientOnly>
    </div>

    <!-- 按鈕卡片 -->
    <div
      :class="contentClasses"
      :style="{ borderRadius: `calc(${borderRadius} * 0.96)` }"
    >
      <slot />
    </div>
  </component>
</template>
