# Copyright (c) 2022, Brandimic.com and contributors
# For license information, please see license.txt
import frappe

def on_submit(doc, event):
    employee=frappe.get_doc("Employee",doc.employee)
    employee.appraisal=doc.total_score
    employee.save()
    frappe.db.commit()
def on_cancel(doc, event):
    last_appraisal=frappe.get_last_doc('Appraisal', filters={"employee": doc.employee, "docstatus": 1})
    employee=frappe.get_doc("Employee",doc.employee)
    employee.appraisal=last_appraisal.total_score
    employee.save() 
    frappe.db.commit()