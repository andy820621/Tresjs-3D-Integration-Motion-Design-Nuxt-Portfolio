import Rollbar from 'rollbar'

export default defineNuxtPlugin(() => {
  const rollbar = new Rollbar({
    accessToken: 'f9696ee296544c1aa7466e5bb0a02684',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
      client: {
        javascript: {
          code_version: '1.0.0',
          source_map_enabled: true,
        },
      },
    },
  })

  return {
    provide: {
      rollbar,
    },
  }
})
