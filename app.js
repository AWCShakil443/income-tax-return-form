const $ = id => document.getElementById(id);
const num = id => Math.max(0, Number($(id)?.value || 0));
const money = n => "৳" + Math.round(n || 0).toLocaleString("en-BD");
const ids = [...document.querySelectorAll("input,select,textarea")].map(x=>x.id).filter(Boolean);

const businessExpenses = [
  ["Material purchase cost","bizMaterial"],["Salary / Wages Expense","bizSalary"],["Office Rent","bizOfficeRent"],
  ["Utilities Expense","bizUtilities"],["Selling Expense","bizSelling"],["Sales Discount / Commission / Brokerage","bizSalesDiscount"],
  ["Conference / Residential Cost of Sales Representative","bizConference"],["Administrative Expense","bizAdmin"],
  ["Government Fee / Duty / Tax / Land Development Fee","bizGovFee"],["Repair & Maintenance","bizRepair"],
  ["Insurance Premium","bizInsurance"],["C&F Expense","bizCNF"],["Mobile & Internet","bizMobile"],
  ["Professional Expense","bizProfessional"],["Bad Debt","bizBadDebt"],["Advertisement","bizAdvertisement"],
  ["Royalty / Technical / Head Office Expense","bizRoyalty"],["Depreciation Expense","bizDepreciation"],
  ["Amortization Expense","bizAmortization"],["Research & Development","bizRnD"],["Employee Training","bizTraining"],
  ["Conveyance","bizConveyance"],["Entertainment & Hospitality","bizEntertainment"],["Exchange Loss","bizExchange"],
  ["Membership Fee","bizMembership"],["Foreign Travel","bizForeignTravel"],["Workers Welfare Fund","bizWelfare"],
  ["Other Business Expense","bizOther"]
];

$("businessExpenseGrid").innerHTML = businessExpenses.map(([label,id]) =>
  `<label>${label}<input data-num id="${id}"></label>`).join("");

const months=["Jul-25","Aug-25","Sep-25","Oct-25","Nov-25","Dec-25","Jan-26","Feb-26","Mar-26","Apr-26","May-26","Jun-26"];
$("aitTable").querySelector("tbody").innerHTML = months.map(m =>
  `<tr><td>${m}</td><td><input data-ait="${m}" class="ait-challan"></td><td><input data-aitdate="${m}" type="date"></td><td><input data-aitamount="${m}" data-num class="ait-amount"></td></tr>`
).join("");

