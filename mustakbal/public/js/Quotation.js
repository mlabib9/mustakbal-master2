frappe.ui.form.on("Quotation", {
  onload:function(frm){
    if(frm.doc.sales_request){
    frappe.call({
      method: "frappe.client.get",
      async: false,
      args: {
        doctype: "Sales Request",
        name: frm.doc.sales_request,
      },
      callback: function (data) {
        cur_frm.set_value("quotation_to", data.message.contact_form);
        refresh_field("quotation_to");
        cur_frm.set_value("opportunitys", data.message.opportunity);
        refresh_field("opportunitys");
        cur_frm.set_value("party_name", data.message.contact);
        refresh_field("party_name");
        cur_frm.set_value("quotation_to", data.message.contact_form);
        refresh_field("quotation_to");
        cur_frm.save()
        
      },
    });}

  },

  refresh: function (frm) {

    // convert item to Prime Contractor Quotation
    if (frm.doc.docstatus == 1) {
      frm.add_custom_button("Create Prime Contractor Quotation", (frm) => {
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
            {
              fieldtype: "Link",
              fieldname: "Prime_contractor",
              label: __("Prime Contractor "),
              options: "Prime Contractor",

              reqd: 1,
            },
          ],
          primary_action_label: "Submit",
          primary_action(values) {
            console.log(cur_frm.doc.valid_till);
            let item = [];
            cur_frm.doc.items.forEach(function (element) {
              if (element.rate) {
                element.rate = element.rate * values.quotation;
              }

              item.push(element);
            });
            frappe.call({
              method:
                "mustakbal.public.py.quotation.new_prime_contractor_quotation",
              args: {
                item: item,
                contractor: values.Prime_contractor,
                valid: cur_frm.doc.valid_till,
                order_type: cur_frm.doc.order_type,
                quotation: cur_frm.docname,
                opportunity:cur_frm.doc.opportunitys,
                conversion_factor:values.quotation,
                taxes_and_charges:cur_frm.doc.taxes_and_charges,
                additional_discount_percentage:cur_frm.doc.additional_discount_percentage
              },
              callback: function (r) {
                
                
              },
            });
            cur_frm.reload_doc();
            d.hide();
          },
        });
        d.show();
      });
    }
  },
  sales_request_:function(frm){
    frappe.call({
      method: "frappe.client.get",
      async: false,
      args: {
        doctype: "Sales Request",
        name: frm.doc.sales_request_,
      },
      callback: function (data) {
        
        cur_frm.set_value("quotation_to", data.message.contact_form);
        refresh_field("quotation_to");
        cur_frm.set_value("opportunitys", data.message.opportunity);
        refresh_field("opportunitys");
        cur_frm.set_value("party_name", data.message.contact);
        refresh_field("party_name");
        cur_frm.set_value("quotation_to", data.message.contact_form);
        refresh_field("quotation_to");
        cur_frm.save()
        
          
      },
    });

  },
  margin: function (frm) {
    for (let i in cur_frm.doc.items) {
      if(cur_frm.get_field("items").grid.grid_rows[i].doc.switch!= 1){
      cur_frm.get_field("items").grid.grid_rows[i].doc.original_rate =cur_frm.get_field("items").grid.grid_rows[i].doc.rate
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("original_rate")
      cur_frm.get_field("items").grid.grid_rows[i].doc.switch=1
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("switch")}
      
      
      
      
      
      cur_frm.get_field("items").grid.grid_rows[i].doc.margin =
        cur_frm.doc.margin;
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("margin");

      cur_frm.get_field("items").grid.grid_rows[i].doc.rate =
        cur_frm.get_field("items").grid.grid_rows[i].doc.original_rate *
        (1 + cur_frm.doc.margin / 100);
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("rate");

      cur_frm.get_field("items").grid.grid_rows[i].doc.amount =
        cur_frm.get_field("items").grid.grid_rows[i].doc.rate *
        cur_frm.get_field("items").grid.grid_rows[i].doc.qty 
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("amount");

      cur_frm.refresh();
    }
  },
});
//  change margin by row
frappe.ui.form.on("Quotation Item", "margin", function (frm, cdt, cdn) {
  let item = locals[cdt][cdn];

  item.rate = item.net_rate * (1 + item.margin / 100);
  item.amount = item.net_amount * (1 + item.margin / 100);

  frm.refresh();
});


frappe.ui.form.on("Quotation Item", "rate", function (frm, cdt, cdn) {
  let item = locals[cdt][cdn];
  item.amount = item.qty * item.rate
  



  frm.refresh();
});