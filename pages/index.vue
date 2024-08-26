<script setup lang="ts">
const navItems = ref([
  {
    name: 'Home',
    link: '/',
    icon: 'i-fa6-solid-house',
  },
  {
    name: 'About',
    link: '/about',
    icon: 'i-fa6-solid-location-arrow',
  },
])
</script>

<template>
  <div class="max-w-7xl w-full">
    <UiFloatingNav :nav-items="navItems" />

    <Hero />

    <BentoGrid />
  </div>
</template>
