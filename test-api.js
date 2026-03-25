/**
 * Tydline API Connection Test
 * ───────────────────────────
 * Paste this entire script into the browser console while
 * you are logged into the dashboard. It will:
 *
 *  1. Check the backend is reachable (GET /dashboard/shipments)
 *  2. Check the manual tracking submit endpoint works (POST /dashboard/shipments/submit)
 *
 * Auth cookies are sent automatically because you are already logged in.
 */

(async () => {
  const BASE =
    window.__VITE_API_BASE_URL__ ||
    (typeof import_meta_env !== "undefined" && import_meta_env.VITE_API_BASE_URL) ||
    "http://localhost:8000/api/v1";

  const TEST_BL = "TESTBL123456";

  function log(label, ok, data) {
    const icon = ok ? "✅" : "❌";
    console.group(`${icon} ${label}`);
    console.log(data);
    console.groupEnd();
  }

  console.log("═══════════════════════════════════════");
  console.log("  Tydline Backend Connection Test");
  console.log(`  API Base: ${BASE}`);
  console.log("═══════════════════════════════════════");

  // ── Test 1: GET /dashboard/shipments ───────────────────────────────────────
  console.log("\n[1/2] Testing GET /dashboard/shipments …");
  try {
    const res = await fetch(`${BASE}/dashboard/shipments`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      log("GET /dashboard/shipments — PASSED", true, {
        status: res.status,
        total_active: data.total_active,
        total_completed: data.total_completed,
        total_pending_approval: data.total_pending_approval,
      });
    } else {
      log("GET /dashboard/shipments — FAILED", false, {
        status: res.status,
        response: data,
      });
    }
  } catch (err) {
    log("GET /dashboard/shipments — ERROR (network/CORS?)", false, {
      error: err.message,
    });
  }

  // ── Test 2: POST /dashboard/shipments/submit ───────────────────────────────
  console.log("\n[2/2] Testing POST /dashboard/shipments/submit …");
  try {
    const res = await fetch(`${BASE}/dashboard/shipments/submit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bill_of_lading: TEST_BL }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      log("POST /dashboard/shipments/submit — PASSED", true, {
        status: res.status,
        response: data,
      });
    } else {
      log("POST /dashboard/shipments/submit — FAILED", false, {
        status: res.status,
        response: data,
        hint:
          res.status === 404
            ? "Endpoint does not exist on the backend yet"
            : res.status === 401
            ? "Not authenticated — make sure you are logged in"
            : res.status === 422
            ? "Backend rejected the payload — check expected field names"
            : "Check the backend logs for details",
      });
    }
  } catch (err) {
    log("POST /dashboard/shipments/submit — ERROR (network/CORS?)", false, {
      error: err.message,
    });
  }

  console.log("\n═══════════════════════════════════════");
  console.log("  Test complete. Share results above.");
  console.log("═══════════════════════════════════════");
})();
