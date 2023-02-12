import frappe
import frappe.utils
import json
from frappe.model.document import Document


class PrimeContractorQuotation(Document):
    pass


@frappe.whitelist()
def new_quotation(item, customer,tax,additional_discount_percentage,sales_request):
    doc = frappe.new_doc("Quotation")
    doc.additional_discount_percentage=float(additional_discount_percentage)
    doc.party_name = customer
    doc.sales_request=sales_request
    items = json.loads(item)
    taxes = json.loads(tax)
    for taxs in taxes:
        doc.append("taxes", taxs)
    for element in items:
        doc.append("items", element)
    doc.flags.ignore_mandatory = True    
    doc.save()
    Url = frappe.utils.get_url_to_form(doc.doctype, doc.name)
    # show message after succues with hyperlink
    return frappe.msgprint('Quotation Created Successfully  <a href={0} > {1} </a>'.format(Url, doc.name))
@frappe.whitelist()
def taxes(taxes_name,prime_name):
    tax = frappe.get_doc('Sales Taxes and Charges Template', taxes_name)
    prime_contractor=frappe.get_doc('Prime Contractor Quotation', prime_name)
    append_tax_table(prime_contractor,tax.taxes)
    
@frappe.whitelist()
def additional_discount(discount_percentage,prime_name):
    prime_contractor=frappe.get_doc('Prime Contractor Quotation', prime_name)
    prime_contractor.discount_amount=(  prime_contractor.base_total*int(discount_percentage))/100
    prime_contractor.base_net_total=prime_contractor.base_total- ((prime_contractor.base_total*int(discount_percentage))/100)
    prime_contractor.save()
    
    if prime_contractor.taxes_and_charges:
        tax = frappe.get_doc('Sales Taxes and Charges Template', prime_contractor.taxes_and_charges)
        append_tax_table(prime_contractor,tax.taxes)
    

def append_tax_table(prime_contractor,tax_table):
    if prime_contractor.base_net_total ==0.00:
        totals=prime_contractor.base_total
    elif  prime_contractor.base_net_total >0.00 :  
        totals=prime_contractor.base_net_total  
    
   

    tax_amount= (totals*tax_table[0].rate)/100
    total= totals+tax_amount
            
    prime_contractor.append("taxes", {
                "charge_type":"On Net Total",
                "account_head":tax_table[0].account_head ,
                "rate":tax_table[0].rate,
                "tax_amount":tax_amount,
                "total":total,
                "description":tax_table[0].description
            })
    prime_contractor.grand_total=total
    prime_contractor.base_rounded_total=round(total)
    prime_contractor.base_total_taxes_and_charges=tax_amount


    prime_contractor.save()
    prime_contractor.db_update()
        


@frappe.whitelist()
def get_item (name):
    item = frappe.get_doc('Item', name)
    rate=frappe.get_last_doc('Item Price', filters=[["item_code","=",name],["price_list","=","Standard Selling"]])
    return item, rate.price_list_rate
   
