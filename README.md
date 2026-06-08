# CPGIS 2026 Registration Tracker

This repository hosts the CPGIS 2026 registration tracker as a static GitHub
Pages site.

## Open the tracker

Open `index.html` directly, or use the GitHub Pages link once Pages is enabled.

## Manual review edits

Manual review changes made inside the webpage are saved locally first. The
tracker can also sync those edits to a shared Google Sheet after the Apps
Script web app is deployed.

For online collaboration, open the tracker and go to:

`Notes` -> `Online sync`

Then enter the Apps Script Web App URL, reviewer name, and update passcode.
Each collaborator only needs to do this once in their own browser.

The Apps Script setup files are in:

`google-sheet-sync/`

## GitHub Pages setup

In the GitHub repository:

1. Go to Settings.
2. Open Pages.
3. Set Source to `Deploy from a branch`.
4. Select the `main` branch and `/ (root)` folder.
5. Save and wait for the Pages URL to become available.
