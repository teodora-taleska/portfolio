# Project Category Filtering — Design Spec
**Date:** 2026-06-27

## Overview

Add category filter tabs to the Projects section so visitors can filter by domain. Projects can belong to multiple categories and appear in each matching filter.

## Categories

Tabs are hardcoded in this order (not derived from data):

| Tab | Label |
|-----|-------|
| 1 | All |
| 2 | ML & AI |
| 3 | Biosignals |
| 4 | Full-Stack |
| 5 | Data Science |
| 6 | Research |
| 7 | Creative Coding |
| 8 | Web Services |

`Web Services` always renders as a tab even with no projects assigned — clicking it shows a placeholder card ("Coming soon — client projects launching soon.").

## Data Model

Add a `categories: string[]` field to each project in `public/data/projects.js`.

| Project ID | Categories |
|---|---|
| player-ltv-studio | ML & AI, Full-Stack |
| toxic-comment-classification | ML & AI, Research |
| ecg-biometric-identification | ML & AI, Biosignals, Research |
| eeg-sleep-staging | ML & AI, Biosignals, Research |
| paperless-ngx | Full-Stack, Research |
| tampered-document-ai | ML & AI, Research |
| football-network-analysis | ML & AI, Data Science, Research |
| ml-mini-projects | ML & AI, Research |
| fitness-info-system | Full-Stack |
| teodora-space | Creative Coding |
| task-manager | (none — appears under All only) |
| global-hunger-index | Data Science, Research |
| equalita-care | Full-Stack, Research |
| mandelbrot-set | Research |

Future projects to assign when added:
- `biomedical-xai` → ML & AI, Biosignals, Data Science, Research
- `progress-tracker` → Full-Stack
- Editing agency site → Web Services

## UI

Filter tabs sit at the top of the right column (above the project cards), spanning full width.

**Active tab:** gold text (`#D4AF37`) + gold bottom border  
**Inactive tab:** muted (`text-th-fg/50`), hover → `text-th-fg`  
**Layout:** horizontal scrollable row of pill/tab buttons, wraps on mobile

## Component Behavior

- Default active tab: `All`
- Selecting a category filters the project list and resets pagination to page 0
- A project with no `categories` field or empty array appears only under `All`
- Pagination (3 per page) operates on the filtered list, not the full list
- `Web Services` with 0 matching projects renders a single placeholder card instead of the normal grid
- Filter state is local (`useState`) — not persisted to URL or localStorage

## Files to Change

1. `public/data/projects.js` — add `categories` field to each project
2. `src/components/Projects.jsx` — add filter tab UI + filtering logic
