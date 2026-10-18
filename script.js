'use strict';
const PHONE = '923488007387';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const whatsapp = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
function openWhatsApp(message) { const a=document.createElement('a');a.href=whatsapp(message);a.target='_blank';a.rel='noopener noreferrer'; document.body.append(a);a.click();a.remove(); }

const menuToggle=$('#menuToggle'), nav=$('#primaryNav');
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open?'true':'false');menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
$$('.primary-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));
const navLinks=$$('.nav-link');
const observer=new IntersectionObserver(entries=>{const hits=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(!hits.length)return;navLinks.forEach(n=>n.classList.toggle('active',n.getAttribute('href')==='#'+hits[0].target.id));},{rootMargin:'-22% 0px -64% 0px',threshold:[0,.15,.3]});
$$('main section[id]').forEach(s=>observer.observe(s));
$('#year').textContent=new Date().getFullYear();

let currentMode='buy', categoryFilter='all', searchType='all', searchLocation='', searchQuery='';
const searchBtn=$('.search-submit');
const searchTypes=$('#searchType');
$$('.search-tab').forEach(tab=>tab.addEventListener('click',()=>{
 currentMode=tab.dataset.mode;
 $$('.search-tab').forEach(t=>{t.classList.toggle('is-selected',t===tab);t.setAttribute('aria-selected',t===tab?'true':'false');});
 if(currentMode==='build'){
  searchBtn.innerHTML='Discuss Construction <span>↗</span>';
  searchTypes.innerHTML='<option value="all">All project types</option><option value="residential">Residential construction</option><option value="commercial">Commercial construction</option><option value="renovation">Renovation & finishing</option>';
  $('#searchQuery').placeholder='e.g. 10 Marla house construction';
 } else {
  searchBtn.innerHTML='<span class="search-icon">⌕</span> Find My Property <span>↗</span>';
  searchTypes.innerHTML='<option value="all">All property types</option><option value="plots">Residential Plots</option><option value="houses">Houses & Villas</option><option value="apartments">Apartments & Flats</option><option value="commercial">Commercial Spaces</option><option value="farmhouses">Farmhouses</option><option value="rentals">Rental Properties</option>';
  $('#searchQuery').placeholder='e.g. 10 Marla, 2-bed flat';
 }
}));
function applyFilter(){
 let count=0;
 $$('.property-card').forEach(c=>{
  const status=categoryFilter==='all'||c.dataset.kind.split(' ').includes(categoryFilter);
  const type=searchType==='all'||c.dataset.type===searchType;
  const visible=status&&type;c.hidden=!visible;if(visible)count++;
 });
 $('#resultsNote').textContent=`${count} property ${count===1?'category':'categories'}`;
 $('#noResults').hidden=count>0;
}
$$('[data-property-filter]').forEach(b=>b.addEventListener('click',()=>{
 categoryFilter=b.dataset.propertyFilter;
 $$('[data-property-filter]').forEach(x=>x.classList.toggle('selected',x===b));
 applyFilter();
}));
function resetSearch(){searchType='all';searchLocation='';searchQuery='';categoryFilter='all';$('#searchType').value='all';$('#searchLocation').value='';$('#searchQuery').value='';$('#searchSummary').hidden=true;$$('[data-property-filter]').forEach(x=>x.classList.toggle('selected',x.dataset.propertyFilter==='all'));applyFilter();}
$('#clearSearch').addEventListener('click',resetSearch);
function focusContactForConstruction(loc,req,kind='Residential construction'){
 const form=$('#contactForm');
 form.elements.interest.value=kind;
 if(loc)form.elements.location.value=loc;
 if(req)form.elements.message.value=req;
 $('#contact').scrollIntoView({behavior:'smooth'});
 window.setTimeout(()=>form.elements.name.focus({preventScroll:true}),550);
}
$('#searchForm').addEventListener('submit',e=>{
 e.preventDefault();searchLocation=$('#searchLocation').value.trim();searchQuery=$('#searchQuery').value.trim();searchType=$('#searchType').value;
 if(currentMode==='build'){
  const kind=searchType==='commercial'?'Commercial construction':searchType==='renovation'?'Renovation / finishing':'Residential construction';
  focusContactForConstruction(searchLocation,searchQuery,kind);return;
 }
 categoryFilter=currentMode;
 $$('[data-property-filter]').forEach(x=>x.classList.toggle('selected',x.dataset.propertyFilter===categoryFilter));
 applyFilter();
 const terms=[currentMode==='buy'?'purchase':'rental',searchLocation||'Islamabad / Rawalpindi',searchType==='all'?'all property types':$('#searchType').selectedOptions[0].text,searchQuery].filter(Boolean);
 $('#summaryText').textContent=`YOUR REQUEST: ${terms.join(' • ')}`;
 $('#searchSummary').hidden=false;
 $('#properties').scrollIntoView({behavior:'smooth'});
});
$$('[data-area]').forEach(btn=>btn.addEventListener('click',()=>{
 const loc=btn.dataset.area;currentMode='buy';$$('.search-tab').find(x=>x.dataset.mode==='buy')?.click();
 const select=$('#searchLocation');
 if(![...select.options].some(opt=>opt.value===loc)){const opt=new Option(loc,loc);select.add(opt);}
 select.value=loc;
 $('#searchForm').requestSubmit();
}));

$$('[data-enquire]').forEach(btn=>btn.addEventListener('click',()=>{
 const what=btn.dataset.enquire;
 const loc=searchLocation||'Islamabad / Rawalpindi';
 openWhatsApp(`Hello Al Emarat, I would like to enquire about ${what}.\nPurpose: ${categoryFilter==='rent'?'Rent':'Purchase / availability'}\nPreferred location: ${loc}\n${searchQuery?`Requirement: ${searchQuery}\n`:''}Please share verified available options, details and pricing.`);
}));
$('#askCustom').addEventListener('click',()=>openWhatsApp(`Hello Al Emarat, I'm looking for ${searchQuery||searchType} in ${searchLocation||'Islamabad / Rawalpindi'}. Please contact me about availability.`));

const detailData={
 villa:{title:'Houses & Villas',img:'villa-exterior.webp',desc:'Tell us your preferred neighbourhood, home size, budget and must-have features. We can discuss what to look for when choosing your next house or villa.',features:['Family homes','Modern residences','Citywide enquiries','Details on request']},
 plots:{title:'Residential Plots',img:'estate-garden.webp',desc:'Looking for a residential plot? Share your preferred area, desired size and budget so we can discuss current plots and the relevant documentation.',features:['5 & 10 Marla enquiries','Kanal-size plots','Residential land','Details on request']},
 apartments:{title:'Apartments & Flats',img:'living-room.webp',desc:'Explore urban living through an apartment enquiry. Tell us whether you need a studio or family apartment, and where you would like to live.',features:['Studios & apartments','Buying enquiries','Rental enquiries','Details on request']},
 commercial:{title:'Commercial Spaces',img:'city-boulevard.webp',desc:'Discuss requirements for a shop, office or commercial plot in Islamabad and Rawalpindi. We can help you identify the questions to ask before moving forward.',features:['Shops & retail','Offices','Commercial land','Details on request']},
 farmhouses:{title:'Farmhouses',img:'estate-driveway.webp',desc:'Looking for more privacy, green space or a larger estate? Start with your preferred area, land size and intended use.',features:['Large plots','Farmhouse properties','Residential use','Details on request']},
 rentals:{title:'Rental Properties',img:'grand-hall.webp',desc:'Let us know the location, approximate monthly budget, preferred type and move-in schedule for your rental enquiry.',features:['Apartments','Houses & portions','Commercial rental','Details on request']}
};
const detailDialog=$('#detailDialog'),detailBody=$('#detailBody');
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>{
 const d=detailData[b.dataset.view];
 detailBody.replaceChildren();
 const box=document.createElement('div');box.className='detail-inner';
 const img=document.createElement('img');img.src='assets/'+d.img;img.alt=d.title+' illustrative photograph';box.append(img);
 const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent='PROPERTY ENQUIRY';box.append(eyebrow);
 const h=document.createElement('h2');h.textContent=d.title;box.append(h);
 const p=document.createElement('p');p.textContent=d.desc;box.append(p);
 const features=document.createElement('div');features.className='detail-feature-list';d.features.forEach(f=>{const s=document.createElement('span');s.textContent='✳ '+f;features.append(s);});box.append(features);
 const note=document.createElement('p');note.className='detail-disclaimer';note.textContent='Photographs are reference media, not verified listings. Pricing and availability are not published without confirmation.';box.append(note);
 const btn=document.createElement('button');btn.className='btn btn-dark';btn.textContent='Ask About '+d.title+' ↗';btn.addEventListener('click',()=>openWhatsApp(`Hello Al Emarat, please tell me about available ${d.title} in ${searchLocation||'Islamabad / Rawalpindi'}.`));box.append(btn);
 detailBody.append(box);detailDialog.showModal();
}));

