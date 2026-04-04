import { useEffect, useRef, useState } from 'react';

const PLANS = [
  {id:'1250010',name:'Mississippi 0',abbr:'MS0'},{id:'1250011',name:'Mississippi 1',abbr:'MS1'},
  {id:'1250012',name:'Mississippi 2',abbr:'MS2'},{id:'1250021',name:'Southaven 1',abbr:'SH1'},
  {id:'1350010',name:'Louisiana 0',abbr:'LA0'},{id:'1350011',name:'Louisiana 1',abbr:'LA1'},
  {id:'1350012',name:'Louisiana 2',abbr:'LA2'},{id:'1350022',name:'N. Dakota 2',abbr:'ND2'},
  {id:'1350032',name:'Monore',abbr:'MR'},{id:'1363012',name:'Connecticut 2',abbr:'CT2'},
  {id:'1400011',name:'Georgia 1',abbr:'GA1'},{id:'1400012',name:'Georgia 2',abbr:'GA2'},
  {id:'1400022',name:'Iowa 2',abbr:'IA2'},{id:'1400032',name:'Rhode Island 2',abbr:'RI2'},
  {id:'1400042',name:'Atlanta 2',abbr:'AT2'},{id:'140022M',name:'Iowa 2 Modified',abbr:'IA2M'},
  {id:'1450012',name:'Dakota 2',abbr:'DK2'},{id:'1455012',name:'Connecticut 2',abbr:'CT'},
  {id:'1455022',name:'New York 2',abbr:'NY 2'},{id:'1470012',name:'Hawaii 2',abbr:'HI'},
  {id:'1500012',name:'Massachusetts',abbr:'MA2'},{id:'1511012',name:'Glendale TH R - MOD 2 STORY',abbr:'TH-R MOD'},
  {id:'151112M',name:'GLENDALE TH M - MOD 2 STORY',abbr:'TH-M MOD'},{id:'1550012',name:'Missouri 2',abbr:'MU2'},
  {id:'1550022',name:'S. Carolina 2',abbr:'SC2'},{id:'1556',name:'BP Townhome Front Entry M',abbr:'M'},
  {id:'1556LRA',name:'Townhome Left End',abbr:'LRA'},{id:'1556RLA',name:'1556 Townhome Right End',abbr:'RLA'},
  {id:'1573',name:'BP Townhome Front Entry',abbr:'M'},{id:'157512L',name:'BP Townhomes Left End 2',abbr:'BP TH-L2'},
  {id:'157512M',name:'BP Townhome Middle Unit',abbr:'BP TH-M'},{id:'157512R',name:'BP Townhome Right End 2',abbr:'BP TH-R2'},
  {id:'1576',name:'BP Townhome Right Entry',abbr:'R'},{id:'1576LRA',name:'BP Townhome Left Entry',abbr:'LRA'},
  {id:'158512L',name:'BP Townhome Left End2 2',abbr:'BP TH-L22'},{id:'158512R',name:'BP Townhome Right End2 2',abbr:'BP TH-R22'},
  {id:'1593012',name:'TH-Middle',abbr:'TH-M'},{id:'159312L',name:'BP Townhome Left End',abbr:'BP TH-L'},
  {id:'159312R',name:'BP Townhome Right End',abbr:'BP TH-R'},{id:'1599012',name:'TH-Right',abbr:'TH-R'},
  {id:'1600012',name:'Texas 2',abbr:'TX2'},{id:'1600022',name:'Wyoming 2',abbr:'WY2'},
  {id:'1600032',name:'New Mexico 2',abbr:'NM2'},{id:'1600042',name:'N. Carolina',abbr:'NC2'},
  {id:'1607012',name:'Townhome City/Town Name',abbr:'TH-L'},{id:'1650012',name:'Kansas 2',abbr:'KS2'},
  {id:'1650013',name:'Kansas C 3',abbr:'KSC3'},{id:'1650022',name:'Vermont 2',abbr:'VT2'},
  {id:'1650032',name:'Virginia',abbr:'VA2'},{id:'166912M',name:'Odessa Middle',abbr:'ODM'},
  {id:'167112L',name:'Odessa Left End 2',abbr:'ODL2'},{id:'167112M',name:'Odessa Middle 2',abbr:'ODM2'},
  {id:'167112R',name:'Odessa Right End',abbr:'ODR'},{id:'167212L',name:'Odessa Left End',abbr:'ODL'},
  {id:'1675012',name:'Ohio 2',abbr:'OH2'},{id:'167512M',name:'Ohio 2 Modified',abbr:'OH2M'},
  {id:'1698012',name:'Glendale TH L - MOD 2 STORY',abbr:'TH-L MOD'},{id:'1700012',name:'New Jersey 2',abbr:'NJ2'},
  {id:'1700022',name:'W. Virginia 2',abbr:'WV2'},{id:'1700032',name:'Charleston 2',abbr:'CH 2'},
  {id:'1725012',name:'Kentucky 2',abbr:'KY2'},{id:'1750012',name:'Minnesota 2',abbr:'MN2'},
  {id:'1750022',name:'Maine',abbr:'ME'},{id:'1800012',name:'Florida 2',abbr:'FL2'},
  {id:'1850012',name:'Maryland 2',abbr:'MD2'},{id:'1850022',name:'New York City 2',abbr:'NYC2'},
  {id:'1850032',name:'Nevada City 2',abbr:'NVC'},{id:'1875012',name:'Utah 2',abbr:'UT2'},
  {id:'1875013',name:'Utah 3',abbr:'UT3'},{id:'187512M',name:'Utah 2 Modified',abbr:'UT2M'},
  {id:'1900012',name:'S.Dakota 2',abbr:'SD2'},{id:'1900022',name:'Kansas 19',abbr:'KS192'},
  {id:'1912012',name:'Washington 2',abbr:'WA2'},{id:'1945012',name:'Oklahoma City 2',abbr:'OKC2'},
  {id:'1950012',name:'Indiana 2',abbr:'IN2'},{id:'2000012',name:'Nevada 2',abbr:'NV2'},
  {id:'2000022',name:'Idaho 2',abbr:'ID2'},{id:'200012M',name:'Nevada 2 Modified',abbr:'NV2M'},
  {id:'2050012',name:'Delaware 2',abbr:'DE 2'},{id:'2100012',name:'Wisconsin 2',abbr:'WI2'},
  {id:'2100022',name:'Nebraska 2',abbr:'NE2'},{id:'2100023',name:'Nebraska 3',abbr:'NE3'},
  {id:'2100032',name:'Arkansas 2',abbr:'AR2'},{id:'2100033',name:'Arkansas 3',abbr:'AR3'},
  {id:'210032M',name:'Arkansas 2 Modified',abbr:'AR2M'},{id:'2150012',name:'ILLINOIS 2',abbr:'IL 2'},
  {id:'2169012',name:'Oregon 2',abbr:'OR2'},{id:'2200012',name:'Tennessee 2',abbr:'TN2'},
  {id:'2300012',name:'Michigan 2',abbr:'MI2'},{id:'2400012',name:'California 2',abbr:'CA2'},
  {id:'2400022',name:'New Hampshire 2',abbr:'NH2'},{id:'2400023',name:'New Hampshire 3',abbr:'NH3'},
  {id:'2500012',name:'Oklahoma 2',abbr:'OK2'},{id:'2500013',name:'Oklahoma 3',abbr:'OK3'},
  {id:'2700012',name:'Alabama 2',abbr:'AL2'},{id:'2800012',name:'Arizona 2',abbr:'AZ2'},
  {id:'2850012',name:'Pennsylvania 2',abbr:'PA2'},{id:'2900012',name:'Colorado 2',abbr:'CO2'},
  {id:'2995012',name:'Alaska 1',abbr:'AK1'},{id:'3000102',name:'Montana 1',abbr:'MT1'},
  {id:'4743001',name:'Glendale Duplex',abbr:'GD'},{id:'5904003',name:'5904 NE',abbr:'5904NE'},
  {id:'9980001',name:'Unused Active plan',abbr:'UAP'},{id:'9990001',name:'Expired Plan',abbr:'EP'},
  {id:'9990002',name:'Noahs Vendors',abbr:'NV'},
];

