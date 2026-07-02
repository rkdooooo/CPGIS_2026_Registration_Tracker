# Changelog — CPGIS 2026 Registration Tracker

Both `index.html` (served by GitHub Pages) and `CPGIS_2026_Registration_Tracker.html`
are kept byte-identical. Manual review edits, online sync, and organiser notes
(`KNOWN_INFO`/`ELIGIBLE_INFO`) are preserved across all changes.

## 2026-07-02 — Room swap: Room-8 → Room-6

The university swapped the room for `SRC-02-SR-D`. Confirmed against Dr. Feng's
updated file — the only difference from the prior import was the room number —
and applied: **`GSC-1`, `GSC-2`, `GSC-3`, `TMU-4`, `TMU-5`, `TMU-6`, `TMU-7`,
`TMU-8`** now show `Room-6` instead of `Room-8` (same venue, same day/time/order,
nothing else changed).

## 2026-07-02 — Add a new presentation

- Added **Shaobo Liu** (id `0707`) — *"Space Information Technologies for
  Sustainable Development of UNESCO-designated sites"*. Left unscheduled (no
  section) for now; assign it a session from the **Records** tab.

## 2026-07-02 — Import Dr. Feng's final programme; remove the title-review workflow

Applied `CPGIS_2026_final_programme_20260702.csv` (313 rows, 63 sections) —
Dr. Feng's confirmed final version — as the new programme layer, same process
as the 07-01 import (only programme placement fields touched; registration
fields untouched).

- **Section titles now set directly** from this file — no more "current vs
  recommended" distinction. Of the 16 sections Codex flagged on 07-01: 10 got
  exactly Codex's recommended title, 2 (`UPS-7`, `CED-8`) got Dr. Feng's own
  wording, and 5 (`REE-4`, `TMU-4`, `TMU-5`, `REE-7`, `TMU-8`) were kept as they
  were — all now baked in as final.
- **Removed 1 more presentation:** `3522` (was `GSC-7`) — not in the confirmed
  file, withdrawn the same way as prior removals.
- Applied the section/day/time/venue/room/order refresh for all 313 covered
  submissions (checked against the live sync first — the 32 rows the CSV shows
  as "Registered" already resolved to `registered` via existing sync overrides,
  so no redundant base changes were needed there).
- Verified against the same checklist as 07-01 (313 rows, no duplicate ids, no
  stale `16:30-17:45`, `SRC-02-LT-52` only on `HEI-8`, `HHJ-1`/`HHJ-2` both in
  `Room-5`, the 10 "do not rename" titles untouched). `HEI-3` still schedules 6
  talks (unchanged from 07-01, evidently intentional).
- **Removed the section-title review feature** added on 07-01 (the
  Approve/Reject/Edit card, `TITLE_DECISIONS` local state, `finalSessionName()`
  helper) now that Dr. Feng's titles are final — no more in-app review needed.
  All title display code reverted to reading `SESSIONS[code].name` directly.

## 2026-07-01 — Import the 2026-07-01 final programme (Codex-reviewed)

Applied `CPGIS_2026_final_programme_20260701_codex_recommended_final.csv` (314
rows, 63 sections) as the new authoritative programme layer, per
`CLAUDE_CODE_UPDATE_INSTRUCTIONS_20260701.md`. Registration-specific fields
(`baseRegistered`, `regName`/`regReceipt`/`regInvoice`, `joinNote`, waivers,
`KNOWN_INFO` overrides) were left untouched — only programme placement fields
were updated.

- **Removed 3 more presentations** (withdrawn, same pattern as before): `192`
  (Jianghai... rice/carbon paper, was LEA-5), `2769` (was CED-8), `6004` (was
  UPS-8).
- **Promoted 4 to Registered:** `55`, `2164`, `2236`, `6167`.
- **Applied all session/room/time updates:** every submission's section, day,
  parallel session, time, venue, room and within-section order now match the
  final CSV exactly (this naturally carries the `7673`→LEA-5, `3050`→UPS-6,
  `8510`→UPS-7, `8558`→UPS-8 moves, the global `16:30-17:45`→`16:30-18:00` fix,
  `SRC-02-LT-52`→`SRC-02-LT-51` rename except `HEI-8` — which now sits in
  `SRC-02-LT-52` with a blank room — and `HHJ-1`/`HHJ-2` sharing
  `SRC-01-SR-C / Room-5` back to back on Day 3).
- **`REE-8` removed** — its papers were redistributed by Codex into `CED-7`,
  `LEA-5`, `UPS-2`, `REE-7`, `TMU-4`; the section itself no longer has any talks.
- Verified against the full checklist in the instructions file (314 rows, no
  duplicate ids, no `16:30-17:45` left, `SRC-02-LT-52` only on `HEI-8`, `HHJ-1`/
  `HHJ-2` both in `Room-5`, the 10 "do not rename" organised titles untouched).
- ⚠️ `HEI-3` now schedules **6** talks in the source file (up from 5) — only 1 is
  currently an actual registered/pending/waived presenter, the other 5 are
  unregistered, so it doesn't breach the presenter cap today, but flagging since
  it's more talks than any other section.

### Section-title review workflow (approve / reject / edit)

Codex recommended clearer titles for 16 sections whose talk mix shifted after
all the moves (list in `section_title_recommended_changes_20260701.csv`).
Current titles are **kept unchanged** — nothing is silently renamed.

- New **"Section title review"** card in the **Notes** tab: each flagged section
  shows its current title, the recommended title, and Codex's reason, with
  **Approve** / **Reject** / **Edit…** (type your own) / **Reset** actions.
  A name field records who decided.
  A `finalSessionName(code)` helper resolves the effective title (custom →
  recommended → current) and is now used everywhere a session title is shown:
  the table cards, the session modal, the Records session dropdown, and all
  three CSV/HTML exports.
