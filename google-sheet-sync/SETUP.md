# Google Sheet Sync Setup

This folder contains the Apps Script used by the CPGIS tracker to save shared
manual review edits into Google Sheets.

## 1. Open Apps Script

Open the Google Sheet:

https://docs.google.com/spreadsheets/d/1bSbLyOCge7yfNLhqqzhrI4fUae8qAajyG5y26BoEJdc/edit

Then select:

`Extensions` -> `Apps Script`

## 2. Paste the script

Delete any starter code in `Code.gs`, then paste the full content from:

`GOOGLE_SHEET_SYNC/Code.gs`

At the top of the script, replace:

```js
const WRITE_TOKEN = 'CHANGE_THIS_PASSCODE';
```

with a short private passcode that you can share with the teachers who need to
edit the tracker.

Example:

```js
const WRITE_TOKEN = 'cpgis2026';
```

## 3. Save and deploy

1. Click Save.
2. Click `Deploy` -> `New deployment`.
3. Select type: `Web app`.
4. Description: `CPGIS tracker sync`.
5. Execute as: `Me`.
6. Who has access: `Anyone`.
7. Click `Deploy`.
8. Authorize the script when prompted.
9. Copy the Web App URL. It should end with `/exec`.

## 4. Configure the tracker

Open the GitHub Pages tracker, go to `Notes` -> `Online sync`, then enter:

- Apps Script Web App URL
- Your name
- The update passcode

Click `Save sync settings`, then `Load online updates`.

Each teacher who needs to edit should enter the same Web App URL and passcode
once in their own browser.

## Notes

- The public GitHub Pages page does not expose the passcode by default. Each
  reviewer enters it locally in their browser.
- Manual edits are still saved locally first. Online sync then writes a shared
  copy to the Google Sheet.
- The `Current` sheet stores the latest manual override for each submission.
- The `Edits` sheet stores timestamped history.
