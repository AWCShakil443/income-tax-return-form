/* Final output loader. Loads the stable tax engine, supplies its missing compatibility element, and renders a self-contained final calculation summary. */
(function(){
  if(!document.getElementById('estimatedTax')){const compatibility=document.createElement('span');compatibility.id='estimatedTax';compatibility.hidden=true;document.body.appendChild(compatibility);}
  const s=document.createElement('script');
  s.src='https://raw.githubusercontent.com/AWCShakil443/income-tax-return-form/3c77e28/app.js';
  s.onload=function(){
    const $=id=>document.getElementById(id);
    const money=n=>'৳'+Math.round(Number(n)||0).toLocaleString('en-BD');
    const n=id=>Number($(id)?.value||0)||0;
    function ensure(){
      const panel=document.querySelector('[data-panel="6"]');if(!panel)return;
      let card=$('reviewCard');
      if(!card){card=document.createElement('div');card.id='reviewCard';card.className='review-card final-tax-review';const head=panel.querySelector('.section-head');if(head)head.insertAdjacentElement('afterend',card);else panel.insertBefore(card,panel.firstChild);}
      let preview=$('signaturePreview');
      if(!preview){preview=document.createElement('div');preview.id='signaturePreview';preview.className='signature-preview';const decl=panel.querySelector('.declaration');if(decl)decl.parentNode.insertBefore(preview,decl);}
      return {card,preview};
    }
    function readState(){
      const totalIncome=n('totalIncome'), totalInvestment=[...document.querySelectorAll('[id^="inv"]')].reduce((s,e)=>s+n(e.id),0);
      const taxBefore=n('taxBeforeRebate'), rebate=n('taxRebate'), after=Math.max(0,taxBefore-rebate);
      const regular=n('regularTaxDisplay'), turnover1=n('turnoverMinimum'), minimum=n('statutoryMinimumDisplay'), taxDeposit=n('taxPayableBeforeAIT'), ait=n('totalAITPayment'), balance=n('balanceTaxPayable');
      return {totalIncome,totalInvestment,taxBeforeRebate:taxBefore,rebate,calculatedAfterRebate:after,regularTax:regular,turnoverMinimum:turnover1,minimumTax:minimum,taxPayable:taxDeposit,ait,balance,prevNetAsset:n('reconPrevious'),assets:n('thisYearAssets'),liabilities:n('thisYearLiabilities'),netAsset:n('thisYearNetAsset'),netAssetChange:n('netAssetChange'),reconciledChange:n('reconciledChange'),reconciliationDifference:n('reconciliationDifference')};
    }
    function render(){
      const e=ensure();if(!e)return;
      try{if(typeof window.calculate==='function')window.calculate();}catch(err){console.warn('Underlying calculation warning:',err);}
      const st=readState(),val=id=>$(id)?.value||'';
      e.card.innerHTML=`<div class="review-header"><h3>Final Tax Calculation Summary</h3><div>Assessment Year ${val('assessmentYear')}</div></div><div class="review-grid">
      <div><small>Assessee</small><strong>${val('name')||'Not provided'}</strong></div><div><small>TIN</small><strong>${val('tin')||'Not provided'}</strong></div>
      <div><small>Total Income</small><strong>${money(st.totalIncome)}</strong></div><div><small>Total Investment</small><strong>${money(st.totalInvestment)}</strong></div>
      <div><small>Tax Without Investment Rebate</small><strong>${money(st.taxBeforeRebate)}</strong></div><div><small>Investment Tax Rebate</small><strong>${money(st.rebate)}</strong></div>
      <div><small>Tax Considering Investment Rebate</small><strong>${money(st.calculatedAfterRebate)}</strong></div><div><small>Regular Tax After Rebate</small><strong>${money(st.regularTax)}</strong></div>
      <div><small>1% of Business Turnover</small><strong>${money(st.turnoverMinimum)}</strong></div><div><small>Applicable Minimum Tax</small><strong>${money(st.minimumTax)}</strong></div>
      <div class="review-highlight"><small>Tax to Deposit</small><strong>${money(st.taxPayable)}</strong></div><div><small>Tax Paid / AIT / Credit</small><strong>${money(st.ait)}</strong></div>
      <div class="review-highlight"><small>Final Tax Payable</small><strong>${money(st.balance)}</strong></div></div>
      <div class="final-form-section-title">Asset & Liability Reconciliation</div><div class="review-grid">
      <div><small>Previous Year Reported Net Asset</small><strong>${money(st.prevNetAsset)}</strong></div><div><small>This Year Total Assets</small><strong>${money(st.assets)}</strong></div>
      <div><small>This Year Total Liabilities</small><strong>${money(st.liabilities)}</strong></div><div><small>This Year Net Asset</small><strong>${money(st.netAsset)}</strong></div>
      <div><small>Increase / (Decrease) in Net Asset</small><strong>${money(st.netAssetChange)}</strong></div><div><small>Reconciled Change</small><strong>${money(st.reconciledChange)}</strong></div>
      <div><small>Reconciliation Difference</small><strong>${money(st.reconciliationDifference)}</strong></div></div>`;
      e.preview.innerHTML=`<h3>Client Tax Approval</h3><p>Please review the final calculation before signing.</p><div class="signature-tax-summary"><div><span>Total Income</span><strong>${money(st.totalIncome)}</strong></div><div><span>Total Investment</span><strong>${money(st.totalInvestment)}</strong></div><div><span>Tax Considering Investment Rebate</span><strong>${money(st.calculatedAfterRebate)}</strong></div><div><span>Tax Without Investment Rebate</span><strong>${money(st.taxBeforeRebate)}</strong></div><div><span>Tax Paid / AIT / Credit</span><strong>${money(st.ait)}</strong></div><div class="primary-amount"><span>Tax Payable</span><strong>${money(st.balance)}</strong></div></div><p class="approval-note">I confirm that I have reviewed the above tax computation and agree with the final tax payable, subject to professional verification and applicable law.</p>`;
      if($('sigName'))$('sigName').textContent=val('name')||'________________';
    }
    ensure();
    document.querySelectorAll('.step').forEach(b=>{if(b.dataset.step==='6')b.addEventListener('click',()=>setTimeout(render,30));});
    document.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{if(document.querySelector('.step-panel.active')?.dataset.panel==='6')render()},30)));
    const oldPrint=$('printBtn');if(oldPrint)oldPrint.onclick=()=>{if(typeof window.showStep==='function')window.showStep(6);setTimeout(()=>{render();setTimeout(()=>window.print(),100)},50)};
    const finalPrint=$('finalPrintBtn');if(finalPrint)finalPrint.onclick=()=>{render();setTimeout(()=>window.print(),100)};
    const style=document.createElement('style');style.textContent='.final-tax-review{margin-bottom:22px}.final-form-section-title{font-weight:800;font-size:14px;padding:15px 16px 8px;background:#f7f9fc;border-top:1px solid #d9dee8}.review-highlight{background:#eef4ff}.review-highlight strong{font-size:17px}.signature-tax-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:15px 0}.signature-tax-summary>div{padding:12px;border:1px solid #d9dee8;border-radius:8px;background:#fff}.signature-tax-summary span{display:block;color:#667085;font-size:11px}.signature-tax-summary strong{display:block;font-size:17px;margin-top:3px}.signature-tax-summary .primary-amount{background:#10213f;color:#fff}.signature-tax-summary .primary-amount span{color:#dbe5f5}.approval-note{font-size:11px;color:#5c4a20;border-left:4px solid #f59e0b;background:#fffaf0;padding:10px 12px}@media(max-width:800px){.signature-tax-summary{grid-template-columns:1fr}}@media print{.final-tax-review{page-break-inside:avoid}.signature-tax-summary{grid-template-columns:repeat(3,1fr)}}';document.head.appendChild(style);
    if(document.querySelector('.step-panel.active')?.dataset.panel==='6')render();
  };
  s.onerror=function(){console.error('Unable to load the stable calculation engine.');};document.head.appendChild(s);
})();
