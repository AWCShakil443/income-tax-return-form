/* Stable application bootstrap. The calculation engine is local, not loaded from raw.githubusercontent.com. */
(function(){
  const s=document.createElement('script');
  s.src='app-legacy.js';
  s.onload=function(){
    function openPrintWindow(){
      if(typeof window.calculate==='function') window.calculate();
      const source=document.getElementById('reviewCard');
      const body=source ? source.innerHTML : '<h2>Final Client Tax Form</h2><p>No calculation summary available.</p>';
      const w=window.open('','_blank','width=1000,height=800');
      if(!w){ alert('Please allow pop-ups for this site to print the Final Client Tax Form.'); return; }
      w.document.open();
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Final Client Tax Form</title><style>
      *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;margin:0;padding:28px;background:#fff}.final-client-form{max-width:900px;margin:auto}.fcf-head{display:flex;justify-content:space-between;border-bottom:3px solid #10213f;padding-bottom:14px;margin-bottom:18px}.fcf-eyebrow{font-size:10px;letter-spacing:1.5px;color:#667085}.fcf-head h2{margin:4px 0;font-size:24px}.fcf-head p{margin:4px 0;color:#667085;font-size:12px}.fcf-year{text-align:right;font-size:11px;color:#667085}.fcf-year strong{font-size:16px;color:#172033}.fcf-section{margin:16px 0;border:1px solid #d9dee8;border-radius:8px;overflow:hidden}.fcf-section h3{margin:0;padding:10px 12px;background:#f4f6fa;font-size:14px}.fcf-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:#d9dee8}.fcf-cell{background:#fff;padding:10px 12px;min-height:55px}.fcf-cell span{display:block;color:#667085;font-size:10px;margin-bottom:4px}.fcf-cell strong{font-size:14px}.fcf-important{background:#eef4ff}.fcf-important strong{font-size:16px}.fcf-warning{background:#fff4e5}.fcf-declaration{font-size:11px;line-height:1.6;padding:12px}.fcf-signatures{display:grid;grid-template-columns:1fr 1fr;gap:70px;padding:30px 14px 18px;font-size:11px}.fcf-signline{border-top:1px solid #222;margin-bottom:8px}.no-print{display:none!important}@media print{body{padding:12mm}.fcf-section{break-inside:avoid}}@media(max-width:650px){.fcf-grid,.fcf-signatures{grid-template-columns:1fr}.fcf-year{text-align:left}.fcf-head{display:block}}
      </style></head><body>${body}<script>window.onload=function(){window.print();}</script></body></html>`);
      w.document.close();
    }
    window.openFinalClientPrint=openPrintWindow;
    const topPrint=document.getElementById('printBtn');
    if(topPrint) topPrint.onclick=function(){showStep(6);setTimeout(openPrintWindow,120)};
    const finalPrint=document.getElementById('finalPrintBtn');
    if(finalPrint) finalPrint.onclick=openPrintWindow;
    const renderFinal=function(){
      if(typeof window.calculate==='function') window.calculate();
      const card=document.getElementById('reviewCard');
      if(!card) return;
      const st=window.state||{};
      const money=n=>'৳'+Math.round(Number(n)||0).toLocaleString('en-BD');
      const v=id=>document.getElementById(id)?.value||'';
      const row=(label,value,cls='')=>`<div class="fcf-cell ${cls}"><span>${label}</span><strong>${value}</strong></div>`;
      card.innerHTML=`<div class="final-client-form"><div class="fcf-head"><div><div class="fcf-eyebrow">CLIENT TAX WORKING PAPER</div><h2>FINAL CLIENT TAX FORM</h2><p>Income Tax Computation, Tax Payable & Asset-Liability Reconciliation</p></div><div class="fcf-year">Assessment Year<br><strong>${v('assessmentYear')}</strong></div></div><div class="fcf-section"><h3>Assessee Information</h3><div class="fcf-grid">${row('Name of Assessee',v('name')||'Not provided')}${row('TIN',v('tin')||'Not provided')}${row('Designation',v('designation')||'Not provided')}${row('Tax Circle',v('taxCircle')||'Not provided')}</div></div><div class="fcf-section"><h3>Final Tax Calculation Summary</h3><div class="fcf-grid">${row('Total Income',money(st.totalIncome))}${row('Total Investment',money(st.totalInvestment))}${row('Tax Without Investment Rebate',money(st.taxBeforeRebate))}${row('Investment Tax Rebate',money(st.rebate))}${row('Tax Considering Investment Rebate',money(st.calculatedAfterRebate))}${row('Regular Tax After Rebate',money(st.regularTax))}${row('1% of Business Turnover',money(st.turnoverMinimum))}${row('Applicable Minimum Tax',money(st.minimumTax))}${row('Tax to Deposit',money(st.taxPayable),'fcf-important')}${row('Tax Paid / AIT / Credit',money(st.ait))}${row('Final Tax Payable',money(st.balance),'fcf-important')}</div></div><div class="fcf-section"><h3>Asset & Liability Reconciliation</h3><div class="fcf-grid">${row('Previous Year Reported Net Asset',money(st.prevNetAsset))}${row('This Year Total Assets',money(st.assets))}${row('This Year Total Liabilities',money(st.liabilities))}${row('This Year Net Asset',money(st.netAsset))}${row('Increase / (Decrease) in Net Asset',money(st.netAssetChange))}${row('This Year Additions / Acquisitions',money(document.getElementById('netAssetAdditions')?.value))}${row('Disposals / Reductions',money(document.getElementById('netAssetDisposals')?.value))}${row('Other Adjustments',money(document.getElementById('netAssetOthers')?.value))}${row('Reconciled Change',money(st.reconciledChange))}${row('Reconciliation Difference',money(st.reconciliationDifference),'fcf-warning')}</div></div><div class="fcf-section"><h3>Client Declaration & Signature</h3><p class="fcf-declaration">I confirm that I have reviewed the above income information, investment information, tax calculation, tax paid / AIT / credit, final tax payable and asset-liability reconciliation, and that the information provided is true and complete to the best of my knowledge.</p><div class="fcf-signatures"><div><div class="fcf-signline"></div><strong>Client Signature</strong><br>Name: ${v('name')||'________________'}<br>Date: __________________</div><div><div class="fcf-signline"></div><strong>Prepared / Reviewed By</strong><br>Name: __________________<br>Date: __________________</div></div></div></div>`;
    };
    window.renderFinalClientForm=renderFinal;
    const oldReview=window.review;
    window.review=function(){if(oldReview)oldReview();renderFinal();};
    const originalShow=window.showStep;
    window.showStep=function(n){originalShow(n);if(Number(n)===6)setTimeout(renderFinal,30);};
    renderFinal();
  };
  s.onerror=function(){console.error('Unable to load local calculation engine.');};
  document.head.appendChild(s);
})();