import frappe
import json
from frappe import _
import frappe.utils


def fetch_item_name(doc, event):
    for items in doc.items:
        item = frappe.get_doc('Item', items.item_code)
        items.item_name = item.item_name


@frappe.whitelist()
# function to  move to Quotation
def make_quotation(items,names):
    # items get from listview_settings of "Supplier Quotation" by frappe call
    doc = frappe.new_doc('Quotation')
    validate_duplicate_currency(names)
    name=json.loads(names)
    
    currency=frappe.db.get_value('Supplier Quotation', name[0], 'currency')
    exchange_rate=frappe.db.get_value('Supplier Quotation', name[0], 'conversion_rate')
    if not  currency=="EGP":
        doc.currency = currency
        doc.conversion_rate=exchange_rate
      
       
    # convert str object to dict
    items = json.loads(items)
    # loop for element in items
    for element in items:
        
        # add element to items
        doc.append("items", element)
    doc.flags.ignore_mandatory = True
    doc.insert()
    #  return frappe msg with name of Quotation by hyperlink
    Url = frappe.utils.get_url_to_form(doc.doctype, doc.name)
    return frappe.msgprint('<a href={0} >Quotation {1}</a>'.format(Url, doc.name))

def validate_duplicate_currency(names):
    currency_list=[]
    
    for name in json.loads(names):
        currency_list.append(frappe.db.get_value('Supplier Quotation', name, 'currency'))
    
    curreny=set(currency_list)
   
    if len(curreny)>1:
        frappe.throw("Can't Create Quotation For Multiple Currency Type")
    