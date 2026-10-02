/**
 * Lightning · route app-feedback tickets to the "App Feedback" tab
 *
 * The Current Status page sends one form request containing a JSON array of
 * tickets. This helper writes one spreadsheet row per ticket, keeping a single
 * feedback session easy for a tester while making each issue filterable later.
 *
 * Setup in the existing Apps Script receiver:
 *
 * 1. Add this as a new script file.
 * 2. Add this route near the TOP of the existing doPost(e), before its survey
 *    fallback that writes every request as a survey response:
 *
 *    if (e && e.parameter && e.parameter.form_type === 'app_feedback') {
 *      return saveAppFeedback_(e.parameter);
 *    }
 *
 * 3. Deploy a NEW VERSION of the existing web app deployment. Keep its /exec
 *    URL unchanged, because it is already configured in current-status.html.
 *
 * The "App Feedback" tab can be created automatically. It was also prepared
 * manually in Lightning-survey-responses with the same columns and a filter.
 */
const APP_FEEDBACK_SPREADSHEET_ID = '';
const APP_FEEDBACK_SHEET_NAME = 'App Feedback';
const APP_FEEDBACK_HEADERS = [
  'Submitted at', 'Landing release', 'App build', 'Section / page', 'Type',
  'Area', 'Description', 'Page URL', 'Session ID', 'Ticket #', 'Device',
  'Reporter Name', 'Reporter Email'
];

function appFeedbackSheet_() {
  const book = APP_FEEDBACK_SPREADSHEET_ID
    ? SpreadsheetApp.openById(APP_FEEDBACK_SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(APP_FEEDBACK_SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(APP_FEEDBACK_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(APP_FEEDBACK_HEADERS);
    sheet.setFrozenRows(1);
  } else {
    const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missing = APP_FEEDBACK_HEADERS.slice(existing.length);
    if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  }
  return sheet;
}

function saveAppFeedback_(data) {
  const response = ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
  let tickets = [];
  try { tickets = JSON.parse(data.tickets_json || '[]'); } catch (_) { return response; }
  if (!Array.isArray(tickets)) return response;
  const submittedAt = new Date();
  const rows = tickets
    .filter(ticket => ticket && ticket.section && ticket.type && ticket.area && ticket.description)
    .map((ticket, index) => [
      submittedAt,
      data.experience_version || '',
      data.app_build || '',
      ticket.section || '',
      ticket.type || '',
      ticket.area || '',
      String(ticket.description || '').slice(0, 1000),
      data.page_url || '',
      data.session_id || '',
      index + 1,
      data.device || '',
      String(data.reporter_name || '').slice(0, 100),
      String(data.reporter_email || '').slice(0, 254)
    ]);
  if (!rows.length) return response;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = appFeedbackSheet_();
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, APP_FEEDBACK_HEADERS.length).setValues(rows);
  } finally {
    lock.releaseLock();
  }
  return response;
}

/** Optional one-off routing check from the Apps Script editor. */
function testAppFeedbackRoute() {
  const result = doPost({ parameter: {
    form_type: 'app_feedback', experience_version: 'TEST', app_build: 'Version A',
    page_url: 'https://lightningeg.com/current-status.html', session_id: 'test-session', device: 'desktop',
    tickets_json: JSON.stringify([{ section: 'Import CSV', type: 'Improvement', area: 'Visual', description: 'Test row — delete after confirming the route.' }])
  } });
  Logger.log(result.getContent());
}
