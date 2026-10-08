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

/**
 * Multi-Factor Authentication (MFA / TOTP)
 * Enrolls a new authenticator app (Google Authenticator, Authy, 1Password)
 */
export async function enrollMfaTotp(): Promise<{
  id: string;
  type: "totp";
  totp: { qr_code: string; secret: string; uri: string };
}> {
  if (isDemo()) {
    return {
      id: "demo-mfa-factor",
      type: "totp",
      totp: {
        qr_code: "data:image/svg+xml;base64,demo",
        secret: "DEMOAUTHENTICATORSECRET123",
        uri: "otpauth://totp/Dolancer:demo@example.com?secret=DEMOAUTHENTICATORSECRET123&issuer=Dolancer",
      },
    };
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
  if (error) throw new Error(error.message);
  return data as { id: string; type: "totp"; totp: { qr_code: string; secret: string; uri: string } };
}

export async function verifyMfaChallenge(factorId: string, code: string): Promise<void> {
  if (isDemo()) return;
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw new Error(challengeError.message);
  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  });
  if (verifyError) throw new Error(verifyError.message);
}

export async function unenrollMfa(factorId: string): Promise<void> {
  if (isDemo()) return;
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw new Error(error.message);
}

export async function listMfaFactors(): Promise<Array<{ id: string; status: string; factor_type: string }>> {
  if (isDemo()) return [];
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw new Error(error.message);
  return data.all;
}
