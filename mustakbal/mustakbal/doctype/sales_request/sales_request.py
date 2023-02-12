# Copyright (c) 2022,   and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
from frappe import _
import frappe
from frappe.model.document import Document
import frappe.utils
import json

class SalesRequest(Document):

    def get_data():
        return {
            'fieldname': 'appointment',
            'non_standard_fieldnames': {
                'Patient Medical Record': 'reference_name'
            },
            'transactions': [
                {
                    'label': _('Consultations'),
                    'items': ['Patient Encounter', 'Vital Signs', 'Patient Medical Record']
                }
            ]
        }


@frappe.whitelist()
def assign_doc(doctype, docname, assignees):
    from frappe.desk.form import assign_to

    assign_to.add(
        {
            "assign_to": assignees,
            "doctype": doctype,
            "name": docname
        }
    )
    return


@frappe.whitelist()
def clear_assign(doctype, docname):
    from frappe.desk.form import assign_to
    assign_to.clear(doctype, docname)
@frappe.whitelist()
def create_survey_request(docname,opportunity,contact,opportunity_name,project_components,contact_form):
        doc = frappe.new_doc("Survey Request")
        doc.opportunity=opportunity
        if contact_form=="Customer":
            doc.customer=contact
        doc.opportunity_name=opportunity_name
        doc.sales_request=docname
        components = json.loads(project_components)
        for element in components:
            doc.append("project_components", element)
        doc.flags.ignore_mandatory = True
        doc.save()
        doc.notify_update()
        Url = frappe.utils.get_url_to_form(doc.doctype, doc.name)  
        return frappe.msgprint('Survey Request Created Successfully  <a href={0} > {1} </a>'.format(Url, doc.name))  