const mediaDialog=$('#mediaDialog'),dialogBody=$('#dialogBody');
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{
 dialogBody.replaceChildren();
 const el=document.createElement(b.dataset.gallery==='video'?'video':'img');
 el.src=b.dataset.src;
 if(b.dataset.gallery==='video'){el.controls=true;el.autoplay=true;el.playsInline=true;el.preload='metadata';if(b.dataset.poster)el.poster=b.dataset.poster;}
 else el.alt=b.dataset.title;
 dialogBody.append(el);$('#dialogTitle').textContent=b.dataset.title;mediaDialog.showModal();
}));
mediaDialog.addEventListener('close',()=>{const v=$('video',dialogBody);if(v){v.pause();v.removeAttribute('src');v.load();}dialogBody.replaceChildren();});
[detailDialog,mediaDialog,$('#sellerDialog')].forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();}));

$('#constructionQuote').addEventListener('click',()=>focusContactForConstruction('','I would like to request a construction quotation.'));
$('#contactForm').addEventListener('submit',e=>{
 e.preventDefault();const fd=new FormData(e.currentTarget); const get=k=>String(fd.get(k)||'').trim();
 const message=`Hello Al Emarat Builder and Developer,\n\nName: ${get('name')}\nPhone: ${get('phone')}\nInterest: ${get('interest')}\nPreferred location: ${get('location')||'Not specified'}\n\nRequirement: ${get('message')}\n\nPlease contact me about this enquiry.`;
 openWhatsApp(message);
});
$('#listPropertyButton').addEventListener('click',()=>$('#sellerDialog').showModal());
$('#sellerForm').addEventListener('submit',e=>{
 e.preventDefault();const fd=new FormData(e.currentTarget),val=k=>String(fd.get(k)||'').trim();
 openWhatsApp(`Hello Al Emarat, I want to ${val('sellerPurpose').toLowerCase()} my property.\nName: ${val('sellerName')}\nLocation: ${val('sellerLocation')}\nProperty type: ${val('sellerType')}\nDetails: ${val('sellerNotes')}\nPlease tell me the next steps. I can share photos here.`);
});
