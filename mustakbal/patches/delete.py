# Copyright (c) 2022, Brandimic.com and contributors
# For license information, please see license.txt
import frappe

def execute():
    frappe.delete_doc("Custom Field", "Lead-end_date", force=1)
    frappe.delete_doc("Custom Field", "Lead-actual_date", force=1)