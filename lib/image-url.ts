export function optimizedCloudinaryUrl(url: string, width: number) {
  const uploadPath = "/image/upload/";
  if (!url.includes(uploadPath)) return url;

  return url.replace(
    uploadPath,
    `${uploadPath}f_auto,q_auto,w_${width},c_limit/`,
  );
}
