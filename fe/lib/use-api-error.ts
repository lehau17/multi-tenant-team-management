import { useLocale } from 'next-intl'
import { useCallback } from 'react'
import { IApiError } from '@/models/base-response.model'

export function useApiError() {
  const locale = useLocale()

  const getErrorMessage = useCallback(
    (error: unknown): string => {
      const apiError = error as IApiError
      if (apiError?.translations?.[locale]) {
        return apiError.translations[locale]
      }
      if (apiError?.message) {
        return apiError.message
      }
      return locale === 'vi' ? 'Đã có lỗi xảy ra' : 'An error occurred'
    },
    [locale]
  )

  return { getErrorMessage, locale }
}
