import { WaitlistError, type WaitlistProvider } from "../types";

// Free provider: posts to a Google Apps Script "Web App" bound to a Sheet.
// No billing, no service account, no API key — just a script deployed from
// the Sheet itself. Setup (~5 min):
//
// 1. Open (or create) the Google Sheet you want signups in.
// 2. Extensions -> Apps Script. Replace the code with:
//
//      function doPost(e) {
//        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//        const body = JSON.parse(e.postData.contents);
//        const email = String(body.email || "").trim();
//        if (!email) {
//          return ContentService.createTextOutput(
//            JSON.stringify({ ok: false, error: "missing_email" })
//          ).setMimeType(ContentService.MimeType.JSON);
//        }
//        const existing = sheet.getRange("A:A").getValues().flat();
//        if (existing.includes(email)) {
//          return ContentService.createTextOutput(
//            JSON.stringify({ ok: false, error: "duplicate" })
//          ).setMimeType(ContentService.MimeType.JSON);
//        }
//        sheet.appendRow([email, new Date().toISOString()]);
//        return ContentService.createTextOutput(
//          JSON.stringify({ ok: true })
//        ).setMimeType(ContentService.MimeType.JSON);
//      }
//
// 3. Deploy -> New deployment -> type "Web app". Execute as "Me", access
//    "Anyone". Copy the deployment URL.
// 4. Set WAITLIST_PROVIDER=google-sheets and WAITLIST_SHEETS_URL=<that URL>
//    in your environment, then redeploy.

export const googleSheetsProvider: WaitlistProvider = {
  async add(email) {
    const url = process.env.WAITLIST_SHEETS_URL;
    if (!url) {
      throw new WaitlistError(
        "unknown",
        "Waitlist isn't configured yet. Set WAITLIST_SHEETS_URL.",
      );
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      throw new WaitlistError("unknown", "Couldn't reach the waitlist right now.");
    }

    if (!response.ok) {
      throw new WaitlistError("unknown", "Couldn't save that email. Try again.");
    }

    const result = (await response.json().catch(() => null)) as
      | { ok: boolean; error?: string }
      | null;

    if (!result?.ok) {
      if (result?.error === "duplicate") {
        throw new WaitlistError("duplicate", "That email is already on the waitlist.");
      }
      throw new WaitlistError("unknown", "Couldn't save that email. Try again.");
    }
  },
};
