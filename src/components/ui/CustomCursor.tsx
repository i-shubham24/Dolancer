import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    document.documentElement.classList.remove("custom-cursor-active");
  }, []);
  return null;
}
