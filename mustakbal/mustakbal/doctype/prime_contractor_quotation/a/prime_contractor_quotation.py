import frappe
from frappe.model.document import Document

class PrimeContractorQuotation(Document):
	pass



@frappe.whitelist()
def new_docoument():
    doc = frappe.new_doc("Quotation")
    doc.append("items",{
		"item_name":"asdasd"

	  })
    return frappe.msgprint("Information Request Created ") 