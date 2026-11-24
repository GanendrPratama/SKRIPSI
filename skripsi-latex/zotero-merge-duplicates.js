// Zotero: Tools -> Developer -> Run JavaScript. Tick "Run as async function", paste, click Run.
// Merges the 9 complete copies imported from Crossref (no PDF) with the old incomplete
// copies (with PDF). Merged-away copies go to Zotero's trash; nothing is deleted permanently.
const lib = Zotero.Libraries.userLibraryID;
const all = (await Zotero.Items.getAll(lib, true, false)).filter(i => i.isRegularItem() && !i.deleted);
const norm = t => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
const fixCase = t => t
  .replace(/\bllms\b/gi, 'LLMs').replace(/\bllm\b/gi, 'LLM')
  .replace(/\bgpu\b/gi, 'GPU').replace(/\bkv\b/gi, 'KV').replace(/\bslo\b/gi, 'SLO')
  .replace(/\bmoe\b/gi, 'MoE').replace(/\biot\b/gi, 'IoT').replace(/\bsmes\b/gi, 'SMEs');
const fresh = all.filter(i => i.dateAdded >= '2026-11-11 00:00:00' && i.getAttachments().length === 0);
const log = [];
for (const n of fresh) {
  const title = n.getField('title');
  const key = norm(title);
  const doi = (n.getField('DOI') || '').toLowerCase();
  const old = all.find(o => o.id !== n.id && o.getAttachments().length > 0 && (
    (key && norm(o.getField('title')) === key) ||
    (doi && (o.getField('DOI') || '').toLowerCase() === doi) ||
    (doi.includes('vjikms') && !o.getField('title'))));
  if (!old) { log.push('NO MATCH: ' + title); continue; }
  // Prefer the old copy's title capitalisation (from the PDF), then fix acronyms.
  const oldTitle = old.getField('title');
  n.setField('title', fixCase(oldTitle && norm(oldTitle) === key ? oldTitle : title));
  if (!n.getField('abstractNote') && old.getField('abstractNote')) {
    n.setField('abstractNote', old.getField('abstractNote'));
  }
  await n.saveTx();
  if (old.itemTypeID !== n.itemTypeID) {   // e.g. journalArticle -> conferencePaper
    old.setType(n.itemTypeID);
    await old.saveTx();
  }
  await Zotero.Items.merge(n, [old]);
  log.push('MERGED: ' + n.getField('title'));
}
// Trash the empty standalone note created by the BibTeX import.
const notes = (await Zotero.Items.getAll(lib, true, false))
  .filter(i => i.isNote() && !i.parentID && !i.deleted && i.dateAdded >= '2026-11-11 00:00:00'
    && !i.getNote().replace(/<[^>]*>/g, '').trim());
for (const nt of notes) { nt.deleted = true; await nt.saveTx(); log.push('TRASHED empty note ' + nt.key); }
return log.join('\n');
