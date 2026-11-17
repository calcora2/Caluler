# Caluler Project Instructions

## Mandatory Brand Color Policy

This policy applies to every future calculator, category, website
component, redesign, bug fix, UI improvement and new feature.

### Official Brand Palette

| Purpose | Approved color |
|---|---|
| Light Mode primary blue | #116F9F |
| Secondary and hover blue | #1686B5 |
| Dark Mode cyan accent | #58D9FF |
| Official blue gradient | #116F9F to #1686B5 |

### Mandatory Rules

1. Never introduce legacy blue colors into new tools or new UI modifications.
2. Do not use #0B537E as a new primary or secondary brand color.
3. Use the CSS variables already defined in assets/style.css:
   - var(--caluler-brand-primary)
   - var(--caluler-brand-secondary)
   - var(--caluler-brand-accent)
   - var(--caluler-brand-gradient)
4. Light Mode icons, links and primary accents must use #116F9F.
5. Secondary and hover states must use #1686B5.
6. Dark Mode icons, links and accents must use #58D9FF.
7. Use the official gradient for appropriate primary buttons and brand
   surfaces. Do not introduce unrelated blue gradients.
8. Apply the palette consistently to SVG icons, borders, focus states,
   buttons, dropdown selections, diagrams and interactive controls.
9. Maintain readable text contrast in both themes.
10. Never perform a site-wide blind color replacement. Existing pages
    must be changed only within the explicitly approved scope.
11. Before editing, inspect the existing HTML, CSS and JavaScript.
12. Verify every relevant change in Light Mode, Dark Mode, desktop
    and mobile layouts.
13. Preserve calculator formulas, functionality, URLs, content and
    existing tool counts.
14. Do not stage, commit or push Git changes without explicit approval.

### Required Before Every Future Modification

Read this file first.

Use the official Caluler palette for all newly created or modified UI.
Do not revert to historical brand blues.

---

## Caluler Repository Workflow (source-verified ZIP snapshot, 2026-11-10)

These instructions supplement **and do not override** the mandatory Brand Color Policy above. Always inspect the current repository again before using snapshot-specific observations. Do not turn historical observations into assumptions about new code.

### Actual source map and public URLs

- `index.html`: home/scientific calculator page; `tools.html`: main directory and category filters; `sitemap.xml`, `robots.txt`, `CNAME`: published discovery/configuration; `about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`: other public pages.
- `tools/*.html`: 212 active tools with a `body[data-caluler-category]` value across 14 categories in the provided ZIP. There are **25 additional legacy HTML pages with meta-refresh redirects**; these are not missing or disposable calculators. The 212 active tool URLs match both the tool-directory cards and tool URLs in the sitemap, in this snapshot. All 25 redirect destinations exist in the ZIP. Recheck these relationships on current sources before making directory, SEO, or URL changes.
- `assets/style.css`: large shared stylesheet, official brand CSS custom properties, layout and theme rules.
- `assets/caluler-master-design-v1.css`: second shared visual layer loaded by most (not all) active pages; check page link tags before assuming it applies.
- `assets/script.js`: large shared functionality bundle, theme handling, site UI, calculator functions.
- `assets/caluler-mobile-drawer-socials.js`: mobile navigation/social icon behavior.
- `assets/number-system-tools.js`: specific number-system calculators; do not replace its BigInt / exact-integer behavior with floating point.
- Many calculators have significant **inline `<style>` and `<script>` blocks**. Their formulas, diagram logic, and result code may be page-local rather than shared; inspect both sources.
- `seo-audit-report.csv`, `seo-redirect-canonical-audit.csv`, `seo-backup-20261025-214924/`, `NEW-CALCULATORS-README.txt` and other existing archives are historical evidence. Check age and accuracy; do not blindly replay old scripts or change historical backups.
- ZIP nesting (`Caluler/Caluler/`) is packaging layout; the repo root is whichever current directory actually contains `AGENTS.md`, `assets/`, `tools/`, and `tools.html`. Never assume Cloud can access `C:\Users\mrizw\OneDrive\Documents\GitHub\Caluler`.

