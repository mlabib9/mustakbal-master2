frappe.ui.form.on("Sales Invoice", {
  refresh: function (frm) {},
});
frappe.ui.form.on("Sales Invoice Item", "item_code", function (frm, cdt, cdn) {
  let item = locals[cdt][cdn];
  frappe.call({
    method: "frappe.client.get",
    async: false,
    args: {
      doctype: "Item",
      name: item.item_code,
    },
    callback: function (data) {
      item.part_number = data.message.part_number;
    },
  });

  cur_frm.refresh();
});
