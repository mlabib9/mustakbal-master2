frappe.ui.form.on("Leave Period", {
  optional_holiday_list: function (frm) {
    frappe.call({
      method: "frappe.client.get",
      async: false,
      args: {
        doctype: "Holiday List",
        name: frm.doc.optional_holiday_list,
      },
      callback: function (data) {
        cur_frm.set_value("from_date", data.message.from_date);
        refresh_field("from_date");
        cur_frm.set_value("to_date", data.message.to_date);
        refresh_field("to_date");
      },
    });
  },
});
