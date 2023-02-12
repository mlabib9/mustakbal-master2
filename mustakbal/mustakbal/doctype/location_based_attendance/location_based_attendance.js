// Copyright (c) 2022,   and contributors
// For license information, please see license.txt


frappe.ui.form.on("Location Based Attendance", {
  
  before_submit: function (frm) {
   
    frappe.call({
      method:
        "mustakbal.mustakbal.doctype.mission_controller.mission_controller.get_data",
      args: {
        name: cur_frm.doc.name,
        froms:cur_frm.doc.employee_location ,
        to:cur_frm.doc.location
      },
      callback: function (r) {
        console.log(r);
        for (let i in r.message) {
          frm.add_child("compensation", {
            salary_components: r.message[i].salary_components,
            value: r.message[i].value,
            is_expense_claim: r.message[i].is_expense_claim,
          });
        }
      },
    });
    cur_frm.refresh();
  },

})