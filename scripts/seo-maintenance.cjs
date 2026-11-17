#!/usr/bin/env node
'use strict';
// Local-only, dependency-free SEO audit and idempotent metadata maintenance.
// Run: node scripts/seo-maintenance.cjs --out <external-report-directory> [--apply] [--check]
// --apply creates verified, non-overwriting backups before changing existing HTML.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),args=process.argv.slice(2),outIndex=args.indexOf('--out');
if(outIndex<0||!args[outIndex+1]){console.error('Usage: node scripts/seo-maintenance.cjs --out <external-directory> [--apply] [--check]');process.exit(2);}
const run=path.resolve(args[outIndex+1]);
if(run===root||run.startsWith(root+path.sep))throw Error('Reports/backups must be outside the project.');
fs.mkdirSync(run,{recursive:true});process.chdir(root);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const decode=s=>String(s||'').replace(/&#x([\da-f]+);/gi,(_,x)=>String.fromCodePoint(parseInt(x,16))).replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(+x)).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&nbsp;',' ');
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3]??m[4])])),text=s=>decode(s.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();

function audit(){
const inventory=JSON.parse(fs.readFileSync('assets/script.js','utf8').match(/(?:const|let|var) SEARCH_INDEX\s*=\s*(\[[^\n]+\]);/)[1]);
const sitemap=fs.readFileSync('sitemap.xml','utf8'),locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1])),publicFiles=new Set(['index.html','tools.html','about.html','contact.html','privacy.html','terms.html','disclaimer.html']);
for(const u of locs){const p=new URL(u).pathname;if(/^\/[^/]+\.html$/.test(p))publicFiles.add(p.slice(1));}
const inventoryMap=new Map(inventory.map(t=>[t.url,t])),files=[...new Set([...publicFiles,...inventoryMap.keys()])],pages=[],missingTargets=[],brokenResources=[],anchorWarnings=[],categoryLinks=[];
const local=u=>decodeURIComponent(u.pathname)==='/'?'index.html':decodeURIComponent(u.pathname).replace(/^\//,''),existsCache=new Map(),exists=f=>{if(!existsCache.has(f))existsCache.set(f,fs.existsSync(path.join(root,f)));return existsCache.get(f);};
for(const file of files){const src=fs.readFileSync(file,'utf8'),head=src.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||'',clean=src.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,''),meta=[...head.matchAll(/<meta\b([^>]*)>/gi)].map(m=>attrs(m[1])),links=[...head.matchAll(/<link\b([^>]*)>/gi)].map(m=>attrs(m[1])),canonicals=links.filter(n=>(n.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(n=>n.href),url='https://caluler.work/'+(file==='index.html'?'':file),values=k=>meta.filter(n=>(n.name||n.property||'').toLowerCase()===k).map(n=>n.content||''),schemas=[],jsonErrors=[];
 for(const m of head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(attrs(m[1]).type!=='application/ld+json')continue;try{const d=JSON.parse(m[2]);schemas.push(d);}catch(e){jsonErrors.push(e.message);}}
 const nodes=[];function walk(o){if(Array.isArray(o))o.forEach(walk);else if(o&&typeof o==='object'){if(o['@type'])nodes.push(o);Object.values(o).forEach(v=>{if(v&&typeof v==='object')walk(v);});}}schemas.forEach(walk);
 const types=nodes.flatMap(n=>[].concat(n['@type'])),h1=[...clean.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>text(m[1])),titles=[...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(m=>text(m[1])),duplicateMeta=[...new Set(meta.map(n=>(n.name||n.property||'').toLowerCase()).filter(Boolean))].filter(k=>values(k).length>1),issues=[],warnings=[];
 if(titles.length!==1||!titles[0])issues.push('title missing/duplicate');if(values('description').length!==1||!values('description')[0])issues.push('description missing/duplicate');if(h1.length!==1||!h1[0])issues.push('H1 missing/duplicate');if(canonicals.length!==1||canonicals[0]!==url)issues.push('canonical mismatch');if(jsonErrors.length)issues.push('invalid JSON-LD');if(duplicateMeta.length)issues.push('duplicate metadata: '+duplicateMeta.join(','));
 const robots=[...values('robots'),...values('googlebot'),...values('bingbot')];if(robots.some(s=>/\b(?:noindex|none)\b/i.test(s)))issues.push('noindex');if(meta.some(n=>(n['http-equiv']||'').toLowerCase()==='refresh'))issues.push('unexpected refresh');if(!/^en(?:-|$)/i.test(attrs(src.match(/<html\b([^>]*)>/i)?.[1]||'').lang||''))issues.push('HTML lang not English');
 for(const k of ['og:type','og:site_name','og:title','og:description','og:url'])if(values(k).length!==1||!values(k)[0])issues.push(k+' missing/duplicate');if(values('og:url')[0]!==url)issues.push('og:url mismatch');if(values('og:site_name')[0]!=='Caluler')issues.push('brand site_name mismatch');if(titles[0]&&!/Caluler/.test(titles[0]))issues.push('title brand missing');if(/Calculer/i.test(head))issues.push('brand typo in head');
 if(titles[0]?.length>65)warnings.push('title >65 characters');if(values('description')[0]?.length>170)warnings.push('description >170 characters');if(values('description')[0]?.length<70)warnings.push('short description');if(!types.includes('WebPage')&&file!=='index.html')warnings.push('WebPage JSON-LD absent');
 const bodyAttrs=attrs(src.match(/<body\b([^>]*)>/i)?.[1]||'');if(inventoryMap.has(file)&&bodyAttrs['data-caluler-category']!==inventoryMap.get(file).category)issues.push('body category mismatch');
 let related=0,internal=0;const anchorRefs=[];for(const m of clean.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){const a=attrs(m[1]);if(!a.href||/^(?:javascript:|mailto:|tel:|data:)/i.test(a.href))continue;let u;try{u=new URL(a.href,url);}catch(e){missingTargets.push({file,href:a.href,reason:'invalid URL'});continue;}if(u.origin!=='https://caluler.work')continue;internal++;const target=local(u);if(!exists(target))missingTargets.push({file,href:a.href,target,reason:'missing file'});else if(u.hash&&u.hash!=='#')anchorRefs.push({href:a.href,target,id:decodeURIComponent(u.hash.slice(1))});if(u.pathname.endsWith('/tools.html')&&u.searchParams.has('category'))categoryLinks.push({file,href:a.href,category:u.searchParams.get('category')});if(inventoryMap.has(target)&&target!==file)related++;}
 for(const m of src.matchAll(/<(?:script|img|link)\b([^>]*)>/gi)){const a=attrs(m[1]),ref=a.src||a.href;if(!ref||/^(?:data:|javascript:)/i.test(ref))continue;let u;try{u=new URL(ref,url);}catch{continue;}if(u.origin==='https://caluler.work'&&!exists(local(u)))brokenResources.push({file,href:ref,target:local(u)});}
 for(const img of [...values('og:image'),...values('twitter:image')]){try{const u=new URL(img,url);if(u.origin==='https://caluler.work'&&!exists(local(u)))brokenResources.push({file,href:img,target:local(u),socialImage:true});}catch{issues.push('invalid social image URL');}}
 pages.push({file,url,tool:inventoryMap.has(file),inventory:inventoryMap.get(file)||null,sha256:hash(Buffer.from(src)),title:titles,description:values('description'),h1,canonical:canonicals,lang:attrs(src.match(/<html\b([^>]*)>/i)?.[1]||'').lang,meta,schemas,schemaTypes:types,jsonErrors,issues,warnings,internalLinks:internal,relatedToolLinks:related,anchorRefs,headLength:head.length,explanationHeadings:[...clean.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)].map(m=>text(m[1]))});
}
for(const p of pages)for(const r of p.anchorRefs){const src=fs.readFileSync(r.target,'utf8');const ids=[...src.matchAll(/\b(?:id|name)\s*=\s*["']([^"']+)["']/gi)].map(m=>decode(m[1]));if(!ids.includes(r.id))anchorWarnings.push({file:p.file,...r});}
const duplicates=key=>{const groups=new Map();pages.forEach(p=>{const k=p[key][0]?.toLowerCase();if(k)groups.set(k,[...(groups.get(k)||[]),p.file]);});return [...groups].filter(([_,v])=>v.length>1).map(([value,files])=>({value,files}));};
const expected=inventory.map(t=>'https://caluler.work/'+t.url),duplicateLocs=locs.filter((l,i)=>locs.indexOf(l)!==i),missingInventory=expected.filter(u=>!locs.includes(u)),extraToolURLs=locs.filter(u=>new URL(u).pathname.startsWith('/tools/')&&!expected.includes(u));
return {created:new Date().toISOString(),inventoryCount:inventory.length,uniqueInventory:new Set(inventory.map(t=>t.url)).size,categories:[...new Set(inventory.map(t=>t.category))],publicFiles:[...publicFiles],pages,duplicates:{titles:duplicates('title'),descriptions:duplicates('description')},missingTargets,brokenResources,anchorWarnings,categoryLinks,sitemap:{count:locs.length,unique:new Set(locs).size,duplicateLocs,missingInventory,extraToolURLs,invalid:locs.filter(u=>{try{return new URL(u).origin!=='https://caluler.work'||new URL(u).search||new URL(u).hash||!exists(local(new URL(u)));}catch{return true;}})},robots:fs.readFileSync('robots.txt','utf8')};
}

const titles={
 'tools/compound-interest-calculator.html':'Compound Interest & Time Value Calculator | Caluler',
 'tools/business-valuation-calculator.html':'Business Valuation Calculator: EBITDA & Revenue | Caluler',
 'tools/discount-calculator.html':'Discount & Sale Price Calculator | Caluler',
 'tools/retirement-planner-calculator.html':'Retirement Planner: Savings & Income | Caluler',
 'tools/credit-utilization-calculator.html':'Credit Utilization Calculator | Caluler',
 'tools/npv-irr-calculator.html':'NPV & IRR Calculator: Project Cash Flows | Caluler'
};
const descriptions={
 'tools/median-calculator.html':'Find the median of a comma-separated list of numbers. View the sorted values and the middle value, or the average of the two middle values.',
 'tools/prime-number-checker.html':'Check whether an integer is prime with the Caluler Prime Number Checker. Review the prime-number definition and an example.',
 'tools/length-converter.html':'Convert meters, kilometers, centimeters and millimeters to inches, feet, yards or miles. Choose any supported pair of metric and imperial length units.',
 'tools/area-converter.html':'Convert area between square meters, square kilometers, square centimeters, square feet, square yards, acres and hectares with Caluler.',
 'tools/weight-converter.html':'Convert weight between kilograms, grams, milligrams, pounds, ounces and metric tons. Select your starting and target units to compare values.',
 'tools/cgpa-calculator.html':'Calculate an updated CGPA using your current CGPA, completed credits, semester GPA and semester credits with a credit-weighted average.',
 'tools/time-calculator.html':'Calculate the difference between a start time and an end time. Use the Caluler Time Calculator to compare two clock times and their elapsed duration.',
 'tools/electric-charge-calculator.html':'Calculate electric charge in coulombs from current in amperes and time in seconds using Q = I × t. View the charge-transfer diagram and result.'
};
const encode=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const json=s=>JSON.stringify(s).replaceAll('<','\\u003c');
function plan(report){return report.pages.flatMap(p=>{
 const original=fs.readFileSync(p.file,'utf8'),match=original.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);assert(match,'Head absent: '+p.file);let head=match[1],reasons=[];
 const title=titles[p.file]||p.title[0],description=descriptions[p.file]||p.description[0];
 if(title!==p.title[0]){head=head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i,'<title>'+encode(title)+'</title>');reasons.push('concise descriptive title');}
 if(description!==p.description[0])reasons.push('specific description');
 if(p.file==='disclaimer.html'&&p.meta.some(n=>n.property==='og:description'&&/calculator with/i.test(n.content)))reasons.push('remove inaccurate calculator wording from legal social metadata');
 if(title!==p.title[0]||description!==p.description[0]||reasons.includes('remove inaccurate calculator wording from legal social metadata'))head=head.replace(/<meta\b[^>]*>/gi,tag=>{const a=attrs(tag),key=(a.name||a.property||'').toLowerCase(),value=['description','og:description','twitter:description'].includes(key)?description:['og:title','twitter:title'].includes(key)?title:null;return value===null?tag:tag.replace(/\bcontent\s*=\s*(?:"[^"]*"|'[^']*')/i,'content="'+encode(value)+'"');});
 if(p.file==='index.html'){
  let changed=false;head=head.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(all,at,body)=>{if(attrs(at).type!=='application/ld+json')return all;const schema=JSON.parse(body);if(schema['@type']!=='WebSite')return all;const previous=JSON.stringify(schema);schema['@id']='https://caluler.work/#website';schema.inLanguage='en';schema.publisher={...(schema.publisher||{}),'@type':'Organization','@id':'https://caluler.work/#organization',name:'Caluler',url:'https://caluler.work/',logo:{'@type':'ImageObject',url:'https://caluler.work/assets/caluler-logo.webp'}};if(JSON.stringify(schema)===previous)return all;changed=true;return '<script'+at+'>'+json(schema)+'</script>';});if(changed)reasons.push('enriched existing WebSite/Organization identity');
 }else if(!p.schemaTypes.includes('WebPage')){
  const type=p.file==='tools.html'?['WebPage','CollectionPage']:p.file==='about.html'?['WebPage','AboutPage']:p.file==='contact.html'?['WebPage','ContactPage']:'WebPage';
  const schema={'@context':'https://schema.org','@type':type,'@id':p.url+'#webpage',url:p.url,name:title,description,inLanguage:'en',isPartOf:{'@id':'https://caluler.work/#website'}};
  head+='\n<script type="application/ld+json" id="caluler-page-seo">'+json(schema)+'</script>\n';reasons.push('missing static WebPage JSON-LD');
 }
 const after=original.slice(0,match.index)+match[0].replace(match[1],()=>head)+original.slice(match.index+match[0].length);
 return after===original?[]:[{file:p.file,before:p.sha256,after:hash(Buffer.from(after)),reasons,content:after}];
});}
function writeReport(report,suffix){
 fs.writeFileSync(path.join(run,'audit-'+suffix+'.json'),JSON.stringify(report,null,2));
 const escape=s=>'"'+String(s??'').replaceAll('"','""')+'"';
 const columns=['file','primary_keyword','title','description','H1','canonical','WebPage_schema','related_links','issues','warnings'];
 const rows=report.pages.map(p=>[p.file,p.inventory?.title||p.h1[0],p.title[0],p.description[0],p.h1[0],p.canonical[0],p.schemaTypes.includes('WebPage'),p.relatedToolLinks,p.issues.join('; '),p.warnings.join('; ')]);
 fs.writeFileSync(path.join(run,'coverage-'+suffix+'.csv'),[columns,...rows].map(r=>r.map(escape).join(',')).join('\r\n'));
}
const before=audit();writeReport(before,'before');const changes=plan(before);
fs.writeFileSync(path.join(run,'planned-changes.json'),JSON.stringify(changes.map(({content,...p})=>p),null,2));
if(args.includes('--apply')&&changes.length){
 const backupDir=path.join(run,'backups');fs.mkdirSync(backupDir,{recursive:true});const backups=[];
 // Prepare all backups before the first HTML write; reject changed sources.
 for(const c of changes){assert.equal(hash(fs.readFileSync(c.file)),c.before,'Source changed: '+c.file);const backup=path.join(backupDir,c.file.replaceAll('/','__')+'.before');fs.copyFileSync(c.file,backup,fs.constants.COPYFILE_EXCL);assert.equal(hash(fs.readFileSync(backup)),c.before);backups.push({file:c.file,backup,sha256:c.before});}
 fs.writeFileSync(path.join(run,'backups.json'),JSON.stringify(backups,null,2),{flag:'wx'});
 for(const c of changes){assert.equal(hash(fs.readFileSync(c.file)),c.before,'Source changed before write: '+c.file);fs.writeFileSync(c.file,c.content);}
}
const after=args.includes('--apply')?audit():before;writeReport(after,'after');
const errors=[...after.pages.flatMap(p=>p.issues.map(issue=>({file:p.file,issue}))),...after.pages.filter(p=>p.file!=='index.html'&&!p.schemaTypes.includes('WebPage')).map(p=>({file:p.file,issue:'WebPage JSON-LD missing'})),...after.duplicates.titles,...after.duplicates.descriptions,...after.missingTargets,...after.brokenResources,...after.sitemap.invalid,...after.sitemap.duplicateLocs,...after.sitemap.missingInventory,...after.sitemap.extraToolURLs];
if(after.inventoryCount!==after.uniqueInventory)errors.push({issue:'Duplicate inventory registration'});
const summary={inventory:after.inventoryCount,uniqueInventory:after.uniqueInventory,toolCoverage:after.pages.filter(p=>p.tool).length,publicPages:after.publicFiles.length,pages:after.pages.length,applied:args.includes('--apply'),changedFiles:args.includes('--apply')?changes.length:0,proposedFiles:changes.length,duplicateTitles:after.duplicates.titles.length,duplicateDescriptions:after.duplicates.descriptions.length,WebPageSchemas:after.pages.filter(p=>p.schemaTypes.includes('WebPage')).length,invalidJSON:after.pages.filter(p=>p.jsonErrors.length).length,sitemap:after.sitemap,brokenInternalLinks:after.missingTargets.length,missingLocalResources:after.brokenResources.length,errors:errors.length,remainingWarnings:after.pages.filter(p=>p.warnings.length).map(p=>({file:p.file,warnings:p.warnings})),notTested:['Real browser rendering and navigation','Live HTTP headers, redirects, crawl/indexing and deployment','Search-engine rich-result eligibility'],reportDirectory:run};
fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,remainingWarnings:summary.remainingWarnings.length},null,2));
if(args.includes('--check')&&errors.length)process.exitCode=1;
