// Common utilitity functions
import { format } from 'date-fns-tz'

// Converts a date and time to a string by using the current or specified locale
export const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString()
}

// Converts a date to a string in the format "yyyy-MM-dd'T'HH:mm"
export const formatDateForInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}
