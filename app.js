/* Final output loader. Keeps the stable tax engine and guarantees the Review & Signature page renders its calculation summary. */
(function(){
  const s=document.createElement('script');
  s.src='https://raw.githubusercontent.com/AWCShakil443/income-tax-return-form/3c77e28/app.js';
  s.onload=function(){
    const $=id=>document.getElementById(id);
    const money=n=>'৳'+Math.round(Number(n)||0).toLocaleString('en-BD');
    function ensure(){
      const panel=document.querySelector('[data-panel="6"]');
      if(!panel)return;
      let card=$('reviewCard');
      if(!card){card=document.createElement('div');card.id='reviewCard';card.className='review-card final-tax-review';const head=panel.querySelector('.section-head');(head?head:panel.firstChild).insertAdjacentElement('afterend',card);}
      let preview=$('signaturePreview');
      if(!preview){preview=document.createElement('div');preview.id='signaturePreview';preview.className='signature-preview';const decl=panel.querySelector('.declaration');if(decl)decl.parentNode.insertBefore(preview,decl);}
      return {card,preview};
    }
    const oldReview=window.review;
    window.review=function(){
      const e=ensure();
      if(oldReview)try{oldReview()}catch(err){console.warn('Previous review renderer skipped:',err)}
      const st=window.state||{};
      const val=id=>$(id)?.value||'';
      if(e?.card)e.card.innerHTML=`<div class="review-header"><h3>Final Tax Calculation Summary</h3><div>Assessment Year ${val('assessmentYear')}</div></div><div class="review-grid">
      <div><small>Assessee</small><strong>${val('name')||'Not provided'}</strong></div>
      <div><small>TIN</small><strong>${val('tin')||'Not provided'}</strong></div>
      <div><small>Total Income</small><strong>${money(st.totalIncome)}</strong></div>
      <div><small>Total Investment</small><strong>${money(st.totalInvestment)}</strong></div>
      <div><small>Tax Without Investment Rebate</small><strong>${money(st.taxBeforeRebate)}</strong></div>
      <div><small>Investment Tax Rebate</small><strong>${money(st.rebate)}</strong></div>
      <div><small>Tax Considering Investment Rebate</small><strong>${money(st.calculatedAfterRebate)}</strong></div>
      <div><small>Regular Tax After Rebate</small><strong>${money(st.regularTax)}</strong></div>
      <div><small>1% of Business Turnover</small><strong>${money(st.turnoverMinimum)}</strong></div>
      <div><small>Applicable Minimum Tax</small><strong>${money(st.minimumTax)}</strong></div>
      <div class="review-highlight"><small>Tax to Deposit</small><strong>${money(st.taxPayable)}</strong></div>
      <div><small>Tax Paid / AIT / Credit</small><strong>${money(st.ait)}</strong></div>
      <div class="review-highlight"><small>Final Tax Payable</small><strong>${money(st.balance)}</strong></div>
      </div><div class="final-form-section-title">Asset & Liability Reconciliation</div><div class="review-grid">
      <div><small>Previous Year Reported Net Asset</small><strong>${money(st.prevNetAsset)}</strong></div>
      <div><small>This Year Total Assets</small><strong>${money(st.assets)}</strong></div>
      <div><small>This Year Total Liabilities</small><strong>${money(st.liabilities)}</strong></div>
      <div><small>This Year Net Asset</small><strong>${money(st.netAsset)}</strong></div>
      <div><small>Increase / (Decrease) in Net Asset</small><strong>${money(st.netAssetChange)}</strong></div>
      <div><small>Reconciled Change</small><strong>${money(st.reconciledChange)}</strong></div>
      <div><small>Reconciliation Difference</small><strong>${money(st.reconciliationDifference)}</strong></div></div>`;
      if(e?.preview)e.preview.innerHTML=`<h3>Client Tax Approval</h3><p>Please review the final calculation before signing.</p><div class="signature-tax-summary"><div><span>Total Income</span><strong>${money(st.totalIncome)}</strong></div><div><span>Total Investment</span><strong>${money(st.totalInvestment)}</strong></div><div><span>Tax Considering Investment Rebate</span><strong>${money(st.calculatedAfterRebate)}</strong></div><div><span>Tax Without Investment Rebate</span><strong>${money(st.taxBeforeRebate)}</strong></div><div><span>Tax Paid / AIT / Credit</span><strong>${money(st.ait)}</strong></div><div class="primary-amount"><span>Tax Payable</span><strong>${money(st.balance)}</strong></div></div><p class="approval-note">I confirm that I have reviewed the above tax computation and agree with the final tax payable, subject to professional verification and applicable law.</p>`;
      if($('sigName'))$('sigName').textContent=val('name')||'________________';
    };
    ensure();
    const oldPrint=$('printBtn');
    if(oldPrint)oldPrint.onclick=()=>{if(typeof window.showStep==='function')window.showStep(6);window.review();setTimeout(()=>window.print(),150)};
  };
  document.head.appendChild(s);
})();
