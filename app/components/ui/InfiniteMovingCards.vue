<script setup lang="ts">
interface Item {
  quote: string
  name: string
  title: string
}

interface Props {
  items: Item[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'left',
  speed: 'fast',
  pauseOnHover: true,
  className: '',
})

const containerRef = ref<HTMLDivElement | null>(null)
const scrollerRef = ref<HTMLUListElement | null>(null)
const start = ref(false)

function addAnimation() {
  if (containerRef.value && scrollerRef.value) {
    const scrollerContent = Array.from(scrollerRef.value.children)

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true)
      scrollerRef.value?.appendChild(duplicatedItem)
    })

    getDirection()
    getSpeed()
    start.value = true
  }
}

function getDirection() {
  if (containerRef.value) {
    containerRef.value.style.setProperty(
      '--animation-direction',
      props.direction === 'left' ? 'forwards' : 'reverse',
    )
  }
}

function getSpeed() {
  if (containerRef.value) {
    const duration = props.speed === 'fast' ? '20s' : props.speed === 'normal' ? '40s' : '80s'
    containerRef.value.style.setProperty('--animation-duration', duration)
  }
}

onMounted(addAnimation)

const containerClass = computed(() => {
  return `scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ${props.className}`
})

const scrollerClass = computed(() => {
  return `flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap
          data-[start=true]:animate-scroll
          data-[pause-on-hover=true]:hover:[animation-play-state:paused]`
})
</script>

<template>
  <div ref="containerRef" :class="containerClass">
    <ul
      ref="scrollerRef"
      :class="scrollerClass"
      :data-start="start"
      :data-pause-on-hover="props.pauseOnHover"
    >
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="w-[90vw] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 md:p-16 md:w-[60vw]"
        :style="{
          background: 'rgb(4,7,29)',
          backgroundImage: 'linear-gradient(90deg, rgba(117, 96, 131, .24) 0%, rgba(12,14,35,1) 100%)',
        }"
      >
        <blockquote>
          <div
            aria-hidden="true"
            class="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
          />
          <span class="relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal">
            {{ item.quote }}
          </span>
          <div class="relative z-20 mt-6 flex flex-row items-center">
            <div class="me-3 min-h-[58px] grid items-center bg-transparent">
              <NuxtImg class="h-[85%] bg-transparent" src="/profile.svg" alt="profile" />
            </div>
            <span class="flex flex-col gap-1">
              <span class="text-xl font-bold leading-[1.6] text-white">
                {{ item.name }}
              </span>
              <span class="text-sm leading-[1.6] text-white-200 font-normal">
                {{ item.title }}
              </span>
            </span>
          </div>
        </blockquote>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.animate-scroll {
  animation: scroll var(--animation-duration) linear infinite;
  animation-direction: var(--animation-direction);
  color: rgba(117, 96, 131, 0.904);
}

@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.5rem));
  }
}
</style>