### Task scope and decisions

1. Work on exactly one user-approved calculator **category** at a time; changing a shared file is allowed only when genuinely necessary for that approved work, with explicit awareness of its wider regression surface.
2. A clear user request for a specific change authorizes that scoped change; avoid repeated confirmations. Ask one focused question only if essential input is genuinely missing. Do not silently broaden scope.
3. Before changing anything, inspect current HTML, the exact CSS selector chain and stylesheets in load order, the relevant JavaScript code and event handlers, and current `git status --short` / relevant `git diff` when Git is available. Inspect earlier screenshots and backups only if available; do not invent them.
4. Identify root cause, intended visual/functional result, and minimal edit plan. Prefer small context-verified patches; reject blind global replacements. Abort unsafe patch when exact source/preconditions fail, then investigate rather than force it.
5. Do not rename/remove/merge tools, change established URLs or canonical tags, delete redirects, remove unique functionality, or update mathematical formulas without explicit authorization and mathematical/source verification.
6. Do not stage, commit, push, create PRs, reset, clean, or discard other changes without explicit authorization. Read-only Git inspection is allowed.
7. Preserve original `AGENTS.md` policies. Never introduce legacy brand blue `#0B537E` in new design; **do not** automatically erase existing instances in older CSS (e.g. the master visual stylesheet).

### Backups and implementation

- Before any file changes, make an **individually named, non-overwriting backup** outside the project directory and outside the Desktop when persistent filesystem access permits. Log exact paths and source file hashes where feasible. If backup capability is absent or not persistent in Codex Cloud, report that limitation and do not proceed with a high-risk/destructive operation.
- Protect independent user changes; do not overwrite files modified since inspection. Use a targeted diff and re-read source before a multi-file patch.
- Do not install new frameworks, rewrite the site architecture, or use broad autoformatting for small fixes. There is no test/build manifest (`package.json` or equivalent) in this ZIP snapshot; discover actual project setup before choosing commands.
- For Windows-PC tasks provide complete, source-checking PowerShell blocks with error handling, non-overwriting backups, and final statuses. In Cloud use its *actual* shell and paths instead of claiming to run PowerShell on the owner's PC.

### Styling, accessibility, and SEO

- Keep spacing, typography, cards, readable form labels/validation, mobile header/nav and related-tool modules consistent. Preserve search positioning and social SVG source behavior; diagnose Facebook icon via actual SVG and selectors before fixing backgrounds.
- Theme logic in `assets/script.js` sets `html[data-theme]` and `body.dark-mode`; relevant CSS uses multiple theme selector families. Test **both** themes after page-specific or shared changes.
- Check desktop, tablet and mobile widths; verify no horizontal overflow, clipped content or inaccessible controls. Use real browser/screenshots when possible, and clearly mark checks not performed.
- Maintain a unique title, meta description, H1, formula explanation, steps/example, FAQs and meaningful internal links. Preserve target audience intent and any calculator-specific localization. Never rewrite canonical/redirect/sitemap entries without verifying all affected URLs.
- Maintain fast loading and existing advertising positions. For applicable Finance result pages, preserve the specified 75% result and 25% right-side ad area on desktop, with responsive stacking/no overflow on narrow screens. Keep result card pale-blue and values legible where approved, with Copy/Print/Download controls intact.

### Special source notes that MUST be reverified

