import { useLayoutEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import { router } from "@/routes";
import { PALETTE_META, useUiStore } from "@/stores/useUiStore";
import { ScrollProgress } from "@/components/common/ScrollEnhancements";
import { SplashLoader } from "@/components/ui/SplashLoader";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function App() {
  const palette = useUiStore((state) => state.palette);

  useLayoutEffect(() => {
    document.documentElement.dataset.palette = palette;
    // Keep the mobile browser chrome in the same theme colour.
    const meta = document.querySelector('meta[name="theme-color"]');
    const primary = PALETTE_META[palette]?.swatches[0];
    if (meta && primary) meta.setAttribute("content", primary);
  }, [palette]);

  return (
    <AppProviders>
      <SplashLoader />
      <ScrollProgress />
      <CustomCursor />
      <RouterProvider router={router} />
    </AppProviders>
  );
}
