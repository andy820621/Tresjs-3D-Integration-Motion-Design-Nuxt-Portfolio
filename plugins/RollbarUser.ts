import type Rollbar from 'rollbar'

export default defineNuxtPlugin((nuxtApp) => {
  const rollbar = useRollbar()

  const userIdCookie = useCookie('userId', {
    // maxAge: 86400, // 設置為 1 天 (86400 秒)
    expires: new Date(Date.now() + 86400 * 1000), // 當前時間 + 1 天
  })

  let userId = userIdCookie.value

  if (!userId) {
    userId = generateUserId()
    userIdCookie.value = userId
  }

  if (import.meta.client && nuxtApp.$rollbar) {
    rollbar.log('User visited!')

    ;(nuxtApp.$rollbar as Rollbar).configure({
      payload: {
        person: {
          id: userId,
          // 可以在這裡加上其他資訊，如 username 或 email
        },
      },
    })
  }
})

function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
