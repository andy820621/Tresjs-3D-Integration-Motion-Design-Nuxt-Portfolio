<script setup lang="ts">
import { type MotionVariants, useMotion } from '@vueuse/motion'
import Icon from './Icon.vue'
import AceternityIcon from './AceternityIcon.vue'

defineProps<{
  title: string
  icon: { order: string }
  des: string
}>()

const isHovered = ref(false)
const resetKeyValue = ref(0)

function handleMouseEnter() {
  isHovered.value = true
  resetKeyValue.value++ // 每次 hover 時增加這個值
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <div
    class="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl"
    :style="{ background: 'rgb(4,7,29)', backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <Icon class="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
    <Icon class="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
    <Icon class="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
    <Icon class="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />

    <Transition>
      <div
        v-show="isHovered"
        :key="resetKeyValue"
        class="h-full w-full absolute inset-0"
      >
        <slot />
      </div>
    </Transition>

    <div class="relative z-20 px-10">
      <div
        class="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
      >
        <AceternityIcon :order="icon.order" />
      </div>
      <h2
        class="dark:text-white text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200"
      >
        {{ title }}
      </h2>
      <p
        class="text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 mt-4 group-hover/canvas-card:text-white text-center group-hover/canvas-card:-translate-y-2 transition duration-200"
        style="color: #E4ECFF"
      >
        {{ des }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.5s ease;
}

/* .v-leave-active {
  transition: opacity 0.5s ease;
} */

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
