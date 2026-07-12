# OneDrive-Ordnerstruktur und PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den gesamten lokal synchronisierten OneDrive-Bestand read-only inventarisieren, Dokumentgruppen nachvollziehbar einordnen und einen visuell geprüften PDF-Vorschlag für eine schlanke Ordnerstruktur erzeugen.

**Architecture:** Ein fokussiertes Python-Inventarskript liest ausschließlich Dateisystem-Metadaten und gruppiert Medien ohne Einzelprüfung. Ein separates PDF-Skript verarbeitet die geprüfte Inventardatei und die daraus abgeleiteten Empfehlungen. Temporäre Daten bleiben unter `tmp/pdfs/`; das einzige Benutzerartefakt liegt unter `output/pdf/`.

**Tech Stack:** Python 3, Standardbibliothek (`pathlib`, `json`, `collections`, `datetime`), ReportLab, Poppler (`pdfinfo`, `pdftoppm`), pdfplumber.

## Global Constraints

- OneDrive bleibt read-only; keine Datei wird verschoben, umbenannt oder gelöscht.
- Fotos, Videos und Audiodateien werden jeweils nur als zusammengefasster Bestand behandelt.
- Dokumentgruppen werden durch Pfad, Dateiname, Dateityp, Datum, Größe und bei Bedarf eine sichere Vorschau begründet.
- Die Zielstruktur bleibt flach und verwendet Unterordner nur für tatsächlich wiederkehrende Gruppen.
- Persönliche Dateiinhalte werden nicht unnötig im Bericht wiedergegeben.
- Die finale PDF wird gerendert und visuell auf Layoutfehler geprüft.

---

### Task 1: Reproduzierbares OneDrive-Inventar

**Files:**
- Create: `tools/onedrive_inventory.py`
- Create: `tests/onedrive_inventory_test.py`
- Create at runtime: `tmp/pdfs/onedrive_inventory.json`

**Interfaces:**
- Consumes: OneDrive root `/Users/ken/Library/CloudStorage/OneDrive-Persönlich`
- Produces: `build_inventory(root: Path) -> dict` mit `summary`, `top_level`, `extensions`, `document_groups`, `largest_non_media` und `limitations`

- [ ] **Step 1: Write the failing test**

```python
def test_media_are_aggregated_and_documents_are_grouped(tmp_path):
    (tmp_path / "Fotos").mkdir()
    (tmp_path / "Fotos" / "a.jpg").write_bytes(b"x")
    (tmp_path / "Vertrag.pdf").write_bytes(b"pdf")
    inventory = build_inventory(tmp_path)
    assert inventory["summary"]["media"]["photos"]["files"] == 1
    assert inventory["summary"]["documents"]["files"] == 1
    assert inventory["top_level"]["Fotos"]["files"] == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/onedrive_inventory_test.py -v`

Expected: FAIL because `tools.onedrive_inventory` does not exist.

- [ ] **Step 3: Implement the inventory scanner**

Implement recursive traversal with `Path.rglob("*")`, extension sets for photos, videos and audio, separate non-media document counts, byte totals, oldest/newest modification dates, top-level folder summaries, extension counts and inaccessible-path capture. Do not open media files or mutate any OneDrive path.

- [ ] **Step 4: Run unit test and generate the inventory**

Run: `python3 -m unittest tests/onedrive_inventory_test.py -v`

Expected: PASS.

Run: `mkdir -p tmp/pdfs && python3 tools/onedrive_inventory.py '/Users/ken/Library/CloudStorage/OneDrive-Persönlich' --output tmp/pdfs/onedrive_inventory.json`

Expected: exit code 0 and a JSON object containing non-zero `summary.total_files`.

- [ ] **Step 5: Validate inventory totals**

Run: `python3 -m json.tool tmp/pdfs/onedrive_inventory.json >/dev/null`

Expected: exit code 0. Compare total files, bytes and per-top-level counts to an independent `find`-based count and record any inaccessible or cloud-only items under `limitations`.

### Task 2: Evidence-backed Strukturentwurf

**Files:**
- Create: `tmp/pdfs/onedrive_findings.md`
- Read: `tmp/pdfs/onedrive_inventory.json`

**Interfaces:**
- Consumes: validated inventory JSON and safe document-name/path samples
- Produces: a concise findings document containing observed groups, clutter causes, recommended tree, current-to-target mapping and caveats

- [ ] **Step 1: Review every top-level group**

For every existing top-level folder, record file count, byte size, dominant extensions, date range and whether it maps to documents, work/education, project, media, inbox or archive. Media folders remain aggregate-only.

- [ ] **Step 2: Review non-media document evidence**

List non-media files and group them by repeated filename/path signals. Open only the minimum safe previews needed to disambiguate unclear recurring groups; never reproduce sensitive contents in the findings document.

- [ ] **Step 3: Draft the final target tree**

