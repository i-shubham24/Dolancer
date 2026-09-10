import { supabase } from "@/lib/supabase";
import { callRpc, unwrap } from "@/lib/rpc";
import { demo, demoAuth, demoRespond, isDemo } from "@/lib/demo-data";

/**
 * Sign-in is email OTP or Google only.
 *
 * Phone auth is disabled on this Supabase project, so although the PRD's signup
 * table lists a phone number, it can only ever be a profile contact field and never
 * an identifier you authenticate with.
 */

export async function sendEmailOtp(email: string, shouldCreateUser: boolean): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser },
  });
  if (error) throw new Error(error.message);
}

export async function verifyEmailOtp(email: string, token: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) throw new Error(error.message);
}

export async function signInWithGoogle(next?: string): Promise<void> {
  const redirectTo = `${window.location.origin}/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw new Error(error.message);
}

/** Demo mode only. There is nothing to verify, so any email signs in as the sample doer. */
export function signInDemo(): void {
  demoAuth.signIn();
}

export async function signOut(): Promise<void> {
  if (isDemo()) {
    demoAuth.signOut();
    return;
  }
  await supabase.auth.signOut();
}

/** Country is set once at signup and drives currency, tax and timezone. */
export async function fetchMyCountry(): Promise<string | null> {
  if (isDemo()) return demoRespond(() => demo.profile.country);
  const value = unwrap(await callRpc<string | null>("my_country"));
  if (!value || value === "XX") return null;
  return value;
}

export async function setMyCountry(code: string): Promise<void> {
  if (isDemo()) {
    return demoRespond(() => {
      demo.profile.country = code.toUpperCase();
    });
  }
  unwrap(await callRpc("set_my_country", { code: code.toUpperCase() }));
}

export async function updateProfileBasics(input: {
  fullName: string;
  whatsapp: string | null;
}): Promise<void> {
  if (isDemo()) {
    return demoRespond(() => {
      demo.profile.full_name = input.fullName;
      demo.profile.whatsapp = input.whatsapp;
    });
  }

  const { data: userData } = await supabase.auth.getUser();
  const id = userData.user?.id;
  if (!id) throw new Error("Not signed in");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: input.fullName, whatsapp: input.whatsapp })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
