export function useImageUrl() {
  const config = useRuntimeConfig();

  return (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${config.public.apiBase}${path}`;
  };
}
