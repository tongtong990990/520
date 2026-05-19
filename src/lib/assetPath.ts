/** GitHub Pages 子路径 /520 下的静态资源路径 */
export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/520")) {
      return `/520${normalized}`;
    }
    return normalized;
  }
  return process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}${normalized}`
    : normalized;
}