function salary(){
  const gross = ["basicPay","houseRent","festivalBonus","conveyance","medical","gratuity","employerPF","clothing","earnedLeave","performanceBonus"].reduce((s,id)=>s+num(id),0);
  const exempt=Math.min(gross/3,500000);
  const taxable=Math.max(0,gross-exempt);
  $("salaryGross").textContent=money(gross); $("salaryExempt").textContent=money(exempt); $("salaryTaxable").textContent=money(taxable); $("salaryLive").textContent=money(taxable);
  return taxable;
}
function house(){
  const rent=num("rentIncome");
  const repair = $("houseType").value==="commercial" ? rent*.30 : $("houseType").value==="residential" ? rent*.25 : 0;
  const expenses=["houseInsurance","houseInterest","municipalTax","vacancyAllowance","preRentInterest"].reduce((s,id)=>s+num(id),0)+repair;
  const taxable=Math.max(0,rent-expenses);
  $("houseRepair").textContent=money(repair); $("houseExpenses").textContent=money(expenses); $("houseTaxable").textContent=money(taxable); $("houseLive").textContent=money(taxable);
  return taxable;
}
function agri(){
  const receipts=num("agriSales")+num("agriTea")*.60;
  const exp=["agriLandTax","agriLandRent","agriSeeds","agriLabour","agriIrrigation","agriInterest","agriMaintenance","agriInsurance","agriLoss","agriDep","agriDairy","agriOther"].reduce((s,id)=>s+num(id),0);
  const expenseIfNoBooks = $("agriBooks").value==="No" ? receipts*.60 : exp;
  const taxable=Math.max(0,receipts-expenseIfNoBooks);
  $("agriReceipts").textContent=money(receipts); $("agriExpenses").textContent=money(expenseIfNoBooks); $("agriTaxable").textContent=money(taxable); $("agriLive").textContent=money(taxable);
  return taxable;
}
function business(){
  const receipts=["bizBusinessIncome","bizProfessionIncome","bizRecurring","bizManagement","bizLease","bizFx","bizLiquidated"].reduce((s,id)=>s+num(id),0);
  const expenses=businessExpenses.reduce((s,[,id])=>s+num(id),0);
  const taxable=Math.max(0,receipts-expenses);
  $("bizReceipts").textContent=money(receipts); $("bizExpenses").textContent=money(expenses); $("bizTaxable").textContent=money(taxable); $("businessLive").textContent=money(taxable);
  return taxable;
}
function capital(){
  const sale=num("capitalSale");
  const acquisition=$("capitalOwnership").value==="purchase"?num("capitalPurchaseValue"):num("capitalFairValue");
  const expenses=num("capitalDuty")+acquisition+num("capitalRepair");
  const taxable=Math.max(0,sale-expenses);
  $("capitalExpenses").textContent=money(expenses); $("capitalTaxable").textContent=money(taxable); $("capitalLive").textContent=money(taxable);
  return taxable;
}
function financial(){
  const gross=["finGovt","finSecurities","finInterest","finBank","finScheme","finDividend"].reduce((s,id)=>s+num(id),0);
  const exp=["finCharges","finLoanInterest","finOtherExpense"].reduce((s,id)=>s+num(id),0);
  const taxable=Math.max(0,gross-exp);
  $("finGross").textContent=money(gross); $("finExpenses").textContent=money(exp); $("finTaxable").textContent=money(taxable); $("financialLive").textContent=money(taxable);
  return taxable;
}
function others(){
  const gross=["otherRoyalty","otherSubsidy","otherAlienation","otherGift","otherUnclassified"].reduce((s,id)=>s+num(id),0);
  const taxable=Math.max(0,gross-num("otherExpense"));
  $("otherGross").textContent=money(gross); $("otherTaxable").textContent=money(taxable); $("otherLive").textContent=money(taxable);
  return taxable;
}
function taxForIncome(income){
  const sex=$("sex").value;
  const disabled=$("disabled").value==="Yes";
  const freedom=$("freedomFighter").value==="Yes";
  const child=$("disableChild").value==="Yes";
  let threshold = freedom ? 525000 : disabled ? 525000 : child ? 450000 : sex==="Female" ? 450000 : 400000;
  let rem=Math.max(0,income-threshold), tax=0;
  const bands=[[300000,.10],[400000,.15],[500000,.20],[2000000,.25],[Infinity,.30]];
  for(const [limit,rate] of bands){const x=Math.min(rem,limit); tax+=x*rate; rem-=x; if(rem<=0) break;}
  return tax;
}
function investment(){
  const raw=num("invLife")+num("invAnnuity")+num("invPF")+num("invRPF")+num("invSuper")
    +Math.min(num("invGovt"),500000)+Math.min(num("invMutual"),500000)+Math.min(num("invDPS"),120000)
    +num("invBsec")+num("invHospital")+num("invHandicraft")+num("invZakat")+num("invBenevolent")+num("invEducation")+num("invSocio");
  const income=window.calc.totalIncome||0;
  const maxInv=Math.round(income*.30);
  const eligible=Math.min(raw,maxInv);
  const rebate=Math.min(eligible*.10, income*.03, 750000);
  $("eligibleInvestment").textContent=money(eligible); $("maxInvestment").textContent=money(maxInv); $("taxRebate").textContent=money(rebate);
  $("taxRebate2").textContent=money(rebate);
  return rebate;
}
function ait(){
  let total=[...document.querySelectorAll(".ait-amount")].reduce((s,e)=>s+Number(e.value||0),0)+num("aitIC")+num("aitFD");
  $("totalAIT").textContent=money(total);
  return total;
}
function calculate(){
  const total=salary()+house()+agri()+business()+capital()+financial()+others();
  const tax=taxForIncome(total);
  window.calc={totalIncome:total,tax:tax};
  $("totalIncome").textContent=money(total); $("taxBeforeRebate").textContent=money(tax); $("taxBeforeRebate2").textContent=money(tax);
  const rebate=investment(); const credits=ait();
  const minTax= $("firstReturn").value==="Yes" && total>0 ? 1000 : 5000;
  const liability=Math.max(minTax,tax-rebate);
  const deposit=Math.max(0,liability-credits);
  $("estimatedTax").textContent=money(liability); $("taxToDeposit").textContent=money(deposit);
  return {total,tax,rebate,credits,liability,deposit};
}
function buildReview(){
  const c=calculate();
  const rows=[
    ["Assessee",$("name").value||"Not provided"],["Assessment Year",$("assessmentYear").value],
    ["TIN",$("tin").value||"Not provided"],["Salary Income",money(salary())],
    ["House Property",money(house())],["Agriculture",money(agri())],["Business / Profession",money(business())],
    ["Capital Gain",money(capital())],["Financial Assets",money(financial())],["Other Sources",money(others())],
    ["Total Taxable Income",money(c.total)],["Tax Before Rebate",money(c.tax)],
    ["Tax Rebate",money(c.rebate)],["AIT / Tax Credit",money(c.credits)],["Tax to Deposit",money(c.deposit)]
  ];
  $("reviewCard").innerHTML=`<div class="review-header"><h3>Final Computation Summary</h3><div>Assessment Year ${$("assessmentYear").value}</div></div><div class="review-grid">${rows.map(r=>`<div><small>${r[0]}</small><strong>${r[1]}</strong></div>`).join("")}</div>`;
  $("sigName").textContent=$("name").value||"________________";
  $("signaturePreview").innerHTML=`<h3>Client approval requested</h3><p>I have reviewed the computation prepared from the information and documents supplied by me.</p><div class="amount">${money(c.deposit)}</div><div>Estimated tax to deposit after available AIT / credits</div>`;
}
function allCalc(){calculate(); if(document.querySelector('[data-panel="4"].active')) buildReview();}

