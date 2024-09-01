<script setup lang="ts">
import Card from '~/components/ui/Approach/Card.vue'
</script>

<template>
  <section class="w-full py-20">
    <h1 class="heading">
      My <span class="text-purple">approach</span>
    </h1>
    <div class="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
      <Card
        title="Planning & Strategy"
        :icon="{ order: 'Phase 1' }"
        des="We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements."
      >
        <UiCanvasRevealEffect
          :animation-speed="5.1"
          container-class-name="dark:bg-emerald-900 bg-emerald-900 rounded-3xl overflow-hidden"
        />
      </Card>
      <Card
        title="Development & Progress Update"
        :icon="{ order: 'Phase 2' }"
        des="Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way."
      >
        <UiCanvasRevealEffect
          :animation-speed="3"
          container-class-name="dark:bg-pink-900 bg-pink-900 rounded-3xl overflow-hidden"
          :colors="[
            [255, 166, 158],
            [221, 255, 247],
          ]"
          :dot-size="2"
        />
      </Card>
      <Card
        title="Development & Launch"
        :icon="{ order: 'Phase 3' }"
        des="This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up."
      >
        <UiCanvasRevealEffect
          :animation-speed="3"
          container-class-name="dark:bg-sky-600 bg-sky-600 rounded-3xl overflow-hidden"
          :colors="[[125, 211, 252]]"
        />
      </Card>
    </div>
  </section>
</template>
