import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Get current session and user safely from incoming server headers
 */
export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error retrieving auth session:", error);
    return null;
  }
}

/**
 * Get current authenticated user or null
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Require customer/user authentication.
 * Redirects to /login if not authenticated.
 */
export async function requireUser(returnUrl: string = "/") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
  }
  return user;
}

/**
 * Require ADMIN role.
 * Throws error or redirects if not authorized.
 */
export async function requireAdmin(returnUrl: string = "/") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
  }

  // Check RBAC role
  const userRole = (user as unknown as { role?: string }).role;
  if (userRole !== "ADMIN") {
    // Forbidden: Not an admin
    redirect("/?error=forbidden");
  }

  return user;
}
