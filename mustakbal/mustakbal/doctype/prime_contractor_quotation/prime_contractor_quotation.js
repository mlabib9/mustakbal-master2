// Copyright (c) 2022,   and contributors
// For license information, please see license.txt

frappe.ui.form.on("Prime Contractor Quotation", {
  onload:function(frm){
    console.log(frm.doc.conversion_factor)
    if (frm.doc.conversion_factor){
      

      for (let i in cur_frm.doc.items) {
        console.log(frm.doc.conversion_factor)
        cur_frm.doc.items[i].conversions_factor =frm.doc.conversion_factor
        
        //  frm.get_field("items").grid.grid_rows[i].refresh_field("conversions_factor");
        
      }
    }
    cur_frm.refresh()
  },
 
  setup: function (frm) {
    
    // filter to quotation_to field
    frm.set_query("quotation_to", function () {
      return {
        filters: {
          name: ["in", ["Prime Contractor"]],
        },
      };
    });
    cur_frm.refresh;
  },

  refresh: function (frm) {
    //  convert item to Quotation DOCTYPE
    if (frm.doc.docstatus == 1) {
      frm.add_custom_button(" Create Quotation", (frm) => {
        let d = new frappe.ui.Dialog({
          title: "Conversion Factor",
          fields: [
            { fieldtype: "Section Break" },
            {
              fieldtype: "Float",
              fieldname: "quotation",
              reqd: 1,
              label: __("Conversion Factor"),
            },
            {
              fieldtype: "Link",
              fieldname: "customer",
              label: __("Customer"),
              options: "Customer",

              reqd: 1,
            },
            {
              fieldtype: "Link",
              fieldname: "sales_request",
              label: __("Sales Request"),
              options: "Sales Request",

              reqd: 1,
            },
          ],
          primary_action_label: "Submit",
          primary_action(values) {
            let item = [];
            cur_frm.doc.items.forEach(function (element) {
              
              if (element.rate) {
                element.rate = element.rate * values.quotation;
                element.price_list_rate =
                  element.price_list_rate * values.quotation;
                element.base_price_list_rate =
                  element.base_price_list_rate * values.quotation;
              }

              item.push(element);
            });
            frappe.call({
              method:
                "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.new_quotation",
              args: {
                item: item,
                customer: values.customer,
                tax:cur_frm.doc.taxes,
                additional_discount_percentage:cur_frm.doc.additional_discount_percentage,
                sales_request:values.sales_request
              },
              callback: function (r) {},
            });
            // cur_frm.reload_doc();
            d.hide();
          },
        });
        d.show();
      });
    }
    // collect total of item amount
    let total = 0;
    let qty = 0;

    for (let i in cur_frm.doc.items) {
      total = cur_frm.get_field("items").grid.grid_rows[i].doc.amount + total;
      qty = cur_frm.get_field("items").grid.grid_rows[i].doc.qty + qty;
    }

    if (cur_frm.doc.currency == "USD") {
      let totals = total * cur_frm.doc.conversion_rate;
      cur_frm.set_value("base_total", totals);
    }
    // qty*rate = amount
    for (let i in cur_frm.doc.items) {
      cur_frm.get_field("items").grid.grid_rows[i].doc.amount =
        cur_frm.get_field("items").grid.grid_rows[i].doc.qty *
        cur_frm.get_field("items").grid.grid_rows[i].doc.rate;
      cur_frm.get_field("items").grid.grid_rows[i].refresh_field("amount");
      // rate equal stock_uom_rate
      cur_frm.get_field("items").grid.grid_rows[i].doc.stock_uom_rate =
        cur_frm.get_field("items").grid.grid_rows[i].doc.rate;
    }
    // fetch  data to total-grand_total-rounded_total-total_qty
    cur_frm.set_value("base_total", total);
    // cur_frm.set_value("grand_total", total);
    // cur_frm.set_value("rounded_total", total);
    cur_frm.set_value("total_qty", qty);
    
 

  },
  valid_till:function(frm){
    if (frm.doc.valid_till < get_today()) {
      cur_frm.set_value("valid_till", "");
      refresh_field("valid_till");
      frappe.throw(__("Please select a From Date from the present or future."));
    }
  },
  // currency convert
  conversion_rate: function (frm) {
    if ((frm.doc.currency = "USD")) {
      for (let i in cur_frm.doc.items) {
        cur_frm.get_field("items").grid.grid_rows[i].doc.amount =
          cur_frm.get_field("items").grid.grid_rows[i].doc.qty *
          cur_frm.get_field("items").grid.grid_rows[i].doc.rate;
        cur_frm.save();
        cur_frm.refresh();
      }
    }
  },
  additional_discount_percentage:async function(frm){
    cur_frm.clear_table("taxes"); 
    await frm.save()
    frappe.call({
      method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.additional_discount",
      args: {
        discount_percentage:cur_frm.doc.additional_discount_percentage, 
          prime_name:frm.docname
      },
      callback: function (r) {
        cur_frm.refresh()
      }})
       

  },
  quotation_to: function (frm) {
    cur_frm.refresh();
  },
  
  taxes_and_charges:async function(frm){
    if (!frm.doc.party_name){
     await cur_frm.set_value("taxes_and_charges", "");
      
      frappe.throw("Please Set Party")
    }
    cur_frm.clear_table("taxes"); 
    await frm.save()
   
    frappe.call({
      method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
      args: {
          taxes_name:cur_frm.doc.taxes_and_charges, 
          prime_name:frm.docname
      },
      callback: function (r) {
        cur_frm.refresh()
  }
})}
});

