frappe.ui.form.on("Survey Request", {
  date: function (frm) {
    if (frm.doc.date < get_today()) {
      cur_frm.set_value("date", "");
      refresh_field("date");
      frappe.throw(__("Please select a From Date from the present or future."));
    }
  },
});
