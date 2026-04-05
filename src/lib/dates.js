import { format } from 'date-fns'

export function formatDateISO(dateIso) {
  return format(new Date(dateIso), 'MMM d, yyyy')
}