const ITEMS = [
  {num:'12.2310',code:'106S-BRI',desc:'2" STEEL LOCKNUT',uom:'C',cat:'Electrical'},
  {num:'12.2311',code:'114DSJ-PEC',desc:'6 X 1-1/4 BUGLE PHIL COARSE D/S BLACK',uom:'C',cat:'Electrical'},
  {num:'12.2312',code:'1525DC-BRI',desc:'2" DIECAST OFFSET NIPPLE',uom:'C',cat:'Electrical'},
  {num:'12.2313',code:'158DSJ-PEC',desc:'6 X 1-5/8 BUGLE PHIL COARSE D/S BLACK',uom:'C',cat:'Electrical'},
  {num:'12.2314',code:'1597TRW-PAS',desc:'15A 125V GFCI RCPT',uom:'Ea',cat:'Electrical'},
  {num:'12.2315',code:'1597TRWRW-PAS',desc:'15A TRWR 125V GFCI RCPT WHT',uom:'Ea',cat:'Electrical'},
  {num:'12.2316',code:'1597W-PAS',desc:'15A 125V GFCI RCPT',uom:'Ea',cat:'Electrical'},
  {num:'12.2317',code:'17132-TAB',desc:'9/16" STAPLE',uom:'C',cat:'Electrical'},
  {num:'12.2318',code:'30092-IDE',desc:'GREENIE GROUNDING WIRE CONN',uom:'M',cat:'Electrical'},
  {num:'12.2319',code:'30341-IDE',desc:'TWISTER WIRE CONN MODEL 341 TAN',uom:'M',cat:'Electrical'},
  {num:'12.2320',code:'30452-IDE',desc:'WING-NUT WIRE CONN MODEL 452 RED',uom:'M',cat:'Electrical'},
  {num:'12.2321',code:'3232TRW-PAS',desc:'15A 125V TAMPER RES DUP REC',uom:'C',cat:'Electrical'},
  {num:'12.2322',code:'3232TRWRW-PAS',desc:'TR WR DUP REC 15A/125V W',uom:'C',cat:'Electrical'},
  {num:'12.2323',code:'326-BRI',desc:'2" PLASTIC BUSHING',uom:'C',cat:'Electrical'},
  {num:'12.2324',code:'3864-PAS',desc:'30A 4WI FLUSH DRYER RECP',uom:'C',cat:'Electrical'},
  {num:'12.2325',code:'3894-PAS',desc:'50A 4WI FLUSH RANGE RECP',uom:'C',cat:'Electrical'},
  {num:'12.2326',code:'407DC2-BRI',desc:'1/2" FLEX STRAIGHT DIECAST SQUEEZE CONNECTOR',uom:'C',cat:'Electrical'},
  {num:'12.2327',code:'410DC2-BRI',desc:'1" FLEX STRAIGHT DIECAST SQUEEZE CONNECTOR',uom:'C',cat:'Electrical'},
  {num:'12.2328',code:'55094801-ALF',desc:"2\" NM L/T 50' COIL",uom:'C',cat:'Electrical'},
  {num:'12.2329',code:'553020507-COP',desc:'18/2 THERMOSTAT/BELL WIRE',uom:'M',cat:'Electrical'},
  {num:'12.2330',code:'56111CFB-TAB',desc:'4X1/2D RND CFB W/NMCONN19',uom:'C',cat:'Electrical'},
  {num:'12.2331',code:'615880-CDW',desc:"5/8\"X8' CU GROUND ROD",uom:'C',cat:'Electrical'},
  {num:'12.2332',code:'660WG-PAS',desc:'SP 15A TOG SWITCH',uom:'C',cat:'Electrical'},
  {num:'12.2333',code:'663WG-PAS',desc:'3W 15A TOG SWITCH',uom:'C',cat:'Electrical'},
  {num:'12.2334',code:'670DC2-BRI',desc:'3/4" NMB CONNECTOR 2 SCREW STRAP TYPE',uom:'C',cat:'Electrical'},
  {num:'12.2335',code:'676DC2-BRI',desc:'2" ROMEX CONNECTOR 2 SCREW STRAP TYPE',uom:'C',cat:'Electrical'},
  {num:'12.2336',code:'688-BRO',desc:'50CFM BATHROOM FAN',uom:'Ea',cat:'Electrical'},
  {num:'12.2337',code:'70PS-ETL',desc:'6" TRIM WET LOCATION WHITE',uom:'Ea',cat:'Electrical'},
  {num:'12.2338',code:'732SP-BRI',desc:'2.5" SAFETY PLATE STEEL',uom:'C',cat:'Electrical'},
  {num:'12.2339',code:'832X2RHCMSZJ-PEC',desc:'8-32 X 2 ROUND HEAD M/S ZINC',uom:'C',cat:'Electrical'},
  {num:'12.2340',code:'9120B-BRK',desc:'120V SMOKE DETECTOR W SILENCE',uom:'Ea',cat:'Electrical'},
  {num:'12.2341',code:'AFD115-ETN',desc:'ARC FAULT INTERRUPTER BREAKER 15A',uom:'Ea',cat:'Electrical'},
  {num:'12.2342',code:'AFD120-ETN',desc:'ARC FAULT INTERRUPTER BREAKER 20A',uom:'Ea',cat:'Electrical'},
  {num:'12.2343',code:'ALF12PCS-ALF',desc:'1/2" ALU FLEXIBLE CONDUIT PCS',uom:'C',cat:'Electrical'},
  {num:'12.2344',code:'ALF1PCS-ALF',desc:'1" ALU FLEXIBLE CONDUIT PCS',uom:'C',cat:'Electrical'},
  {num:'12.2345',code:'BARE4S0LPCS-COP',desc:'#4 SOL BARE COPPER PCS',uom:'C',cat:'Electrical'},
  {num:'12.2346',code:'BPT11-WES',desc:'PUSH IN WIRE CONN BLUE 12-22 AWG',uom:'C',cat:'Electrical'},
  {num:'12.2347',code:'BPT22-WES',desc:'PUSH IN WIRE CONN ORANGE 12-22 AWG',uom:'C',cat:'Electrical'},
  {num:'12.2348',code:'BR120-ETN',desc:'TYPE BR BRKR 20A/1 POLE 120/240V 10K',uom:'Ea',cat:'Electrical'},
  {num:'12.2349',code:'BR220-ETN',desc:'TYPE BR BRKR 20A/2 POLE 120/240V 10K',uom:'Ea',cat:'Electrical'},
  {num:'12.2350',code:'BR230-ETN',desc:'TYPE BR BRKR 30A/2 POLE 120/240V 10K',uom:'Ea',cat:'Electrical'},
];