- Decisions save to this browser's `localStorage` only (`CPGIS_2026_TITLE_DECISIONS_V1`)
  — the same limitation as the presentation-order feature, since the shared
  Google Sheet sync only carries per-submission status/session/note, not
  per-section title decisions. **Export decisions** / **Import decisions**
  buttons let the decisions be copied between browsers (e.g. Dr. Feng decides on
  his machine, exports, and sends the file back to bake into the shared data).

## 2026-06-25 — Final consolidated programme export

A new **"Final programme export"** card in the **Notes** tab, with two one-click
exports of the current programme for the final review. Both are built from the
live runtime state, so they reflect all session moves, the saved presentation
order, and the latest online sync.

- **Open printable programme** (`exportFinalProgrammeHTML`) — a self-contained
  HTML page grouped by day → parallel session → section; each talk lists title,
  authors (real names), status and submission id. Opens in a new tab and has a
  Print / Save-as-PDF button (falls back to a download if pop-ups are blocked).
- **Download CSV** (`exportFinalProgrammeCSV`) — one row per scheduled
  presentation: Day, Parallel Session, Time, Section, Section name, Venue, Room,
  Order, Title, Authors, Submission ID, Status, Track.
- Empty sessions and removed/withdrawn submissions are omitted.

## 2026-06-24 — Drop Student-Competition labels from two regular presenters

Both authors applied to the student competition, were not selected, and present
at the conference as regular abstracts — so their stu_comp identity is removed.

- **Xiaoyu Zheng:** her talk was listed twice in `REE-7` — the regular abstract
  `2198` and a duplicate from the rejected student-competition entry `999902`
  ("Author02"). Removed the duplicate `999902` from the schedule; kept `2198`.
- **Xingyu Zhuo:** reclassified `999911` ("Author11") from a rejected stu_comp
  entry to a regular **Abstract submission** under his real name (Xingyu Zhuo),
  kept in `TMU-6`; cleared the placeholder name, the `stu_comp` track/REJECT, and
  the student-competition `KNOWN_INFO` so no "Student competition" badge remains.
- The student-competition sessions `GSC-1`/`GSC-2` were not touched.

## 2026-06-24 — Bake the per-session presentation order into the data

- The reorder feature saves order only in each viewer's browser (it can't ride
  the sync, which carries just status/session/note), so a colleague's ordering
  wasn't visible to others. The order Yijia arranged across **39 sessions** is now
  baked into the `SUBMISSIONS` array, so everyone (incl. Dr. Feng) sees it on load
  with no local cache needed. Within-session talks were permuted into the chosen
  order at their existing array positions (nothing else moved; row count unchanged).
- Sessions reordered: GFM-1…6, LEA-2/5/6, GSC-4…8, UPS-1/3/5/7/8, REE-1…8,
  CED-2/3/8, TMU-2/3/5/6/7, HEI-2/4/6/8.

## 2026-06-24 — Schedule the Huanghe Jiaotong sessions

- Per Dr. Feng, the two HHJTU sessions now take real Day-3 slots (no longer
  "Special / to be scheduled"):
  - **HHJ-1 → Parallel Session 7**, Wed 09:00–10:30, `SRC-01-SR-C / Room-5` — the
    slot vacated by HEI-7.
  - **HHJ-2 → Parallel Session 8**, Wed 10:45–12:00, `SRC-01-SR-B / Room-3/4` —
    the one empty room in PS8.
  - **MIX-1** (catch-all) stays a Special session with no fixed time.
- **HEI-7 ("Spatial Cognition and Navigation") dissolved.** Dr. Feng had already
  moved its three submissions out; these are now baked into the data
  (`9142`→GFM-7, `8370`→HEI-4, `8999`→MIX-1) and the empty HEI-7 session removed.
  No room clashes; no session exceeds 5 (verified against the live sync).
- HEI-7 also held an organiser-confirmed, **programme-only** presentation by
  **Shiyuan Cheng** ("Mapping Visual Attention to Navigational Cues in Real-World
  Wayfinding…", 0945 slot, no original submission row). It is now added as record
  `SHIYUAN01` in the **MIX-1** catch-all (open status), pending a final slot; the
  Notes entry was updated to match.

## 2026-06-24 — Reorder talks within a session

- Each presentation row in the session pop-up now has small ▲▼ buttons to move a
  talk up/down within its session. The round-table seat order and the list update
  live. A **"Reset order"** button (shown once a session has been reordered)
  restores the original order.
- The order is saved locally in the browser (`localStorage` key
  `CPGIS_2026_ORDER_V1`), kept separate from the synced review records. It is
  intentionally **not** synced — the online merge only carries
  status/session/note — so reordering never disturbs the organisers' synced
  edits. To share a finalised order with everyone, bake it into the data order
  and commit.
- Restored **Lanze Ying** (`5420`) to `UPS-6` (her original session) in the base
  data.

## 2026-06-24 — Special sessions (no fixed time)

- The two **Huanghe Jiaotong (HHJTU)** sessions (`HHJ-1`, `HHJ-2`) and the new
  catch-all session are flagged `special` and shown in a dedicated
  **"Special sessions"** group pinned to the bottom of the By-time view, with no
  time slot ("To be scheduled"). They are no longer placed in PS7/PS8 — their
  day/time can be assigned later.
- Added **`MIX-1` "Mixed Topics (catch-all)"** — an empty round table for any
  talk that can't be grouped elsewhere; move talks in from the Records tab.
- New `MIX` track (neutral gray). The By-session-type view lists `HHJ` and `MIX`
  as their own groups at the end.

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
