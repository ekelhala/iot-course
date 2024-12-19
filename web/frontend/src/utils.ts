// Common utilitity functions
import { format } from 'date-fns-tz'

// Converts a date and time to a string by using the current or specified locale
export const formatTimestamp = <T extends Date | number>(
  timestamp: T,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
): string => {
  return new Date(timestamp).toLocaleString(undefined, options)
}

// Converts a date to a string in the format "yyyy-MM-dd'T'HH:mm"
export const formatDateForInput = (timestamp: Date): string => {
  return format(timestamp, "yyyy-MM-dd'T'HH:mm")
}