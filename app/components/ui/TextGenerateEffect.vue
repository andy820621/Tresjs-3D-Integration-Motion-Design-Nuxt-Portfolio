<script setup lang="ts">
interface Props {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  filter: false,
  duration: 500,
})

const wordsArray = computed(() => props.words.split(' '))
</script>

<template>
  <div class="font-bold" :class="[className]">
    <div class="my-4">
      <div class="dark:text-white text-black leading-snug tracking-wide">
        <span
          v-for="(word, idx) in wordsArray"
          :key="word + idx"
          v-motion="{
            initial: {
              opacity: 0,
              // filter: filter ? 'blur(10px)' : 'none',
            },
            enter: {
              opacity: 1,
              // filter: filter ? 'blur(0px)' : 'none',
              transition: {
                duration: props.duration,
                delay: idx * 200,
              },
            },
          }"
          :class="`${idx > 3 ? 'text-purple' : 'dark:text-white text-black'} opacity-0`"
        >
          {{ word }}&nbsp;
        </span>
      </div>
    </div>
  </div>
</template>
