<script setup lang="ts">
import { navItems } from '~/assets/data'
</script>

<template>
  <div class="max-w-7xl w-full">
    <UiFloatingNavbar :nav-items="navItems" />

    <Hero />

    <BentoGrid />

    <RecentProjects />

    <Clients />

    <Experience />

    <Approach />
  </div>
</template>