- `tools/cost-per-unit-calculator.html` is the approved reference for the **overall Ohm's Law page redesign**, not a mandate to copy formulas. `tools/ohms-law-calculator.html` has five numeric inputs, unit selectors and local JS; in this ZIP it does **not** link `assets/caluler-master-design-v1.css`. Inspect source/load order first. Preserve five-input behavior, unit conversions, formulas, output, content and SEO; finish/verify layout before starting an animated circuit diagram.
- `tools/business-valuation-calculator.html` includes a custom HTML `div` flow (`caluler-bv-flow`) **and separate helper code creating SVG nodes**. Therefore the code base is mixed; inspect the precise active renderer and its mobile fallback before SVG changes. Never claim all diagrams are HTML or all are SVG.
- Finance calculator pages such as `tools/emi-calculator.html` and `tools/business-valuation-calculator.html` contain large page-local `<style>`/`<script>` blocks. Preserve page-specific logic and diagrams; avoid site-wide CSS overrides until dependencies are mapped.
- `tools/number-system-converter.html` uses `assets/number-system-tools.js`; preserve exact `BigInt` handling. The legacy redirect URLs for binary/decimal conversions may pass query parameters, so verify deep-link semantics before editing redirects or the destination.

### Required verification & final report

For every scoped fix, verify what changed; choose focused checks first, then dependent regression checks when shared code was affected:

1. **Static:** diff and exact changed files; parse/inspect markup, selectors, script references, input IDs, canonical targets and internal URLs; search for unexpected new duplicates.
2. **Calculations:** representative numeric values, zero/empty/invalid/negative/decimal/boundaries where allowed; unit conversions; correct rounding; no NaN/Infinity or stale results; multiple runs and changing inputs.
3. **Behavior:** validation/error messages, reset, result updates, Copy/Print/Download, related-tool links, page navigation and diagrams/labels.
4. **Visual:** browser console plus desktop/tablet/mobile in **Light** and **Dark** mode; only say PASS when actually executed. No browser environment means NOT TESTED, not PASS.
5. **Regression:** retest prior fixed problems within the touched category, and relevant dependent pages when shared CSS/JS changes.

Final report in concise Roman Urdu must include: active category, pages/files changed, what was done and why, backup location or not created, tests run with PASS/FAIL/NOT RUN, desktop/mobile/tablet and both-theme status, regression status, remaining risks, and **Git staging/commit/push status**. Never fabricate successful testing. For PowerShell logs use meaningful markers: `READ ONLY`, `BACKUP CREATED`, `FILES MODIFIED`, `VERIFICATION PASSED`, `VERIFICATION FAILED`, `OPERATION ABORTED`.

### Efficient operation

Reduce unnecessary token/command overhead by using focused file searches, reusing existing components, running independent read-only checks in parallel when safe, and testing the changed behavior first. Do **not** trade away safety, backups, source verification, or browser honesty for speed.


---

## Verified Business Valuation Renderer Record (2026-11-09 report cross-checked 2026-11-10)

The owner supplied `Caluler-BusinessValuation-Render-Verification-20261109-163428.txt`.
The three report SHA-256 hashes match **the files in the uploaded ZIP snapshot**, not necessarily the latest local Git working tree:

| File | SHA-256 in report and ZIP |
|---|---|
| `tools/business-valuation-calculator.html` | `0C58934FD08DEB54C608C5C2DEE9A5C56429A89CE4A3D57C955BA186A06A4E62` |
| `assets/style.css` | `5A51CB8DD5A63CA21357D2470F3B2327FC106AE90FB5EE49B23301F01FC3DA5C` |
| `assets/script.js` | `BD7E0EDB4DB42B43055428C275869F400787AB3D9AB48D4B5BAA5EB669A3741A` |

**Actual renderer call path in this snapshot:**

