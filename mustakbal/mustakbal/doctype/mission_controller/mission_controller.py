# Copyright (c) 2022,   and contributors
# For license information, please see license.txt

import asyncio
import frappe
from frappe.model import document
from frappe.model.document import Document
from frappe.utils import nowdate
from frappe.utils.safe_exec import get_safe_globals


class MissionController(Document):
    def before_save(self):
        for row in self.compensation:
            if row.fixed== 1 and row.condition:
                print(row.idx)
                row.condition = None
                self.db_update()
                self.save()
                
                frappe.msgprint(f"row {row.idx} has Fixed Value")
        if self.to == self.froms :
            frappe.throw("Same Destination")        
    
       
        


@frappe.whitelist()
def get_data(name, froms,to):
    doc = frappe.get_doc('Location Based Attendance', name).as_dict()
    print(doc)
    
    documents =frappe.get_last_doc('Mission Controller', filters=[["froms","=",froms],["to","=",to]])
    print(documents)
    value = []
    for row in documents.get("compensation"):

        if row.fixed ==1:
           
            print("*"*20)
            value.append( {"salary_components": row.salary_components, "value": row.value,
              "is_expense_claim": row.is_expense_claim})
        elif frappe.safe_eval(row.condition, None, get_context(doc)):
            value.append(
                {"salary_components": row.salary_components, "value": row.value, "is_expense_claim": row.is_expense_claim})

    return value


def get_context(doc):
    return {
        "doc": doc,

        "frappe": frappe._dict(utils=get_safe_globals().get("frappe").get("utils")), }