const TAKEOFF = [
  {cc:'12-100',planId:'1600012',item:'12.2318',qty:3,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1600012',item:'12.2332',qty:24,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1600012',item:'12.2314',qty:8,proj:'BH-2024',note:'GFCI required'},
  {cc:'12-100',planId:'1600012',item:'12.2348',qty:12,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1600012',item:'12.2341',qty:4,proj:'BH-2024',note:'AFCI bedrooms'},
  {cc:'12-100',planId:'1800012',item:'12.2318',qty:3,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1800012',item:'12.2332',qty:26,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1800012',item:'12.2314',qty:8,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1800012',item:'12.2341',qty:4,proj:'BH-2024',note:'AFCI'},
  {cc:'12-100',planId:'2100012',item:'12.2318',qty:3,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2100012',item:'12.2336',qty:3,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2100012',item:'12.2332',qty:22,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2400012',item:'12.2332',qty:28,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2400012',item:'12.2314',qty:9,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2400012',item:'12.2341',qty:5,proj:'BH-2024',note:'AFCI'},
  {cc:'12-100',planId:'2400012',item:'12.2348',qty:14,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1875012',item:'12.2318',qty:4,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1875012',item:'12.2332',qty:20,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'1875012',item:'12.2314',qty:7,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2900012',item:'12.2332',qty:30,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2900012',item:'12.2314',qty:10,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2900012',item:'12.2348',qty:16,proj:'BH-2024',note:''},
  {cc:'12-100',planId:'2900012',item:'12.2341',qty:6,proj:'BH-2024',note:'AFCI'},
  {cc:'12-200',planId:'1600012',item:'12.2336',qty:2,proj:'BH-2024',note:'Master bath'},
  {cc:'12-200',planId:'1800012',item:'12.2336',qty:2,proj:'BH-2024',note:''},
  {cc:'12-200',planId:'2400012',item:'12.2342',qty:4,proj:'BH-2024',note:''},
  {cc:'12-200',planId:'2900012',item:'12.2336',qty:3,proj:'BH-2024',note:'Master bath'},
];

function match(val, f) {
  if (!f) return true;
  const v = String(val).toLowerCase(), fl = f.toLowerCase().trim();
  if (!fl) return true;
  if (fl.includes('*')) {
    try { return new RegExp(fl.replace(/\*/g, '.*')).test(v); } catch(e) { return v.includes(fl.replace(/\*/g, '')); }
  }
  return v.includes(fl);
}

function isTH(p) {
  return p.name.toLowerCase().includes('townhome') || p.name.toLowerCase().includes('th-') || p.name.toLowerCase().includes('odessa');
}

function UomBadge({ uom }) {
  const styles = { C:'#3C3489,#F5F3FF', Ea:'#374151,#F3F4F6', M:'#633806,#FEF3C7' }[uom] || '374151,#F3F4F6';
  const [color, bg] = styles.split(',');
  return <span style={{display:'inline-flex',padding:'2px 6px',borderRadius:4,fontSize:10,fontWeight:600,background:bg,color,whiteSpace:'nowrap'}}>{uom}</span>;
}

function Badge({ label, type='default' }) {
  const types = {
    elec:   { color:'#1E40AF', bg:'#DBEAFE' },
    ok:     { color:'#065F46', bg:'#D1FAE5' },
    th:     { color:'#065F46', bg:'#D1FAE5' },
    default:{ color:'#374151', bg:'#F3F4F6' },
  };
  const { color, bg } = types[type] || types.default;
  return <span style={{display:'inline-flex',padding:'2px 6px',borderRadius:4,fontSize:10,fontWeight:600,background:bg,color,whiteSpace:'nowrap',marginLeft:4}}>{label}</span>;
}

export default function Mockup() {
  const [view, setView] = useState('items');
  const [sel, setSel] = useState(null);
  const [filters, setFilters] = useState({});
  const [role, setRole] = useState('builder');
  const [flyout, setFlyout] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const planById = id => PLANS.find(p => p.id === id);
  const itemByNum = n => ITEMS.find(i => i.num === n);
  const gf = c => filters[c] || '';

  function setFilter(col, val) {
    setFilters(prev => ({ ...prev, [col]: val }));
  }

  function goView(v) {
    setView(v); setSel(null); setFilters({}); setFlyout(null);
  }

  function selectItem(num) {
    setSel(num);
    const it = itemByNum(num);
    if (!it) return;
    const rows = TAKEOFF.filter(t => t.item === num);
    const plans = [...new Map(rows.map(t => [t.planId, planById(t.planId)]).filter(([, p]) => p)).values()];
    setFlyout({ type: 'item', it, rows, plans });
  }

  function selectPlan(planId) {
    setSel(planId);
    const p = planById(planId);
    if (!p) return;
    const rows = TAKEOFF.filter(t => t.planId === planId);
    setFlyout({ type: 'plan', p, rows });
  }

  function selectTakeoff(planId, itemNum) {
    setSel(planId + itemNum);
    const p = planById(planId), it = itemByNum(itemNum) || { desc: '—' };
    const t = TAKEOFF.find(r => r.planId === planId && r.item === itemNum) || {};
    setFlyout({ type: 'takeoff', p, it, t });
  }

  function jumpPlan(planId) {
    setView('plans'); setFilters({});
    const p = planById(planId);
    if (!p) return;
    setSel(planId);
    const rows = TAKEOFF.filter(t => t.planId === planId);
    setFlyout({ type: 'plan', p, rows });
  }

  function jumpItem(num) {
    setView('items'); setFilters({});
    const it = itemByNum(num);
    if (!it) return;
    setSel(num);
    const rows = TAKEOFF.filter(t => t.item === num);
    const plans = [...new Map(rows.map(t => [t.planId, planById(t.planId)]).filter(([, p]) => p)).values()];
    setFlyout({ type: 'item', it, rows, plans });
  }

  const filteredItems = ITEMS.filter(it =>
    match(it.num, gf('num')) && match(it.code, gf('code')) &&
    match(it.desc, gf('desc')) && (!gf('uom') || it.uom === gf('uom'))
  );

  const filteredPlans = PLANS.filter(p =>
    match(p.id, gf('id')) && match(p.name, gf('name')) && match(p.abbr, gf('abbr'))
  );

  const filteredTakeoff = TAKEOFF.filter(t => {
    const p = planById(t.planId) || {}, it = itemByNum(t.item) || {};
    return match(t.cc, gf('cc')) && match(`${p.id} ${p.name}`, gf('plan')) &&
      (match(t.item, gf('item')) || match(it.desc || '', gf('item')));
  });

  const navItems = [
    { id: 'items', label: 'Master item list', count: ITEMS.length, section: 'Data' },
    { id: 'plans', label: 'Plans', count: PLANS.length, section: 'Data' },
    { id: 'takeoff', label: 'Master takeoff', count: TAKEOFF.length, section: 'Data' },
    { id: 'pricing', label: 'Pricing pool', count: 1, section: 'Vendor' },
  ];

  const s = {
    shell: { display:'flex', flexDirection:'column', minHeight:'100vh', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif', background:'#F3F4F6' },
    inner: { display:'flex', flexDirection:'column', flex:1, maxWidth:1400, margin:'0 auto', width:'100%', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', background:'#fff', minHeight:'calc(100vh - 32px)', margin:'16px auto' },
    topbar: { display:'flex', alignItems:'center', gap:10, padding:'0 16px', height:50, borderBottom:'1px solid #E5E7EB', background:'#fff', flexShrink:0 },
    logo: { fontSize:14, fontWeight:700, color:'#111827', letterSpacing:'-.02em' },
    logoSpan: { color:'#185FA5' },
    btag: { fontSize:11, color:'#6B7280', padding:'3px 10px', background:'#F9FAFB', borderRadius:6, border:'1px solid #E5E7EB' },
    togwrap: { display:'flex', border:'1px solid #D1D5DB', borderRadius:6, overflow:'hidden', marginLeft:8 },
    togbtn: (on) => ({ padding:'5px 16px', fontSize:11, fontWeight:600, cursor:'pointer', border:'none', background: on ? '#111827' : 'transparent', color: on ? '#fff' : '#6B7280' }),
    fbBtn: { marginLeft:'auto', padding:'6px 14px', fontSize:12, fontWeight:600, color:'#185FA5', border:'1px solid #185FA5', borderRadius:6, background:'transparent', cursor:'pointer' },
    body: { display:'flex', flex:1, minHeight:0 },
    sidenav: { width:190, flexShrink:0, borderRight:'1px solid #E5E7EB', background:'#F9FAFB', padding:'10px 0' },
    navSec: { fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:'.06em', textTransform:'uppercase', padding:'4px 14px 6px' },
    navItem: (active) => ({ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', fontSize:12, fontWeight:600, color: active ? '#1E40AF' : '#6B7280', cursor:'pointer', borderLeft: active ? '2px solid #185FA5' : '2px solid transparent', background: active ? '#EFF6FF' : 'transparent' }),
    navCnt: { marginLeft:'auto', fontSize:10, background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'1px 6px', color:'#6B7280' },
    main: { flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' },
    mhdr: { padding:'12px 16px 0', flexShrink:0 },
    mtitle: { fontSize:14, fontWeight:700, color:'#111827', marginBottom:2 },
    msub: { fontSize:11, color:'#6B7280', marginBottom:10 },
    srow: { display:'flex', gap:8, marginBottom:10 },
    stat: { background:'#F9FAFB', borderRadius:8, padding:'6px 12px', fontSize:11, color:'#6B7280' },
    statNum: { fontSize:16, fontWeight:700, color:'#111827', display:'block' },
    twrap: { flex:1, overflowY:'auto', borderTop:'1px solid #E5E7EB' },
    hint: { fontSize:10, color:'#9CA3AF', padding:'5px 10px', fontStyle:'italic', background:'#FAFAFA', borderBottom:'1px solid #F3F4F6' },
    table: { width:'100%', borderCollapse:'collapse', fontSize:11, tableLayout:'fixed' },
    thead: { background:'#F9FAFB', position:'sticky', top:0, zIndex:2 },
    th: { padding:0, borderBottom:'1px solid #E5E7EB', textAlign:'left', verticalAlign:'top' },
    thi: { padding:'7px 10px 3px', fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.04em', whiteSpace:'nowrap' },
    thf: { padding:'0 7px 6px' },
    filterInput: { width:'100%', padding:'4px 7px', fontSize:10, border:'1px solid #D1D5DB', borderRadius:4, background:'#fff', color:'#111827', fontFamily:'inherit', outline:'none' },
    td: (selected) => ({ padding:'6px 10px', borderBottom:'1px solid #F3F4F6', color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', verticalAlign:'middle', background: selected ? '#EFF6FF' : 'transparent', cursor:'pointer' }),
    plink: { color:'#185FA5', fontWeight:600, cursor:'pointer', textDecoration:'none' },
    flyout: { width:280, flexShrink:0, borderLeft:'1px solid #E5E7EB', background:'#fff', display:'flex', flexDirection:'column' },
    fhdr: { padding:'12px 14px', borderBottom:'1px solid #E5E7EB', flexShrink:0 },
    ftitle: { fontSize:12, fontWeight:700, color:'#111827', marginBottom:2 },
    fsub: { fontSize:10, color:'#6B7280' },
    fbody: { flex:1, overflowY:'auto', padding:'10px 14px' },
    fsec: { fontSize:10, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'.05em', margin:'10px 0 6px' },
    frow: { display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #F3F4F6', gap:8 },
    flbl: { fontSize:11, color:'#6B7280', flexShrink:0 },
    fval: { fontSize:11, color:'#111827', fontWeight:600, textAlign:'right', wordBreak:'break-word' },
    chip: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 10px', border:'1px solid #E5E7EB', borderRadius:8, marginBottom:6, cursor:'pointer', background:'#fff' },
    cname: { fontSize:11, fontWeight:700, color:'#111827' },
    cmeta: { fontSize:10, color:'#6B7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:200 },
    empty: { display:'flex', alignItems:'center', justifyContent:'center', height:200, fontSize:11, color:'#9CA3AF', textAlign:'center', padding:20 },
    modalBg: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' },
    modal: { background:'#fff', borderRadius:12, padding:24, width:440, maxWidth:'90vw' },
  };

  function FilterInput({ col, placeholder, isSelect, opts }) {
    return (
      <div style={s.thf}>
        {isSelect ? (
          <select style={s.filterInput} value={gf(col)} onChange={e => setFilter(col, e.target.value)}>
            <option value="">All</option>
            {(opts||[]).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input type="text" style={s.filterInput} placeholder={placeholder} value={gf(col)}
            onChange={e => setFilter(col, e.target.value)} />
        )}
      </div>
    );
  }

  function FlyoutContent() {
    if (!flyout) return <div style={s.empty}>Select any row to see related records</div>;

    if (flyout.type === 'item') {
      const { it, rows, plans } = flyout;
      const totalQty = rows.reduce((s, t) => s + t.qty, 0);
      return (
        <>
          <div style={s.fsec}>Item details</div>
          <div style={s.frow}><span style={s.flbl}>Description</span><span style={{...s.fval,fontSize:10,whiteSpace:'normal',maxWidth:160,textAlign:'right'}}>{it.desc}</span></div>
          <div style={s.frow}><span style={s.flbl}>Category</span><span style={s.fval}>{it.cat}</span></div>
          <div style={s.frow}><span style={s.flbl}>UOM</span><span style={s.fval}>{it.uom}</span></div>
          <div style={s.frow}><span style={s.flbl}>Total qty on takeoffs</span><span style={s.fval}>{totalQty}</span></div>
          <div style={s.fsec}>On {plans.length} plan{plans.length !== 1 ? 's' : ''}</div>
          {plans.length === 0
            ? <div style={{fontSize:11,color:'#9CA3AF',padding:'4px 0'}}>Not yet on any takeoff</div>
            : plans.map(p => {
                const qty = rows.filter(t => t.planId === p.id).reduce((s, t) => s + t.qty, 0);
                return (
                  <div key={p.id} style={s.chip} onClick={() => jumpPlan(p.id)}>
                    <div><div style={s.cname}>{p.id}</div><div style={s.cmeta}>{p.name} · qty: {qty}</div></div>
                    <span style={{color:'#9CA3AF'}}>→</span>
                  </div>
                );
              })
          }
        </>
      );
    }

    if (flyout.type === 'plan') {
      const { p, rows } = flyout;
      return (
        <>
          <div style={s.fsec}>Plan details</div>
          <div style={s.frow}><span style={s.flbl}>Plan number</span><span style={s.fval}>{p.id}</span></div>
          <div style={s.frow}><span style={s.flbl}>Plan name</span><span style={s.fval}>{p.name}</span></div>
          <div style={s.frow}><span style={s.flbl}>Abbreviation</span><span style={s.fval}>{p.abbr}</span></div>
          <div style={s.frow}><span style={s.flbl}>Type</span><span style={s.fval}>{isTH(p) ? 'Townhome' : 'Single family'}</span></div>
          <div style={s.fsec}>{rows.length} takeoff line{rows.length !== 1 ? 's' : ''}</div>
          {rows.length === 0
            ? <div style={{fontSize:11,color:'#9CA3AF',padding:'4px 0'}}>No takeoff lines yet</div>
            : rows.map(t => {
                const it = itemByNum(t.item) || { desc: 'Unknown', num: t.item };
                return (
                  <div key={t.item} style={s.chip} onClick={() => jumpItem(t.item)}>
                    <div><div style={s.cname}>{it.num}</div><div style={s.cmeta}>{it.desc} · qty: {t.qty}</div></div>
                    <span style={{color:'#9CA3AF'}}>→</span>
                  </div>
                );
              })
          }
        </>
      );
    }

    if (flyout.type === 'takeoff') {
      const { p, it, t } = flyout;
      return (
        <>
          <div style={s.fsec}>Line details</div>
          <div style={s.frow}><span style={s.flbl}>Cost code</span><span style={s.fval}>{t.cc || '—'}</span></div>
          <div style={s.frow}><span style={s.flbl}>Quantity</span><span style={s.fval}>{t.qty || '—'}</span></div>
          <div style={s.frow}><span style={s.flbl}>Project</span><span style={s.fval}>{t.proj || '—'}</span></div>
          {t.note && <div style={s.frow}><span style={s.flbl}>Note</span><span style={{...s.fval,fontSize:10}}>{t.note}</span></div>}
          <div style={{...s.fsec,marginTop:12}}>Plan</div>
          {p && <div style={s.chip} onClick={() => jumpPlan(p.id)}><div><div style={s.cname}>{p.id}</div><div style={s.cmeta}>{p.name}</div></div><span style={{color:'#9CA3AF'}}>→</span></div>}
          <div style={{...s.fsec,marginTop:6}}>Item</div>
          <div style={s.chip} onClick={() => jumpItem(it.num)}><div><div style={s.cname}>{it.num}</div><div style={s.cmeta}>{it.desc}</div></div><span style={{color:'#9CA3AF'}}>→</span></div>
        </>
      );
    }
    return null;
  }

  function getStats() {
    if (view === 'items') return [
      { label: 'Items', val: filteredItems.length },
      { label: 'Category', val: [...new Set(filteredItems.map(i => i.cat))].length },
      { label: 'UOM types', val: [...new Set(filteredItems.map(i => i.uom))].length },
      { label: 'Priced', val: 102 },
    ];
    if (view === 'plans') return [
      { label: 'Plans', val: filteredPlans.length },
      { label: 'Townhomes', val: filteredPlans.filter(p => isTH(p)).length },
      { label: 'Modified', val: filteredPlans.filter(p => p.name.includes('Modified')).length },
      { label: 'Has takeoff', val: filteredPlans.filter(p => TAKEOFF.some(t => t.planId === p.id)).length },
    ];
    if (view === 'takeoff') return [
      { label: 'Lines', val: filteredTakeoff.length },
      { label: 'Plans', val: [...new Set(filteredTakeoff.map(t => t.planId))].length },
      { label: 'Items', val: [...new Set(filteredTakeoff.map(t => t.item))].length },
      { label: 'Cost codes', val: [...new Set(filteredTakeoff.map(t => t.cc))].length },
    ];
    return [{ label: 'Vendors', val: 1 }, { label: 'Total items', val: '35,047' }, { label: 'Matched', val: 102 }, { label: 'Last upload', val: 'Mar 9' }];
  }

  function getTitles() {
    if (view === 'items') return ['Master item list', 'All active items — Blue Haven Homes'];
    if (view === 'plans') return ['Plans', 'All plan variants — Blue Haven Homes'];
    if (view === 'takeoff') return ['Master takeoff', 'Item-to-plan associations — Blue Haven Homes'];
    return ['Pricing pool', 'Vendor pricing available — Blue Haven Homes'];
  }

  const [title, sub] = getTitles();

  let sections = [];
  let lastSection = null;
  navItems.forEach(item => {
    if (item.section !== lastSection) {
      sections.push({ type: 'section', label: item.section });
      lastSection = item.section;
    }
    sections.push({ type: 'item', ...item });
  });

  return (
    <div style={s.shell}>
      <div style={s.inner}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div style={s.logo}>clear<span style={s.logoSpan}>way</span></div>
          <div style={s.btag}>{role === 'vendor' ? 'Elliott Electric' : 'Blue Haven Homes'}</div>
          <div style={s.togwrap}>
            <button style={s.togbtn(role === 'builder')} onClick={() => setRole('builder')}>Builder</button>
            <button style={s.togbtn(role === 'vendor')} onClick={() => setRole('vendor')}>Vendor</button>
          </div>
          <button style={s.fbBtn} onClick={() => setShowFeedback(true)}>Leave feedback</button>
        </div>

        {/* Body */}
        <div style={s.body}>
          {/* Sidenav */}
          <div style={s.sidenav}>
            {sections.map((item, i) =>
              item.type === 'section'
                ? <div key={i} style={s.navSec}>{item.label}</div>
                : <div key={item.id} style={s.navItem(view === item.id)} onClick={() => goView(item.id)}>
                    {item.label}
                    <span style={s.navCnt}>{item.id === 'items' ? filteredItems.length : item.id === 'plans' ? filteredPlans.length : item.id === 'takeoff' ? filteredTakeoff.length : item.count}</span>
                  </div>
            )}
          </div>

          {/* Main */}
          <div style={s.main}>
            <div style={s.mhdr}>
              <div style={s.mtitle}>{title}</div>
              <div style={s.msub}>{sub}</div>
              <div style={s.srow}>
                {getStats().map((st, i) => (
                  <div key={i} style={s.stat}><strong style={s.statNum}>{st.val}</strong>{st.label}</div>
                ))}
              </div>
            </div>

            <div style={s.twrap}>
              {view === 'items' && (
                <>
                  <div style={s.hint}>Tip: use * as wildcard — *gfci finds all GFCI items, *ippi finds Mississippi</div>
                  <table style={s.table}>
                    <colgroup><col width="90"/><col width="115"/><col/><col width="52"/><col width="90"/></colgroup>
                    <thead style={s.thead}>
                      <tr>
                        <th style={s.th}><div style={s.thi}>Item #</div><FilterInput col="num" placeholder="Filter..."/></th>
                        <th style={s.th}><div style={s.thi}>Catalog code</div><FilterInput col="code" placeholder="Filter..."/></th>
                        <th style={s.th}><div style={s.thi}>Description</div><FilterInput col="desc" placeholder="Search..."/></th>
                        <th style={s.th}><div style={s.thi}>UOM</div><FilterInput col="uom" isSelect opts={['C','Ea','M']}/></th>
                        <th style={s.th}><div style={s.thi}>Category</div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length === 0
                        ? <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'#9CA3AF',fontSize:11}}>No items match current filters</td></tr>
                        : filteredItems.map(it => (
                          <tr key={it.num} onClick={() => selectItem(it.num)}>
                            <td style={s.td(sel===it.num)}><span style={{fontWeight:700,color:'#1E40AF'}}>{it.num}</span></td>
                            <td style={{...s.td(sel===it.num),fontFamily:'monospace',fontSize:10,color:'#6B7280'}}>{it.code}</td>
                            <td style={s.td(sel===it.num)} title={it.desc}>{it.desc}</td>
                            <td style={s.td(sel===it.num)}><UomBadge uom={it.uom}/></td>
                            <td style={s.td(sel===it.num)}><Badge label={it.cat} type="elec"/></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </>
              )}

              {view === 'plans' && (
                <>
                  <div style={s.hint}>Tip: use * as wildcard — *ippi finds Mississippi, *mod finds all Modified plans</div>
                  <table style={s.table}>
                    <colgroup><col width="100"/><col/><col width="80"/></colgroup>
                    <thead style={s.thead}>
                      <tr>
                        <th style={s.th}><div style={s.thi}>Plan #</div><FilterInput col="id" placeholder="Filter..."/></th>
                        <th style={s.th}><div style={s.thi}>Plan name</div><FilterInput col="name" placeholder="Search..."/></th>
                        <th style={s.th}><div style={s.thi}>Abbr</div><FilterInput col="abbr" placeholder="Filter..."/></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlans.length === 0
                        ? <tr><td colSpan={3} style={{textAlign:'center',padding:24,color:'#9CA3AF',fontSize:11}}>No plans match current filters</td></tr>
                        : filteredPlans.map(p => {
                            const hasTO = TAKEOFF.some(t => t.planId === p.id);
                            return (
                              <tr key={p.id} onClick={() => selectPlan(p.id)}>
                                <td style={s.td(sel===p.id)}><span style={{fontWeight:700,color:'#1E40AF'}}>{p.id}</span></td>
                                <td style={s.td(sel===p.id)}>
                                  <span style={{fontWeight:600}}>{p.name}</span>
                                  {isTH(p) && <Badge label="TH" type="th"/>}
                                  {hasTO && <Badge label="Has takeoff" type="ok"/>}
                                </td>
                                <td style={{...s.td(sel===p.id),fontFamily:'monospace',fontSize:10,color:'#6B7280'}}>{p.abbr}</td>
                              </tr>
                            );
                          })
                      }
                    </tbody>
                  </table>
                </>
              )}

              {view === 'takeoff' && (
                <>
                  <div style={s.hint}>Tip: click a blue plan name to jump to that plan record</div>
                  <table style={s.table}>
                    <colgroup><col width="78"/><col width="200"/><col width="90"/><col/><col width="52"/><col width="68"/></colgroup>
                    <thead style={s.thead}>
                      <tr>
                        <th style={s.th}><div style={s.thi}>Cost code</div><FilterInput col="cc" placeholder="Filter..."/></th>
                        <th style={s.th}><div style={s.thi}>Plan</div><FilterInput col="plan" placeholder="Search..."/></th>
                        <th style={s.th}><div style={s.thi}>Item #</div><FilterInput col="item" placeholder="Search..."/></th>
                        <th style={s.th}><div style={s.thi}>Description</div></th>
                        <th style={s.th}><div style={s.thi}>Qty</div></th>
                        <th style={s.th}><div style={s.thi}>Project</div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTakeoff.length === 0
                        ? <tr><td colSpan={6} style={{textAlign:'center',padding:24,color:'#9CA3AF',fontSize:11}}>No rows match current filters</td></tr>
                        : filteredTakeoff.map((t, i) => {
                            const p = planById(t.planId) || {}, it = itemByNum(t.item) || { desc: '—' };
                            const k = t.planId + t.item;
                            return (
                              <tr key={i} onClick={() => selectTakeoff(t.planId, t.item)}>
                                <td style={{...s.td(sel===k),fontFamily:'monospace',fontSize:10,color:'#6B7280'}}>{t.cc}</td>
                                <td style={s.td(sel===k)}>
                                  <span style={s.plink} onClick={e => { e.stopPropagation(); jumpPlan(p.id); }}>
                                    {p.id} — {p.name}
                                  </span>
                                </td>
                                <td style={s.td(sel===k)}><span style={{fontWeight:700,color:'#1E40AF'}}>{t.item}</span></td>
                                <td style={{...s.td(sel===k),fontSize:10,color:'#6B7280'}} title={it.desc}>{it.desc}</td>
                                <td style={{...s.td(sel===k),fontWeight:700,textAlign:'right'}}>{t.qty}</td>
                                <td style={{...s.td(sel===k),fontSize:10,color:'#9CA3AF'}}>{t.proj}</td>
                              </tr>
                            );
                          })
                      }
                    </tbody>
                  </table>
                </>
              )}

              {view === 'pricing' && (
                <table style={s.table}>
                  <colgroup><col width="150"/><col width="170"/><col/><col width="80"/><col width="100"/><col width="80"/></colgroup>
                  <thead style={s.thead}>
                    <tr>
                      {['Vendor','File','Scope','Items','Uploaded','Status'].map(h => (
                        <th key={h} style={s.th}><div style={s.thi}>{h}</div></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={s.td(false)}><strong>Elliott Electric</strong></td>
                      <td style={{...s.td(false),fontSize:10,color:'#6B7280'}}>PRICING_03.09.26.xlsx</td>
                      <td style={{...s.td(false),fontSize:11,color:'#6B7280'}}>Open catalog</td>
                      <td style={{...s.td(false),fontWeight:700,textAlign:'right'}}>35,047</td>
                      <td style={{...s.td(false),fontSize:10,color:'#6B7280'}}>Mar 9, 2026</td>
                      <td style={s.td(false)}><Badge label="Loaded" type="ok"/></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Flyout */}
          <div style={s.flyout}>
            <div style={s.fhdr}>
              <div style={s.ftitle}>{flyout ? (flyout.type === 'item' ? flyout.it.num : flyout.type === 'plan' ? flyout.p.id : 'Takeoff line') : 'Detail'}</div>
              <div style={s.fsub}>{flyout ? (flyout.type === 'item' ? flyout.it.code : flyout.type === 'plan' ? flyout.p.name : flyout.p?.name || '') : 'Select a row to explore'}</div>
            </div>
            <div style={s.fbody}><FlyoutContent/></div>
          </div>
        </div>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <div style={s.modalBg} onClick={() => setShowFeedback(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:15,fontWeight:700,color:'#111827',marginBottom:6}}>Leave feedback</h3>
            <p style={{fontSize:12,color:'#6B7280',marginBottom:16,lineHeight:1.6}}>This is an early mockup of the Clearway platform. What&apos;s working well, what&apos;s confusing, or what&apos;s missing?</p>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
              style={{width:'100%',border:'1px solid #D1D5DB',borderRadius:6,padding:10,fontSize:12,fontFamily:'inherit',resize:'vertical',minHeight:100,color:'#111827',outline:'none'}}
              placeholder="Type your feedback here..." />
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button onClick={() => setShowFeedback(false)} style={{padding:'7px 16px',fontSize:12,fontWeight:600,borderRadius:6,cursor:'pointer',border:'1px solid #D1D5DB',background:'#fff',color:'#374151'}}>Cancel</button>
              <button onClick={() => { alert('Thank you! In the live version this will be saved automatically.'); setFeedback(''); setShowFeedback(false); }}
                style={{padding:'7px 16px',fontSize:12,fontWeight:600,borderRadius:6,cursor:'pointer',border:'none',background:'#185FA5',color:'#fff'}}>Submit feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
