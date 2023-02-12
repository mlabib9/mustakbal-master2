import frappe
import frappe.utils
import json


@frappe.whitelist()
def new_prime_contractor_quotation(item, contractor,  order_type, quotation, opportunity,
conversion_factor,additional_discount_percentage=None,taxes_and_charges=None,valid=None):
    doc = frappe.new_doc("Prime Contractor Quotation")
   
    doc.mustakbal_quotation = quotation
    doc.quotation=quotation
    doc.opportunity=opportunity
    doc.conversion_factor=conversion_factor
    doc.party_name = contractor
    doc.valid_till = valid
    doc.order_type = order_type
    

    items = json.loads(item)
    for element in items:
        doc.append("items", element)

       
    doc.flags.ignore_mandatory = True
    doc.save()
    doc.notify_update()
    Url = frappe.utils.get_url_to_form(doc.doctype, doc.name)
    # show message after succues with hyperlink
    return frappe.msgprint('Prime Contractor Quotation Created Successfully  <a href={0} > {1} </a>'.format(Url, doc.name))
