// Copyright (c) 2022,   and contributors
// For license information, please see license.txt
frappe.require("assets/mustakbal/js/utils.js");
frappe.ui.form.on("Sales Request", {
  refresh: function (frm) {
    
    // remove add row and delete row
    frm.get_field("pending_reference").grid.cannot_add_rows = true;

    //   hide add assignee sign
    frm.assign_to.btn.addClass("hidden");
    document.getElementsByClassName("form-assignments")[0].style.cssText +=
      " pointer-events: none;";
    // add Open button (status == New)
    if (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "New") {
      frm.add_custom_button(__("Open"), function () {
        cur_frm.set_value("sales_request_status", "Open");
        refresh_field("sales_request_status");
        cur_frm.save("Update");
        cur_frm.refresh();
      });
    }
    // add Assign button (status == Open)
    if (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Open") {
      frm.add_custom_button(__("Assign"), function () {
        assign_dialoge(frm);
      });
    }
    // add Clear Assignee button (status == Open)
    if (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Open") {
      frm.add_custom_button(__("Clear Assignee"), function () {
        clear_assign(cur_frm.doc.doctype, cur_frm.doc.name);
      });
    }
    // add Apply Assignee button (status == Open)
    if (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Open") {
      frm.add_custom_button(__("Apply"), function () {
        frm.set_value("sales_request_status", "Assigned");

        cur_frm.save("Update");
        cur_frm.refresh();
      });
    }
    if (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Assigned") {
      frm.add_custom_button(__("In Progress "), function () {
        frm.set_value("sales_request_status", "IN Progress");

        cur_frm.save("Update");
        cur_frm.refresh();
      });
    }

    // add Pending button (status == IN Progress")
    if (
      frm.doc.docstatus == 1 &&
      frm.doc.sales_request_status == "IN Progress"
    ) {
      frm.add_custom_button(__("Convert to Pending"), function () {
        // add dialog
        let d = new frappe.ui.Dialog({
          title: __("Pending"),
          fields: [
            {
              fieldtype: "Text",
              fieldname: "reason",
              label: __("Reason"),

              reqd: 1,
            },
            {
              fieldtype: "Datetime",
              fieldname: "deadline",
              label: __("Deadline"),
              reqd: 1,
             
            },
          ],
          primary_action_label: __("Assign"),
          primary_action(values) {
            if (values.deadline <  frappe.datetime.get_today()){
              frappe.msgprint(__("Please select Datetime in the present or future."))
            }else{
            // set value to deadline and reason
           
            cur_frm.set_value("dead_line", values.deadline);
            refresh_field("dead_line");
            cur_frm.set_value("reason", values.reason);
            refresh_field("reason");
            cur_frm.set_value("sales_request_status", "Pending");
            refresh_field("sales_request_status");
            frm.add_child("pending_reference", {
              dead_line: values.deadline,
              reason: values.reason,
            });
            cur_frm.save("Update");
            cur_frm.refresh();
            d.hide();}
          },
        });
        d.show();
      });
    }

    if (
      frm.doc.docstatus == 1 &&
      frm.doc.sales_request_status == "Pending" &&
      frappe.user_roles.indexOf("Sales Manager") != -1
    ) {
      frm.add_custom_button(__(" Pending Done"), function () {
        cur_frm.set_value("reason", "");
        refresh_field("reason");
        cur_frm.set_value("dead_line", "");
        refresh_field("dead_line");
        frm.set_value("sales_request_status", "IN Progress");

        cur_frm.save("Update");
        cur_frm.refresh();
      });
    }
    // add set quotation button (status == IN Progress")
    if (
      frm.doc.docstatus == 1 &&
      frm.doc.sales_request_status == "IN Progress"
    ) {
      frm.add_custom_button(__("Set Quotation"), function () {
        let d = new frappe.ui.Dialog({
          title: __("Pending"),
          fields: [
            {
              fieldtype: "Link",
              fieldname: "quotation",
              label: __("Quotation"),
              options: "Quotation",
              reqd: 1,
            },
          ],
          primary_action_label: __("Assign"),
          primary_action(values) {
            
            cur_frm.set_value("quotation", values.quotation);
            refresh_field("quotation");
            cur_frm.save("Update");
            cur_frm.refresh();

            d.hide();
          },
        });
        d.show();
      });
    }
    //  add End button with two state (done - rejected )
    if (
      (frm.doc.docstatus == 1 &&
        frm.doc.sales_request_status == "IN Progress") ||
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Open") ||
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Pending") ||
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "New")
    ) {
      frm.add_custom_button(__("End Sales Request"), function () {
        let d = new frappe.ui.Dialog({
          title: __("End Sales Request"),
          fields: [
            {
              fieldtype: "Select",
              fieldname: "result",
              label: __("Result"),
              options: ["Done", "Rejected"],
              reqd: 1,
            },
            {
              fieldtype: "Text",
              fieldname: "reason",
              label: __("Reason"),
              depends_on: "eval:doc.result==='Rejected'",
            },
          ],
          primary_action_label: __("Assign"),
          primary_action(values) {
            
            if (values.result == "Done") {
              cur_frm.set_value("sales_request_status", "Done");
              refresh_field("sales_request_status");
              cur_frm.refresh();
              cur_frm.save("Submit");
            } else if (values.result == "Rejected") {
              cur_frm.set_value("sales_request_status", "Rejected");
              refresh_field("sales_request_status");
              cur_frm.set_value("rejected_reason", values.reason);
              refresh_field("rejected_reason");
              cur_frm.save("Update");
              cur_frm.refresh();
            }

            d.hide();
          },
        });
        d.show();
      });
    }
    // add 4 button in create group show if doc'state (Done)
    if (
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Done") ||
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "Pending") ||
      (frm.doc.docstatus == 1 && frm.doc.sales_request_status == "IN Progress")
    ) {
      frm.add_custom_button(
        __("Quotation"),
        function () {
          frappe.new_doc("Quotation", {
            party_name: cur_frm.doc.contact,
            quotation_to:cur_frm.doc.contact_form,
            opportunitys: cur_frm.doc.opportunity,
            sales_request_: cur_frm.docname,
          });
        },
        __("Create")
      );
      frm.add_custom_button(
        __("Survey Request"),
        function () {
          // cur_frm.save()
          frappe.call({
            method: "mustakbal.mustakbal.doctype.sales_request.sales_request.create_survey_request",
            args: {
              docname:cur_frm.docname,
              contact_form:cur_frm.doc.contact_form,
              opportunity:cur_frm.doc.opportunity,
              contact:cur_frm.doc.contact,
              opportunity_name:cur_frm.doc.opportunity_name,
              project_components:cur_frm.doc.project_component
            },
            callback: function (r) {
             
            }})
         
   

        },
        __("Create")
      );
      frm.add_custom_button(
        __("Request For Quotation"),
        function () {
          frappe.new_doc("Request for Quotation", {
            sales_request: cur_frm.docname,
          });
        },
        __("Create")
      );
      frm.add_custom_button(
        __("Supplier Quotation"),
        function () {
          frappe.new_doc("Supplier Quotation", {
            sales_request: cur_frm.docname,
          });
        },
        __("Create")
      );
    }
    frm.set_query("contact_form", function () {
      return {
        filters: [
          ["name", "in", ["Customer","Lead"]],

        ],
      };
    });
 

  },
  deadline: function (frm) {
    if (frm.doc.deadline < get_today()) {
      cur_frm.set_value("deadline", "");
      refresh_field("deadline");
      frappe.throw(__("Please select a From Date from the present or future."));
    }
  },
});
