import type Rollbar from 'rollbar'

declare module '#app' {
  interface NuxtApp {
    $rollbar: Rollbar
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $rollbar: Rollbar
  }
}

export {}
