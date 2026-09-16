import { useLayoutEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import { router } from "@/routes";
import { useUiStore } from "@/stores/useUiStore";
import { ScrollProgress } from "@/components/common/ScrollEnhancements";
import { SplashLoader } from "@/components/ui/SplashLoader";

export default function App() {
  const palette = useUiStore((state) => state.palette);

  useLayoutEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);

  return (
    <AppProviders>
      <SplashLoader />
      <ScrollProgress />
      <RouterProvider router={router} />
    </AppProviders>
  );
}
