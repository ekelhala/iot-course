// Common utilitity functions

// Converts a date and time to a string by using the current or specified locale
export const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
}