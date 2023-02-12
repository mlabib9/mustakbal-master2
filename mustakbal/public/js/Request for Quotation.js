frappe.ui.form.on("Request for Quotation", {
    refresh:function(frm){
        frm.fields_dict.items.grid.toggle_reqd(
            "warehouse",
           frm.doc.email_template=="anything"
          );
     
    },
    transaction_date:function(frm){
        if (frm.doc.transaction_date < get_today()) {
            cur_frm.set_value("transaction_date", "");
            refresh_field("transaction_date");
            frappe.throw(__("Please select a Date from the present or future."));
          }
    },
    schedule_date:function(frm){
        if (frm.doc.schedule_date < get_today()) {
            cur_frm.set_value("schedule_date", "");
            refresh_field("schedule_date");
            frappe.throw(__("Please select a Date from the present or future."));
          }
    }

})
