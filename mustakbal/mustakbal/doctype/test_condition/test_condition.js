// Copyright (c) 2022,   and contributors
// For license information, please see license.txt

frappe.ui.form.on("Test Condition", {
  refresh: function (frm) {
    console.log(frm.doc.condition);
  },
});