Use the approved top-level model (`00 Eingang`, `01 Persoenliche Dokumente`, `02 Finanzen`, `03 Arbeit & Bildung`, `04 Projekte`, `05 Medien`, `99 Archiv`) and retain only evidence-backed subfolders. Each existing major group must have exactly one proposed destination or an explicit review rule.

- [ ] **Step 4: Validate the mapping**

Check that every current top-level folder and every recurring non-media group is represented. Confirm the proposal rarely exceeds two folder levels and does not create empty speculative categories.

### Task 3: Polished PDF proposal

**Files:**
- Create: `tools/create_onedrive_structure_pdf.py`
- Create: `tests/create_onedrive_structure_pdf_test.py`
- Create: `output/pdf/onedrive-ordnerstruktur-vorschlag.pdf`
- Create at runtime: `tmp/pdfs/rendered/onedrive-ordnerstruktur-*.png`

**Interfaces:**
- Consumes: `tmp/pdfs/onedrive_inventory.json` and `tmp/pdfs/onedrive_findings.md`
- Produces: a self-contained German PDF with inventory overview, diagnosis, folder tree, mapping table, naming rules, migration sequence and limitations

- [ ] **Step 1: Write the failing PDF smoke test**

```python
def test_pdf_contains_required_sections(tmp_path):
    output = tmp_path / "proposal.pdf"
    create_pdf(sample_inventory(), sample_findings(), output)
    text = "\n".join(page.extract_text() or "" for page in pdfplumber.open(output).pages)
    for heading in ["Bestandsuebersicht", "Empfohlene Ordnerstruktur", "Ablageregeln", "Vorgehen"]:
        assert heading in text
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests/create_onedrive_structure_pdf_test.py -v`

Expected: FAIL because the PDF generator does not exist.

- [ ] **Step 3: Implement the ReportLab document**

Build an A4 document with consistent margins, restrained color palette, title page, key metrics, compact folder-tree panel, readable mapping table, concise rules and numbered implementation sequence. Add page numbers and prevent rows or headings from clipping across page boundaries.

- [ ] **Step 4: Run tests and create final PDF**

Run: `python3 -m unittest tests/onedrive_inventory_test.py tests/create_onedrive_structure_pdf_test.py -v`

Expected: all tests PASS.

Run: `mkdir -p output/pdf tmp/pdfs/rendered && python3 tools/create_onedrive_structure_pdf.py --inventory tmp/pdfs/onedrive_inventory.json --findings tmp/pdfs/onedrive_findings.md --output output/pdf/onedrive-ordnerstruktur-vorschlag.pdf`

Expected: exit code 0 and a non-empty PDF.

- [ ] **Step 5: Render and inspect every page**

Run: `pdfinfo output/pdf/onedrive-ordnerstruktur-vorschlag.pdf`

Expected: valid A4 PDF with a positive page count.

Run: `pdftoppm -png -r 150 output/pdf/onedrive-ordnerstruktur-vorschlag.pdf tmp/pdfs/rendered/onedrive-ordnerstruktur`

Expected: one PNG per PDF page. Inspect every PNG for clipped text, overlaps, broken glyphs, weak contrast, awkward page breaks and unreadable tables; revise and re-render until no defects remain.

- [ ] **Step 6: Final content verification**

Run: `python3 -c "import pdfplumber; p=pdfplumber.open('output/pdf/onedrive-ordnerstruktur-vorschlag.pdf'); t=' '.join((x.extract_text() or '') for x in p.pages); assert all(s in t for s in ['Bestandsuebersicht','Empfohlene Ordnerstruktur','Ablageregeln','Vorgehen']); print(len(p.pages))"`

Expected: a positive page count and exit code 0.

### Task 4: Handoff and cleanup

**Files:**
- Keep: `output/pdf/onedrive-ordnerstruktur-vorschlag.pdf`
- Remove after QA: `tmp/pdfs/rendered/*.png`
- Keep for reproducibility: `tmp/pdfs/onedrive_inventory.json`, `tmp/pdfs/onedrive_findings.md`, `tools/onedrive_inventory.py`, `tools/create_onedrive_structure_pdf.py`, and their tests

**Interfaces:**
- Consumes: completed and verified PDF
- Produces: clickable final artifact path and a brief summary of scope and limitations

- [ ] **Step 1: Confirm no OneDrive mutations occurred**

Compare the OneDrive root metadata snapshot captured before and after analysis; only cloud hydration timestamps may differ. Confirm no move, rename or delete operation was performed.

- [ ] **Step 2: Remove rendered temporary PNGs**

Run: `rm -f tmp/pdfs/rendered/onedrive-ordnerstruktur-*.png`

Expected: final PDF remains intact and temporary page images are removed.

- [ ] **Step 3: Deliver the PDF**

Provide the absolute clickable path to `output/pdf/onedrive-ordnerstruktur-vorschlag.pdf`, summarize the recommended structure in one paragraph and list material limitations such as inaccessible Personal Vault or cloud-only placeholders.
