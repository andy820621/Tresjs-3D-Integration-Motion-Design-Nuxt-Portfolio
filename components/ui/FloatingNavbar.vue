<script setup lang="ts">
interface NavItem {
  name: string
  link: string
  icon?: string
}
defineProps<{
  navItems: NavItem[]
  className?: string
}>()

const visible = ref(true)
const { y } = useScroll(window)

let lastScrollY = 0

function checkScroll() {
  const scrollY = y.value
  const scrollYProgress = scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  const direction = scrollY - lastScrollY

  if (scrollYProgress < 0.05) {
    visible.value = true
  }
  else {
    visible.value = direction < 0
  }

  lastScrollY = scrollY
}

useEventListener('scroll', checkScroll)
</script>

<template>
  <Transition>
    <div
      v-if="visible"
      v-motion
      :initial="{ opacity: 1, y: -100 }"
      :enter="{ y: 0, opacity: 1 }"
      :leave="{ y: -100, opacity: 0 }"
      :transition="{ duration: 200 }"
      class="flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-xl dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-10 py-5 items-center justify-center space-x-4"
      :class="className"
      style="backdrop-filter: blur(16px) saturate(180%); background-color: rgba(17, 25, 40, 0.75); border: 1px solid rgba(255, 255, 255, 0.125);"
    >
      <NuxtLink
        v-for="(navItem, idx) in navItems"
        :key="`link-${idx}`"
        :to="navItem.link"
        class="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 !cursor-pointer"
      >
        <Icon v-if="navItem.icon" class="block sm:hidden" :name="navItem.icon" />
        <span class="text-sm">{{ navItem.name }}</span>
      </NuxtLink>
    </div>
  </Transition>
</template>
