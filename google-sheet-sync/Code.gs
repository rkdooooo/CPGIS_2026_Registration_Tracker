const SPREADSHEET_ID = '1bSbLyOCge7yfNLhqqzhrI4fUae8qAajyG5y26BoEJdc';
const WRITE_TOKEN = 'CHANGE_THIS_PASSCODE';
const CURRENT_SHEET = 'Current';
const EDITS_SHEET = 'Edits';

const CURRENT_HEADERS = ['ID', 'Status', 'Session', 'Note', 'Updated_At', 'Updated_By', 'Title'];
const EDIT_HEADERS = [
  'Timestamp',
  'ID',
  'Title',
  'Field',
  'Previous_Value',
  'New_Value',
  'Status_After',
  'Session_After',
  'Note_After',
  'Edited_By'
];

function doGet(e) {
  try {
    const action = (e.parameter.action || 'state').toLowerCase();
    if (action === 'state') return output_(e, getState_());
    if (action === 'save') {
      const payload = JSON.parse(e.parameter.payload || '{}');
      savePayload_(payload);
      return output_(e, getState_());
    }
    if (action === 'ping') return output_(e, { ok: true, message: 'CPGIS sync is running' });
    return output_(e, { ok: false, error: 'Unknown action' });
  } catch (err) {
    return output_(e, { ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function savePayload_(payload) {
  const expected = getWriteToken_();
  if (expected && payload.token !== expected) throw new Error('Incorrect update passcode');
  const id = String(payload.id || '').trim();
  if (!id) throw new Error('Missing submission ID');

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const current = ensureSheet_(ss, CURRENT_SHEET, CURRENT_HEADERS);
  const edits = ensureSheet_(ss, EDITS_SHEET, EDIT_HEADERS);
  const now = new Date().toISOString();
  const editor = String(payload.editor || 'Reviewer').trim() || 'Reviewer';
  const title = String(payload.title || '');
  const row = findCurrentRow_(current, id);

  if (payload.reset) {
    if (row > 1) current.deleteRow(row);
  } else {
    const status = normalizeStatus_(payload.status || '');
    const session = String(payload.session || '').trim();
    const note = String(payload.note || '').trim();
    const active = status || session || note;
    if (active) {
      const values = [[id, status, session, note, now, editor, title]];
      if (row > 1) current.getRange(row, 1, 1, CURRENT_HEADERS.length).setValues(values);
      else current.appendRow(values[0]);
    } else if (row > 1) {
      current.deleteRow(row);
    }
  }

  const changes = Array.isArray(payload.changes) ? payload.changes : [];
  changes.forEach(change => {
    edits.appendRow([
      now,
      id,
      title,
      String(change.label || change.field || ''),
      String(change.from || ''),
      String(change.to || ''),
      String(payload.status || ''),
      displaySession_(payload.session || ''),
      String(payload.note || ''),
      editor
    ]);
  });
}

function getState_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const current = ensureSheet_(ss, CURRENT_SHEET, CURRENT_HEADERS);
  const edits = ensureSheet_(ss, EDITS_SHEET, EDIT_HEADERS);
  const records = {};
  const deleted = {};

  const currentValues = current.getDataRange().getValues();
  for (let i = 1; i < currentValues.length; i++) {
    const row = currentValues[i];
    const id = String(row[0] || '').trim();
    if (!id) continue;
    const session = String(row[2] || '').trim();
    const record = {
      updatedAt: String(row[4] || ''),
      updatedBy: String(row[5] || '')
    };
    if (row[1]) record.status = normalizeStatus_(row[1]);
    if (session === '__NONE__') record.session = '';
    else if (session) record.session = session;
    if (row[3]) record.note = String(row[3]);
    records[id] = record;
  }

  const history = [];
  const latestById = {};
  const editValues = edits.getDataRange().getValues();
  for (let i = 1; i < editValues.length; i++) {
    const row = editValues[i];
    const at = String(row[0] || '');
    const id = String(row[1] || '').trim();
    if (!id) continue;
    const fieldLabel = String(row[3] || '');
    const field = fieldName_(fieldLabel);
    const item = {
      id,
      title: String(row[2] || ''),
      at,
      updatedBy: String(row[9] || ''),
      changes: [{
        field,
        label: fieldLabel,
        from: String(row[4] || ''),
        to: String(row[5] || '')
      }]
    };
    history.push(item);
    latestById[id] = {
      at,
      status: String(row[6] || ''),
      session: String(row[7] || ''),
      note: String(row[8] || '')
    };
  }

  Object.keys(latestById).forEach(id => {
    const latest = latestById[id];
    if (!records[id] && !latest.status && !latest.session && !latest.note) {
      deleted[id] = { updatedAt: latest.at };
    }
  });

  history.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
  return { ok: true, records, deleted, history: history.slice(0, 1500) };
}

function getWriteToken_() {
  const prop = PropertiesService.getScriptProperties().getProperty('CPGIS_SYNC_TOKEN');
  return prop || WRITE_TOKEN;
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = existing.every(v => !v);
  if (needsHeaders) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  return sheet;
}

function findCurrentRow_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues().flat().map(v => String(v || '').trim());
  const index = ids.indexOf(String(id));
  return index < 0 ? -1 : index + 2;
}

function normalizeStatus_(value) {
  const status = String(value || '').trim().toLowerCase();
  return ['registered', 'pending', 'missing', 'waived'].includes(status) ? status : '';
}

function displaySession_(session) {
  if (session === '__NONE__') return 'Not scheduled';
  return String(session || '');
}

function fieldName_(label) {
  const value = String(label || '').toLowerCase();
  if (value.includes('status')) return 'status';
  if (value.includes('session')) return 'session';
  return 'note';
}

function output_(e, data) {
  const callback = sanitizeCallback_(e.parameter.callback || '');
  const text = callback ? `${callback}(${JSON.stringify(data)})` : JSON.stringify(data);
  return ContentService.createTextOutput(text).setMimeType(
    callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON
  );
}

function sanitizeCallback_(callback) {
  return /^[A-Za-z_$][0-9A-Za-z_$.]*$/.test(callback) ? callback : '';
}
