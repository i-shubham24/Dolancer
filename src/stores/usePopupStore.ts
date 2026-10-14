import { create } from "zustand";

/**
 * In-app pop-ups for things that happen without the doer doing anything: a
 * supervisor message, a payout, an approval, a reminder coming due.
 *
 * Confirmations of the doer's own actions stay as toasts at the bottom of the
 * screen. These sit at the top right, so "something happened to you" and "you did
 * something" never look the same.
 */
export type PopupKind =
  | "message"
  | "payout"
  | "approved"
  | "changes"
  | "work"
  | "verified"
  | "reminder"
  | "availability"
  | "chat"
  | "info";

export interface Popup {
  id: string;
  kind: PopupKind;
  title: string;
  body?: string;
  href?: string | null;
  at: number;
}

interface PopupState {
  popups: Popup[];
  /** Goes up by one per pop-up, so the bell can give a small shake. */
  bumps: number;
  push: (popup: Omit<Popup, "id" | "at"> & { id?: string }) => void;
  dismiss: (id: string) => void;
}

const MAX_VISIBLE = 3;

export const usePopupStore = create<PopupState>((set) => ({
  popups: [],
  bumps: 0,
  push: (popup) =>
    set((state) => {
      const id = popup.id ?? `p-${Date.now().toString(36)}-${state.bumps}`;
      if (state.popups.some((existing) => existing.id === id)) return state;
      const next = [{ ...popup, id, at: Date.now() }, ...state.popups].slice(0, MAX_VISIBLE);
      return { popups: next, bumps: state.bumps + 1 };
    }),
  dismiss: (id) => set((state) => ({ popups: state.popups.filter((popup) => popup.id !== id) })),
}));

/** Which pop-up look a notification template gets. */
export function popupKindFor(templateType: string): PopupKind {
  switch (templateType) {
    case "message_posted":
      return "message";
    case "payout_released":
      return "payout";
    case "project_approved":
      return "approved";
    case "revision_requested":
    case "verification_rejected":
      return "changes";
    case "payment_held":
    case "quote_ready":
    case "project_delivered":
      return "work";
    case "verification_approved":
      return "verified";
    case "work_invite":
      return "chat";
    default:
      return "info";
  }
}
