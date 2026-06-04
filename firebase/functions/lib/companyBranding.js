"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVOICE_CURRENCY = exports.UAE_VAT_RATE = exports.COMPANY = void 0;
exports.getCompanyTrn = getCompanyTrn;
/** Delight Pack B2B invoice branding (UAE / Dubai). */
exports.COMPANY = {
    legalName: "Delight Pack LLC",
    address: "Ras Al Khor Industrial Area 2, Dubai, United Arab Emirates",
    phone: "+971 55 961 0972",
    email: "orders@delightpack.ae",
    website: "www.delightpack.ae",
    primaryColor: "#0056b3",
    accentColor: "#e63946",
};
/** UAE standard VAT rate (5%) — Federal Decree-Law No. 8 of 2017. */
exports.UAE_VAT_RATE = 0.05;
exports.INVOICE_CURRENCY = "AED";
function getCompanyTrn() {
    return process.env.COMPANY_TRN?.trim() || null;
}
//# sourceMappingURL=companyBranding.js.map