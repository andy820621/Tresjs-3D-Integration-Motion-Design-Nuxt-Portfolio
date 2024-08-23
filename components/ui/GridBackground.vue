<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'grid' | 'grid-small' | 'gridSmall' | 'dot'
  customClass?: string
  customInnerClass?: string
}>(), {
  type: 'grid',
})

const backgroundClass = computed(() => {
  switch (props.type) {
    case 'grid':
      return 'dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2]'
    case 'grid-small':
    case 'gridSmall':
      return 'dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]'
    case 'dot':
      return 'dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'
    default:
      return 'dark:bg-black bg-white'
  }
})
</script>

<template>
  <div
    class="h-[50rem] w-full flex items-center justify-center" :class="customClass ? [customClass] : [backgroundClass]"
  >
    <!-- Radial gradient for the container to give a faded look -->
    <div class="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" :class="[customInnerClass]" />
    <p class="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
      <slot />
    </p>
  </div>
</template>
