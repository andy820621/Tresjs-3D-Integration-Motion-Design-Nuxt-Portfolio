<!-- RollbarTest.vue -->
<script setup lang="ts">
const rollbar = useRollbar()

function triggerError() {
  rollbar.log('Testing Rollbar integration')
  throw new Error('Testing Rollbar integration')
}
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="border border-red/[.5] dark:text-white py-2 px-4 rounded-full">
      <button @click="triggerError">
        Trigger Error
      </button>
    </div>
  </div>
</template>
