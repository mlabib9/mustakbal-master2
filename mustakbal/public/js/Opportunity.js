frappe.ui.form.on("Opportunity", {
  setup:function(frm){
    cur_frm.set_value("transaction_date", frappe.datetime.nowdate());
    refresh_field("transaction_date");
  },
  refresh: function (frm) {
    
    setTimeout(() => {
      frm.remove_custom_button("Supplier Quotation", "Create");
      frm.remove_custom_button("Request For Quotation", "Create");
      frm.remove_custom_button("Quotation", "Create");
      frm.remove_custom_button("Customer", "Create");
    }, 500);
    if (!frm.is_new()) {
      frm.add_custom_button(
        "Sales Request",
        (frm) => {
          frappe.new_doc("Sales Request", {
            opportunity: cur_frm.docname,
            contact_form:cur_frm.doc.opportunity_from,
            contact: cur_frm.doc.party_name,
            contact_form :cur_frm.doc.opportunity_from,
            opportunity_name:cur_frm.doc.opportunity_name_
          });
         
        },
        __("Create")
      );
    }
    
    {
    }
  },
});
