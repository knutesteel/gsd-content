# Feature-Parity Checklist

## Content

- [ ] Create, edit, duplicate, archive, restore, and delete
- [ ] Identifiers such as `32`, `32-1`, and `32-2`
- [ ] New, Auto-Added, Generated, Posted, and Archived statuses
- [ ] Overview, caption, content, prompt, type, panels, source, score, and priority
- [ ] Favorite, search, filter, and numeric variant sorting
- [ ] Posted content sorted by the actual Posted transition timestamp

## Discovery and Generation

- [x] Submit one or many URLs
- [x] Prevent duplicate source ingestion
- [x] Return created, existing, or failed with reason for every URL
- [x] Generate and regenerate without stale-result overwrite
- [x] Retain every generation attempt and content version
- [x] Associate multiple assets with one content item

## Publishing and Administration

- [ ] Generate Post action and Posted reminder
- [ ] Posted timestamp, Instagram URL, and publishing notes
- [ ] Dashboard counts match list and detail views
- [x] Instructions first and Archive last in navigation
- [x] Collaborations, Channels, Retail Plan, and Online Sales retained
- [x] Metrics, scheduled discovery, daily backup, and CSV export retained

## Launch Gates

- [ ] Every existing record accounted for
- [ ] No unexplained duplicate identifier
- [ ] App-only records can be archived
- [ ] Regeneration cannot be overwritten by an older request
- [ ] Every batch operation has an explicit per-record result
- [ ] No operational Google Sheets API call remains
