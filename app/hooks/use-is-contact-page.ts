import { useLoaderData, useLocation } from "react-router";

export function useIsContactPage() {
  const { pathname } = useLocation();
  const { page } = useLoaderData<{
    page?: { handle?: string | null };
  }>();

  return page?.handle === "contact" || /\/pages\/contact\/?$/.test(pathname);
}
