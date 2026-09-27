/**
 * Lightning UX test receiver patch
 *
 * In the existing doPost(e), after you assign the request fields to `data`, add:
 *
 *   if (data.form_type === 'ux_test') return saveUxTest_(data);
 *
 * Then add the function below to the same Apps Script project and deploy a new
 * version of the existing web app. This preserves the survey and signup routes.
 */
function saveUxTest_(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UX Tests');
  const response = ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
  if (!sheet) return response;

  let feedback = [];
  try { feedback = JSON.parse(data.feedback_json || '[]'); } catch (error) { return response; }
  const submittedAt = new Date();
  const rows = feedback
    .filter(item => item && item.reaction)
    .map(item => [
      submittedAt,
      data.experience_version || '',
      item.id || '',
      item.title || '',
      item.reaction || '',
      Array.isArray(item.reasons) ? item.reasons.join(' | ') : '',
      data.page_url || '',
      data.session_id || '',
      data.device || ''
    ]);
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 9).setValues(rows);
  return response;
}
