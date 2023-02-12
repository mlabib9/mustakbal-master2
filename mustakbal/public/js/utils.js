function custom_botton(name, group, frm, value) {
  frm.add_custom_button(
    __(name),
    function () {
      frappe.new_doc(name, {});
    },
    __(group)
  );
}

async function assign_dialoge(frm) {
  // Add assignee to tasks dialoge
  let d = new frappe.ui.Dialog({
    title: __("Assign Task"),
    fields: [
      {
        fieldtype: "Link",
        fieldname: "assign_to",
        label: __("Assign To"),
        options: "User",
        default: frm.doc.proposed_assignee,
        reqd: 1,
      },
    ],
    primary_action_label: __("Assign"),
    primary_action(values) {
      assign(cur_frm.doc.doctype, cur_frm.doc.name, values.assign_to);
      d.hide();

      cur_frm.save("Update");
    },
  });
  d.show();
}

function assign(doctype, docname, assignee) {
  // add assignee to any doc
  var assignees = [];
  assignees.push(assignee);
  frappe.call({
    async: false,
    method:
      "mustakbal.mustakbal.doctype.sales_request.sales_request.assign_doc",
    args: {
      doctype: doctype,
      docname: docname,
      assignees: assignees,
    },
    callback: function (r) {},
  });
}

function clear_assign(doctype, docname) {
  frappe.call({
    async: false,
    method:
      "mustakbal.mustakbal.doctype.sales_request.sales_request.clear_assign",
    args: {
      doctype: doctype,
      docname: docname,
    },
    callback: function (r) {},
  });
  cur_frm.save("Update");
}
