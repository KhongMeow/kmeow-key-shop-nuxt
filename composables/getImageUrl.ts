export const useGetImageUrl = (image: string | undefined) => {
  const config = useRuntimeConfig();
  
  if (!image) return '';
  return config.public.API_BASE_URL + image;
}
