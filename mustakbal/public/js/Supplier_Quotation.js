frappe.ui.form.on("Supplier Quotation", {
  refresh:function(frm){
    if(frm.doc.docstatus == 1){
    frm.add_custom_button(
      "Quotation",
      (frm) => {
        frappe.new_doc("Quotation", {
          sales_request: cur_frm.doc.sales_request,
          
        });
      },
      __("Create")
    );
  }}
})


// collect the doctype's name (checked)
let names = [];
// access to listview page
frappe.listview_settings["Supplier Quotation"] = {
  get_indicator: function (doc) {},
  onload: async function (listview) {
    // add button Quotation
    await listview.page.add_action_item(__("Quotation"), () => {
      // pass listview to test func to get names of doctype
      names=[]
      test(listview);
      
      // call to get items by names
      frappe.call({
        method: "frappe.client.get_list",
        args: {
          parent: "Supplier Quotation",
          doctype: "Supplier Quotation Item",
          filters: { parent: ["in", names] },
          fields: ["*"],
        },

        async: false,
        callback: function (r) {
          items = r.message;
         
          // call to serverside to route with items to Quotation DOCTYPE
          frappe.call({
            method: "mustakbal.public.py.supplier_quotation.make_quotation",
            args: { items: items ,names:names},
            callback: function (r) {},
          });
        },
      });
    });
  },
};
// test func to collect listview's name of checked doctype
function test(listview) {
  $.each(listview.get_checked_items(), function (key, value) {
    names.push(value.name);
  });
  if (names.length === 0) {
    frappe.throw(__("No rows selected."));
  }
}
