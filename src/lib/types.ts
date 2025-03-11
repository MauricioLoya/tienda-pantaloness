export type ServerActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
  fieldErrors?: Record<string, string | null>
  error?: string
  errorCode?: string
}
