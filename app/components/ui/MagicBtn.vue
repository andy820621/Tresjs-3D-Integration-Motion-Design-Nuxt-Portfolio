<script setup lang="ts">
interface Props {
  title?: string
  icon?: string // 接受圖標名稱作為字符串
  position?: string
  handleClick?: () => void
  otherClass?: string
}

withDefaults(defineProps<Props>(), {
  position: 'left',
  otherClass: '',
})
</script>

<template>
  <button class="relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none md:w-60 md:mt-10" @click="handleClick">
    <span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span :class="`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClass}`">
      <Icon v-if="icon && position === 'left'" :name="icon" />
      {{ title }}
      <Icon v-if="icon && position === 'right'" :name="icon" />
    </span>
  </button>
</template>
