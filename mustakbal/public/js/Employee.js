frappe.ui.form.on("Employee", {
  date_of_joining: function (frm) {
    cur_frm.set_value(
      "contract_end_date",
      frappe.datetime.add_days(frm.doc.date_of_joining, 730)
    );
    frm.refresh();
  },
  date_of_issue: function (frm) {
    cur_frm.set_value(
      "valid_upto",
      frappe.datetime.add_days(frm.doc.date_of_issue, 2555)
    );
    frm.refresh();
  },

  validate: async function (frm) {
    expressiones = frm.doc.emergency_phone_number;
    const reges = RegExp(/^[0-9]{11}$/);
    resultes = reges.test(expressiones);
    if (!resultes) {
      await cur_frm.set_value("emergency_phone_number", "");
      refresh_field("emergency_phone_number");
      frappe.throw(__("Mobile Number should be 11 Digit Number"));
    }
    if (expressiones[0] != "0") {
      await cur_frm.set_value("emergency_phone_number", "");
      refresh_field("emergency_phone_number");
      frappe.throw(__("Mobile Number should be Start with 0"));
    }

    expressions = frm.doc.cell_number;
    const reg = RegExp(/^[0-9]{11}$/);
    results = reg.test(expressions);

    if (!results) {
      await cur_frm.set_value("cell_number", "");
      refresh_field("cell_number");
      frappe.throw(__("Mobile Number should be 11 Digit Number"));
    }
    expression = frm.doc.person_to_be_contacted;
    const regs = RegExp(/^[a-zA-Z ]*$/);
    result = regs.test(expression);
    if (!result) {
      await cur_frm.set_value("person_to_be_contacted", "");
      refresh_field("daperson_to_be_contactedte");
      frappe.throw(__("Input Only Accept letters"));
    }
    if (expressions[0] != "0") {
      await cur_frm.set_value("cell_number", "");
      refresh_field("cell_number");
      frappe.throw(__("Mobile Number should be Start with 0"));
    }
  },
});
