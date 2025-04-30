export function displayTime(time: string) {
  if (!time) return ''

  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds === 0) {
    return `Just now`
  }
  if (seconds < 60) {
    return `${seconds} seconds ago`
  }
  if (minutes < 60) {
    return `${minutes}m`
  }
  if (hours < 24) {
    return `${hours}h`
  }
  if (days < 7) {
    return `${days} days`
  }

  return `${date.toDateString()}`
}
