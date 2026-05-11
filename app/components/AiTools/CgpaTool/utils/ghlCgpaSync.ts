type CgpaGhlResponse = {
  success?: boolean;
  message?: string;
};

/**
 * Upserts the contact in GHL with final CGPA (server route; token stays server-side).
 * Failures are non-blocking for the Nest GPA email flow — check return value if needed.
 */
export async function syncCgpaToGhl({
  email,
  cgpa,
}: {
  email: string;
  cgpa: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  let res: Response;
  try {
    res = await fetch("/api/cgpa-ghl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cgpa }),
    });
  } catch {
    return { ok: false, message: "Network error calling GHL sync" };
  }

  let data: CgpaGhlResponse = {};
  try {
    data = (await res.json()) as CgpaGhlResponse;
  } catch {
    data = {};
  }

  if (!res.ok) {
    return {
      ok: false,
      message: data?.message || `GHL sync failed (${res.status})`,
    };
  }

  return { ok: true };
}
