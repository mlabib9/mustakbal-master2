// Copyright (c) 2022,   and contributors
// For license information, please see license.txt

frappe.ui.form.on("Prime Contractor Quotation", {
  setup: function (frm) {
    frm.set_query("quotation_to", function () {
      return {
        filters: {
          name: ["in", ["Prime Contractor"]],
        },
      };
    });
  },
  refresh: function (frm) {
    if (frm.doc.docstatus == 1) {
      frm.add_custom_button("Quotation", (frm) => {
        let d = new frappe.ui.Dialog({
          title: "Conversion Factor",
          fields: [
            { fieldtype: "Section Break" },
            {
              fieldtype: "Float",
              fieldname: "quotation",
              reqd: 1,
              label: __("conversion factor"),
            },
          ],
          primary_action_label: "Submit",
          primary_action(values) {
            console.log(cur_frm.doc.items);
            let item = [];
            let tn = frappe.model.make_new_doc_and_get_name("Quotation");
            cur_frm.doc.items.forEach(function (element) {
              if (element.rate) {
                element.rate = element.rate * values.quotation;
              }

              item.push(element);
            });

            (locals["Quotation"][tn].items = item),
              frappe.set_route("Form", "Quotation", tn);
            d.hide();
          },
        });
        d.show();
      });
    }
    let total = 0;

    for (let i in cur_frm.doc.items) {
      total = cur_frm.get_field("items").grid.grid_rows[i].doc.amount + total;
    }
    console.log(total);
    cur_frm.set_value("total", total);
  },
});
frappe.ui.form.on("Quotation Item", "item_code", function (frm, cdt, cdn) {
  let item = locals[cdt][cdn];

  frm.refresh_fields();
});
