/* Navigation-first loader. Section navigation must work even if the enhancement/calculation layer is delayed. */
(function(){
  function bindNavigation(){
    const panels=[...document.querySelectorAll('.step-panel')];
    const steps=[...document.querySelectorAll('.step')];
    if(!panels.length||!steps.length)return;
    window.showStep=function(n){
      n=Math.max(1,Math.min(6,Number(n)||1));
      panels.forEach(p=>p.classList.toggle('active',Number(p.dataset.panel)===n));
      steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
      if(n===6 && typeof window.review==='function'){
        try{window.review();}catch(e){console.warn('Review render skipped:',e)}
      }
      window.scrollTo({top:0,behavior:'smooth'});
    };
    steps.forEach(btn=>{btn.onclick=function(e){e.preventDefault();window.showStep(Number(btn.dataset.step));};});
    document.querySelectorAll('.next').forEach(btn=>{btn.onclick=function(e){e.preventDefault();const active=document.querySelector('.step-panel.active');const n=active?Number(active.dataset.panel):1;window.showStep(n+1);};});
    document.querySelectorAll('.prev').forEach(btn=>{btn.onclick=function(e){e.preventDefault();const active=document.querySelector('.step-panel.active');const n=active?Number(active.dataset.panel):1;window.showStep(n-1);};});
  }
  bindNavigation();

  if(!document.getElementById('estimatedTax')){
    const compatibility=document.createElement('span');
    compatibility.id='estimatedTax';
    compatibility.hidden=true;
    document.body.appendChild(compatibility);
  }

  const s=document.createElement('script');
  s.src='https://raw.githubusercontent.com/AWCShakil443/income-tax-return-form/3c77e28/app.js';
  s.onload=function(){
    const $=id=>document.getElementById(id);
    const money=n=>'৳'+Math.round(Number(n)||0).toLocaleString('en-BD');
    function ensure(){
      const panel=document.querySelector('[data-panel="6"]');
      if(!panel)return;
      let card=$('reviewCard');
      if(!card){card=document.createElement('div');card.id='reviewCard';card.className='review-card final-tax-review';const head=panel.querySelector('.section-head');if(head)head.insertAdjacentElement('afterend',card);else panel.insertBefore(card,panel.firstChild);}
      let preview=$('signaturePreview');
      if(!preview){preview=document.createElement('div');preview.id='signaturePreview';preview.className='signature-preview';const decl=panel.querySelector('.declaration');if(decl)decl.parentNode.insertBefore(preview,decl);}
      let wrap=$('finalClientFormEmbed');
      if(!wrap){
        wrap=document.createElement('div');wrap.id='finalClientFormEmbed';wrap.className='final-client-form-embed';
        wrap.innerHTML='<div class="embedded-form-head"><div><strong>Final Client Tax Form</strong><span>Complete client-facing tax computation, asset-liability reconciliation and signature form</span></div><button type="button" class="btn primary" id="openFinalForm">Open Full Final Form ↗</button></div><iframe id="finalClientFormFrame" title="Final Client Tax Form" src="final-form.html"></iframe>';
        const anchor=panel.querySelector('.section-head');
        if(anchor)anchor.insertAdjacentElement('afterend',wrap);else panel.insertBefore(wrap,panel.firstChild);
        const open=()=>window.open('final-form.html','_blank','noopener');
        const btn=document.getElementById('openFinalForm');if(btn)btn.onclick=open;
      }
      return {card,preview,wrap};
    }
    const oldReview=window.review;
    window.review=function(){
      const e=ensure();
      let st={};
      try{if(typeof window.calculate==='function')st=window.calculate()||{};}catch(err){console.warn('Tax engine calculation warning:',err);}
      if(oldReview)try{oldReview()}catch(err){console.warn('Previous review renderer skipped:',err)}
      const val=id=>$(id)?.value||'';
      if(e?.card)e.card.innerHTML=`<div class="review-header"><h3>Final Tax Calculation Summary</h3><div>Assessment Year ${val('assessmentYear')}</div></div><div class="review-grid">
      <div><small>Assessee</small><strong>${val('name')||'Not provided'}</strong></div><div><small>TIN</small><strong>${val('tin')||'Not provided'}</strong></div>
      <div><small>Total Income</small><strong>${money(window.state?.totalIncome)}</strong></div><div><small>Total Investment</small><strong>${money(window.state?.totalInvestment)}</strong></div>
      <div><small>Tax Without Investment Rebate</small><strong>${money(window.state?.taxBeforeRebate)}</strong></div><div><small>Investment Tax Rebate</small><strong>${money(window.state?.rebate)}</strong></div>
      <div><small>Tax Considering Investment Rebate</small><strong>${money(window.state?.calculatedAfterRebate)}</strong></div><div><small>Regular Tax After Rebate</small><strong>${money(window.state?.regularTax)}</strong></div>
      <div><small>1% of Business Turnover</small><strong>${money(window.state?.turnoverMinimum)}</strong></div><div><small>Applicable Minimum Tax</small><strong>${money(window.state?.minimumTax)}</strong></div>
      <div class="review-highlight"><small>Tax to Deposit</small><strong>${money(window.state?.taxPayable)}</strong></div><div><small>Tax Paid / AIT / Credit</small><strong>${money(window.state?.ait)}</strong></div>
      <div class="review-highlight"><small>Final Tax Payable</small><strong>${money(window.state?.balance)}</strong></div></div><div class="final-form-section-title">Asset & Liability Reconciliation</div><div class="review-grid">
      <div><small>Previous Year Reported Net Asset</small><strong>${money(window.state?.prevNetAsset)}</strong></div><div><small>This Year Total Assets</small><strong>${money(window.state?.assets)}</strong></div>
      <div><small>This Year Total Liabilities</small><strong>${money(window.state?.liabilities)}</strong></div><div><small>This Year Net Asset</small><strong>${money(window.state?.netAsset)}</strong></div>
      <div><small>Increase / (Decrease) in Net Asset</small><strong>${money(window.state?.netAssetChange)}</strong></div><div><small>Reconciled Change</small><strong>${money(window.state?.reconciledChange)}</strong></div>
      <div><small>Reconciliation Difference</small><strong>${money(window.state?.reconciliationDifference)}</strong></div></div>`;
      if(e?.preview)e.preview.innerHTML=`<h3>Client Tax Approval</h3><p>Please review the complete Final Client Tax Form above before signing.</p><div class="signature-tax-summary"><div><span>Total Income</span><strong>${money(window.state?.totalIncome)}</strong></div><div><span>Total Investment</span><strong>${money(window.state?.totalInvestment)}</strong></div><div><span>Tax Considering Investment Rebate</span><strong>${money(window.state?.calculatedAfterRebate)}</strong></div><div><span>Tax Without Investment Rebate</span><strong>${money(window.state?.taxBeforeRebate)}</strong></div><div><span>Tax Paid / AIT / Credit</span><strong>${money(window.state?.ait)}</strong></div><div class="primary-amount"><span>Tax Payable</span><strong>${money(window.state?.balance)}</strong></div></div><p class="approval-note">I confirm that I have reviewed the complete Final Client Tax Form and agree with the information and final tax payable, subject to professional verification and applicable law.</p>`;
      if($('sigName'))$('sigName').textContent=val('name')||'________________';
      const frame=$('finalClientFormFrame');if(frame){frame.contentWindow?.postMessage({type:'refreshFinalForm'},location.origin);}
    };
    ensure();
    const oldPrint=$('printBtn');
    if(oldPrint)oldPrint.onclick=()=>{if(typeof window.showStep==='function')window.showStep(6);window.review();setTimeout(()=>window.print(),250)};
    const style=document.createElement('style');
    style.textContent='.final-client-form-embed{margin:0 0 22px;border:1px solid #cfd7e6;border-radius:12px;background:#f7f9fc;overflow:hidden}.embedded-form-head{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:14px 16px;background:#10213f;color:#fff}.embedded-form-head strong{display:block;font-size:15px}.embedded-form-head span{display:block;font-size:11px;color:#dbe5f5;margin-top:3px}.embedded-form-head .btn{white-space:nowrap}.final-client-form-embed iframe{display:block;width:100%;height:1250px;border:0;background:#fff}.final-tax-review{margin-bottom:22px}.final-form-section-title{font-weight:800;font-size:14px;padding:15px 16px 8px;background:#f7f9fc;border-top:1px solid #d9dee8}.review-highlight{background:#eef4ff}.review-highlight strong{font-size:17px}.signature-tax-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:15px 0}.signature-tax-summary>div{padding:12px;border:1px solid #d9dee8;border-radius:8px;background:#fff}.signature-tax-summary span{display:block;color:#667085;font-size:11px}.signature-tax-summary strong{display:block;font-size:17px;margin-top:3px}.signature-tax-summary .primary-amount{background:#10213f;color:#fff}.signature-tax-summary .primary-amount span{color:#dbe5f5}.approval-note{font-size:11px;color:#5c4a20;border-left:4px solid #f59e0b;background:#fffaf0;padding:10px 12px}@media(max-width:800px){.signature-tax-summary{grid-template-columns:1fr}.embedded-form-head{align-items:flex-start;flex-direction:column}.final-client-form-embed iframe{height:1450px}}@media print{.final-client-form-embed{page-break-before:always;border:0}.embedded-form-head{display:none}.final-client-form-embed iframe{height:1550px}.final-tax-review{page-break-inside:avoid}.signature-tax-summary{grid-template-columns:repeat(3,1fr)}}';
    document.head.appendChild(style);
    window.review();
  };
  s.onerror=function(){console.warn('Enhancement layer unavailable; navigation remains active.');};
  document.head.appendChild(s);
})();