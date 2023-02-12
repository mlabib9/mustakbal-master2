frappe.ui.form.on("Project", {
  duration_by_week: function (frm) {
    cur_frm.set_value(
      "official_end_date",
      frappe.datetime.add_days(
        frm.doc.official_start_date,
        frm.doc.duration_by_week * 7
      )
    );
    cur_frm.refresh();
  },
  duration_by_weeks: function (frm) {
    cur_frm.set_value(
      "end_date",
      frappe.datetime.add_days(
        frm.doc.start_date,
        frm.doc.duration_by_weeks * 7
      )
    );
    cur_frm.refresh();
  },
});
