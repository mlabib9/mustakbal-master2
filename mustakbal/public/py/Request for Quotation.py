from frappe.desk.form.linked_with import get_linked_docs, get_linked_doctypes
import frappe
import json
from frappe import _
import frappe.utils


def fetch_item_name(doc, event):
    for items in doc.items:
        item = frappe.get_doc('Item', items.item_code)
        items.item_name = item.item_name
        doc.flags.ignore_mandatory = True
    
 
