# Income Tax Client Signature Form

A browser-based income tax working-paper and client sign-off application.

## Current workflow

1. Basic assessee information
2. Income computation
3. Investment rebate
4. Tax payable and payment
5. Client review
6. Final signature / print

## Tax payable logic

The application determines tax payable before AIT or tax credits as the maximum of:

- 1% of business turnover
- Regular calculated tax after applicable investment rebate
- Statutory minimum tax of **BDT 5,000 for an existing taxpayer** or **BDT 1,000 for a first-time taxpayer**

Available advance income tax and tax credits are then deducted to determine the balance tax payable.

## Advance tax / payment

Advance tax period/reference is deliberately a **free-text field** so the user can enter the relevant period, challan reference, payment reference or other description. Challan number, date and amount are captured separately.

The payment section also records payment status, payment reference/challan, payment date, amount paid, payment method and remaining amount.

## Deployment

The repository is designed for GitHub Pages and does not require a server. Enable GitHub Pages from the repository Settings and select the `main` branch and root folder.

## Important

This is a client review and tax working-paper application based on the supplied workbook structure. Tax rates, thresholds, exemptions, rebate rules and other legal parameters should be verified and updated by a qualified tax professional before production use. It is not an official NBR return form.