//  auto fetch item attribute by item_code
frappe.ui.form.on(
  "Prime Contractor Quotation Item",
  "item_code",
  function (frm, cdt, cdn) {
    
    let item = locals[cdt][cdn];
    frappe.call({
      method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.get_item",
      args: {
        
        name: item.item_code,
      },
      callback:async function (data) {
        console.log(data.message[0])
        item.item_name = data.message[0].item_name;
        item.description = data.message[0].description;
        item.qty = 1;
        item.stock_uom = data.message[0].stock_uom;
        item.rate = data.message[1];
        item.uom = data.message[0].uoms[0].uom;
        item.conversion_factor = data.message[0].uoms[0].conversion_factor;
        item.stock_uom_rate = item.rate;
        await cur_frm.save()
        await cur_frm.refresh();
        if (frm.doc.additional_discount_percentage){
          cur_frm.clear_table("taxes"); 
          await frm.save()
          frappe.call({
            method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.additional_discount",
            args: {
              discount_percentage:cur_frm.doc.additional_discount_percentage, 
                prime_name:frm.docname
            },
            callback: function (r) {
              cur_frm.refresh()
            }})
        

        if(frm.doc.taxes_and_charges){
     
          cur_frm.clear_table("taxes"); 
          await frm.save()
         frappe.call({
           method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
           args: {
               taxes_name:cur_frm.doc.taxes_and_charges, 
               prime_name:frm.docname
           },
           callback: function (r) {
             
             
         }})}}else{
          if(frm.doc.taxes_and_charges){
     
            cur_frm.clear_table("taxes"); 
            await frm.save()
           frappe.call({
             method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
             args: {
                 taxes_name:cur_frm.doc.taxes_and_charges, 
                 prime_name:frm.docname
             },
             callback: function (r) {
               
               
           }})}

         }
         cur_frm.refresh();
       
      },
    });
    item.amount = item.rate * item.qty;
    item.price_list_rate = item.rate;
    item.base_price_list_rate = item.rate;
 
  }
);
// action if rate change to get amount
frappe.ui.form.on(
  "Prime Contractor Quotation Item",
  "rate",
 async function (frm, cdt, cdn) {
    let item = locals[cdt][cdn];
    item.amount = item.rate * item.qty;
    item.price_list_rate = item.rate;
    item.base_price_list_rate = item.rate;
    await cur_frm.save()
   await cur_frm.refresh();
   if (frm.doc.additional_discount_percentage){
    cur_frm.clear_table("taxes"); 
    await frm.save()
    frappe.call({
      method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.additional_discount",
      args: {
        discount_percentage:cur_frm.doc.additional_discount_percentage, 
          prime_name:frm.docname
      },
      callback: function (r) {
        cur_frm.refresh()
      }})
  

  if(frm.doc.taxes_and_charges){

    cur_frm.clear_table("taxes"); 
    await frm.save()
   frappe.call({
     method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
     args: {
         taxes_name:cur_frm.doc.taxes_and_charges, 
         prime_name:frm.docname
     },
     callback: function (r) {
       
       
   }})}}else{
    if(frm.doc.taxes_and_charges){

      cur_frm.clear_table("taxes"); 
      await frm.save()
     frappe.call({
       method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
       args: {
           taxes_name:cur_frm.doc.taxes_and_charges, 
           prime_name:frm.docname
       },
       callback: function (r) {
         
         
     }})}

   }
    cur_frm.refresh();
  

  }
);
// action if qty change to get amount
frappe.ui.form.on(
  "Prime Contractor Quotation Item",
  "qty",
  async function (frm, cdt, cdn) {
    let item = locals[cdt][cdn];
    item.amount = item.rate * item.qty;
    await cur_frm.save()
   await cur_frm.refresh();
   if (frm.doc.additional_discount_percentage){
    cur_frm.clear_table("taxes"); 
    await frm.save()
    frappe.call({
      method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.additional_discount",
      args: {
        discount_percentage:cur_frm.doc.additional_discount_percentage, 
          prime_name:frm.docname
      },
      callback: function (r) {
        cur_frm.refresh()
      }})
  

  if(frm.doc.taxes_and_charges){

    cur_frm.clear_table("taxes"); 
    await frm.save()
   frappe.call({
     method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
     args: {
         taxes_name:cur_frm.doc.taxes_and_charges, 
         prime_name:frm.docname
     },
     callback: function (r) {
       
       
   }})}}else{
    if(frm.doc.taxes_and_charges){

      cur_frm.clear_table("taxes"); 
      await frm.save()
     frappe.call({
       method: "mustakbal.mustakbal.doctype.prime_contractor_quotation.prime_contractor_quotation.taxes",
       args: {
           taxes_name:cur_frm.doc.taxes_and_charges, 
           prime_name:frm.docname
       },
       callback: function (r) {
         
         
     }})}

   }
    cur_frm.refresh();
  }
);
// action if amount change  to fetch total
frappe.ui.form.on(
  "Prime Contractor Quotation Item",
  "amount",
  function (frm, cdt, cdn) {
    let item = locals[cdt][cdn];
    cur_frm.refresh_field("total");
    cur_frm.refresh()
    cur_frm.save()
  }
);
