# Changelog — CPGIS 2026 Registration Tracker

Both `index.html` (served by GitHub Pages) and `CPGIS_2026_Registration_Tracker.html`
are kept byte-identical. Manual review edits, online sync, and organiser notes
(`KNOWN_INFO`/`ELIGIBLE_INFO`) are preserved across all changes.

## 2026-06-24

Programme edits per Dr. Feng. These are baked into the embedded data and combine
with his Google-Sheet review overrides (62 records, auto-loaded on open). Verified:
with his sync applied, no session exceeds 5 talks.

- **Removed 6 withdrawn presentations** (off-schedule, kept in data flagged
  `withdrawn`): `9593`, `3304`, `5657`, `5420`, `2177`, `3456`. Only the MasterList
  `Withdraw` column = true withdrawal; refund-only entries (`189` Meng Zhou,
  `8680` Shi He) were restored.
- **Added two Huanghe Jiaotong (HHJTU) special sessions** on Day 3: `HHJ-1`
  (Wed 09:00–10:30) and `HHJ-2` (Wed 10:45–12:00), 10 students (waived), new
  `HHJ` track.
- **Added Hu Shixiong's abstract** (`HHJHU01`, sea-level/coastal RS) to `REE-5`.
- **Moved Cunjin Xue** (`8558`) `REE-5` → `GFM-7` — frees a REE-5 slot for Hu;
  GFM-7 had an opening from the `5657` withdrawal; keeps every session ≤5.

## 2026-06-22

- **New status sub-type "Pending-reg"** (violet). For registrants who wrote in
  about a registration issue. Manual-only — set it per record in the **Records**
  tab; it is never assigned automatically. Counts as an open/outstanding item and
  is wired into the legend, the status filters, the Records dropdown, and the
  header breakdown. (Assign the two affected records in the Records tab.)

- **Reordered the Tuesday (Day 2) LEA parallel sessions.** Each session's topic
  and its talks moved to a new time slot; the slot times and room (TP-02-SR-F,
  Room-5/6) are unchanged:
  | Slot | Time | Now shows | (was) |
  |------|------|-----------|-------|
  | LEA-4 | Tue 13:00–14:30 | Urban Building Extraction and Remote Sensing | LEA-5 |
  | LEA-5 | Tue 14:45–16:15 | Rural Development, Land Sustainability, and Food Systems | LEA-6 |
  | LEA-6 | Tue 16:30–17:45 | Ecosystem Monitoring and Land Surface Dynamics | LEA-4 |

- Removed an obsolete earlier copy of the tracker that lived outside this repo.
