/** The API's error message, our own Error's message, or a generic one when the request got no answer; `t` from useLanguage. */
export function errorMessage(error, t)
{
  if (!error) return '';
  if (error.response?.status === 401) return t('Your session has expired. Please reload the page and sign in again.', 'Oturumunuzun süresi doldu. Lütfen sayfayı yenileyip yeniden giriş yapın.');
  if (error.response?.data?.error) return error.response.data.error;
  return error.isAxiosError || !error.message ? t('Could not reach the server. Check your connection and try again.', 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.') : error.message;
}