1. `tools/business-valuation-calculator.html` around line 2141 defines `renderCalulerBusinessValuationBridge(rows, panel)`. This custom renderer uses `document.createElement(...)` for HTML `section`, `div`, `span`, etc.; **it does not call `createElementNS`**.
2. Around lines 2730-2738, a *separate generic* `renderFinanceVisual(kind, rows)` uses the SVG namespace via `document.createElementNS(...)`. This SVG helper's presence **does not mean the Business Valuation bridge is rendered as SVG**.
3. Around lines 3026-3036, `draw()` selects the custom bridge for `panel.dataset.financeLiveKind === 'business-valuation'`, appends `customBridge || renderFinanceVisual(...)`, **then also appends `renderMobileBreakdown(rows)`**.
4. The `assets/style.css` block `CALULER-FINANCE-RESPONSIVE-SINGLE-VISUAL-V1` around lines 13726-13749 hides the mobile breakdown at `min-width: 561px`, and at `max-width: 560px` hides other children and displays the mobile breakdown. Page-inline style rules also exist; inspect cascade, specificity and load order before assuming exact browser appearance.
5. Reported source counts: one diagram section, one live-items container, one diagram note, one custom bridge append expression and one mobile breakdown append expression. These were source scans, not proof of rendered page behavior.

**Non-negotiable Business Valuation safety decision:**

- **Do not attempt SVG restoration, replace the bridge with generic SVG, remove the HTML bridge, delete the mobile breakdown, or duplicate diagram rendering without inspecting the current version and obtaining explicit authorization for that feature change.**
- If asked to troubleshoot mobile visibility or duplicate visuals, first check the exact viewport width at 560px/561px, CSS cascade across inline and shared styles, `data-finance-live-kind` and category selectors, `draw()`/listener behavior, whether both visual nodes exist and which is computed-visible, and current Light/Dark Mode screenshots.
- Ensure the displayed path follows the business valuation relationship: enterprise value = operating metric × selected multiple; equity value = enterprise value − debt + cash. Treat this as a **verification target**, not permission to rewrite business formulas. Test both EBITDA and revenue methods, missing inputs, values, labels, repeated live updates and confirmed result separately.
- Confirm the current source hashes yourself before claiming this old report still applies to the user's Windows checkout. Hash differences mean **reinspect**, not automatic failure of the whole project.
- The source and hash cross-check is **PASSED against ZIP**. Live browser behavior, actual calculations, mobile presentation, and Light/Dark Mode are **NOT TESTED** in this review.
- Original report says: `PROJECT FILES MODIFIED: NO`, `BACKUPS CREATED: NO`, `GIT OPERATIONS: NONE`. Do not reinterpret those as actions performed in a later session.


## Strict diagram update rule — approved 2026-11-11

- All Finance diagrams must initialize visibly from valid default inputs on page load without submitting Results. Invalid/empty initial values must show a clear fallback. Subsequent diagram and Results updates require an explicit Calculate/submit action; Enter must use that same action.
- Never redraw or recalculate a diagram or Results on input, change, focus, blur or tab navigation. Preserve the last valid calculated Results, diagram and tooltip values while inputs are edited.
- Invalid/incomplete/non-numeric Calculate actions must keep the previous valid calculation and show an accessible validation message separately. Results may show the exact final values immediately after valid Calculate; the visible diagram must animate toward that same calculation snapshot and finish exactly. Never mix different calculation targets.
- Use the shared Finance submit-only commit helper in assets/script.js and expose the page-local draw callback on the form/calculator. Renderers must not call Calculate recursively. Remove legacy live-preview listeners and duplicate submit/Enter hooks.
- Animate successful Calculate actions for 1.8–2 seconds on one requestAnimationFrame/performance.now timeline with natural ease-in-out. Interpolate numeric values and visual geometry together, preserve the visible DOM/SVG, and retarget rapid submissions from the current displayed state. Never clear/hide/fade/reset the diagram. Respect prefers-reduced-motion. Responsive reflow and browser history restoration must reuse the displayed/committed snapshot, never edited financial inputs. Use the shared persistent motion adapter where applicable; retain verified calculator-specific adapters.
- Keep formulas, calculator-specific rendering, tooltips, keyboard accessibility, result actions and URLs intact. New Finance pages must adopt the submit-only adapter. This policy supersedes earlier live-on-typing preview behavior and historical examples.
