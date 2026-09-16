import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import { router } from "@/routes";
import { useUiStore } from "@/stores/useUiStore";
import { ScrollProgress } from "@/components/common/ScrollEnhancements";

export default function App() {
  const palette = useUiStore((state) => state.palette);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);

  return (
    <AppProviders>
      <ScrollProgress />
      <RouterProvider router={router} />
    </AppProviders>
  );
}