document.addEventListener("input",e=>{if(e.target.matches("input,select,textarea")) allCalc();});
document.addEventListener("change",e=>{if(e.target.matches("input,select,textarea")) allCalc();});

document.querySelectorAll(".step").forEach(btn=>btn.addEventListener("click",()=>{
  const n=Number(btn.dataset.step); showStep(n);
}));
document.querySelectorAll(".next").forEach(btn=>btn.addEventListener("click",()=>{
  const active=Number(document.querySelector(".step-panel.active").dataset.panel); showStep(Math.min(5,active+1));
}));
document.querySelectorAll(".prev").forEach(btn=>btn.addEventListener("click",()=>{
  const active=Number(document.querySelector(".step-panel.active").dataset.panel); showStep(Math.max(1,active-1));
}));
function showStep(n){
  document.querySelectorAll(".step-panel").forEach(p=>p.classList.toggle("active",Number(p.dataset.panel)===n));
  document.querySelectorAll(".step").forEach(p=>p.classList.toggle("active",Number(p.dataset.step)===n));
  if(n===4||n===5) buildReview();
  window.scrollTo({top:0,behavior:"smooth"});
}
function snapshot(){
  const data={}; ids.forEach(id=>{const e=$(id); data[id]=e.type==="checkbox"?e.checked:e.value;});
  data.ait=[...document.querySelectorAll("[data-ait]")].map(e=>({ref:e.dataset.ait,value:e.value,date:document.querySelector(`[data-aitdate="${e.dataset.ait}"]`)?.value||"",amount:document.querySelector(`[data-aitamount="${e.dataset.ait}"]`)?.value||""}));
  return data;
}
function restore(data){
  ids.forEach(id=>{if(data[id]!==undefined){const e=$(id); if(e.type==="checkbox")e.checked=!!data[id]; else e.value=data[id];}});
  (data.ait||[]).forEach(x=>{const a=document.querySelector(`[data-ait="${x.ref}"]`);const d=document.querySelector(`[data-aitdate="${x.ref}"]`);const m=document.querySelector(`[data-aitamount="${x.ref}"]`);if(a)a.value=x.value;if(d)d.value=x.date;if(m)m.value=x.amount;});
  allCalc(); buildReview();
}
$("saveBtn").addEventListener("click",()=>{localStorage.setItem("clientTaxDraft",JSON.stringify(snapshot())); $("status").textContent="Draft saved in this browser."; $("status").classList.remove("hidden");});
$("loadBtn").addEventListener("click",()=>{const x=localStorage.getItem("clientTaxDraft");if(!x){$("status").textContent="No saved draft was found in this browser."; $("status").classList.remove("hidden");return;}restore(JSON.parse(x));$("status").textContent="Draft loaded."; $("status").classList.remove("hidden");});
$("printBtn").addEventListener("click",()=>{buildReview();showStep(5);setTimeout(()=>window.print(),150);});
$("finalPrintBtn").addEventListener("click",()=>window.print());

allCalc();
