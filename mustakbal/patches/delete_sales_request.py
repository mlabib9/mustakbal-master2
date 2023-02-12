# Copyright (c) 2022, Brandimic.com and contributors
# For license information, please see license.txt
import frappe

def execute():
    frappe.delete_doc("Custom Field", "Quotation-sales_request", force=1)
    frappe.delete_doc("Custom Field", "Supplier Quotation-sales_request_", force=1)