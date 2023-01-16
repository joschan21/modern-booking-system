export const OPENING_HOURS_BEGINNING = 9
export const OPENING_HOURS_END = 12
export const OPENING_HOURS_INTERVAL = 30 // in minutes

export const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

export const categories = ['all', 'breakfast', 'lunch', 'dinner'] as const

export const now = new Date() // Do not use this in mutated functions, e.g. setHours(0, 0, 0, 0)
