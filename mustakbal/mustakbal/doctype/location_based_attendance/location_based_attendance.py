# Copyright (c) 2022,   and contributors
# For license information, please see license.txt

import asyncio
import frappe
from frappe.model import document
from frappe.model.document import Document
from frappe.utils import nowdate
from frappe.utils.safe_exec import get_safe_globals
from datetime import datetime


class LocationBasedAttendance(Document):
    def before_save(self):
        checkout= datetime.strptime(self.check_out, '%Y-%m-%d %H:%M:%S')
        checkin= datetime.strptime(self.check_in, '%Y-%m-%d %H:%M:%S')
       
        
        elapsed_day_time=checkout-checkin
        self.elapsed_days=int(elapsed_day_time.days)
        self.elapsed_hours=int(round(elapsed_day_time.total_seconds()/(60*60)))
     
        if checkin >checkout and checkin ==checkout :
            frappe.throw("Check in Can't be >= Check Out")
        if not  self.employee_location :
            frappe.throw("Please Set The City Of Employee")


        
        
    def on_submit(self):
        checkout= datetime.strptime(self.check_out, '%Y-%m-%d %H:%M:%S')
        
        employee=frappe.get_doc('Employee', self.employee)
        for row in self.compensation:
            if row.is_expense_claim==1:
                doc = frappe.new_doc('Expense Claim')
                doc.employee=employee.name
                doc.expense_approver=employee.expense_approver
                doc.append("expenses", {
                "expense_date": checkout.date(),
                "expense_type":"Others",
                "amount":row.value
                    })
                doc.flags.ignore_mandatory = True
                doc.db_update()
                doc.save()
                frappe.msgprint("Expense Claim Created")
       
            if row.is_expense_claim==0:
                doc = frappe.new_doc('Employee Incentive')
                doc.employee=employee.name
                doc.salary_component=row.salary_components
                doc.incentive_amount=row.value
                doc.payroll_date=self.check_out
                doc.flags.ignore_mandatory = True
                doc.db_update()
                doc.save()
                frappe.msgprint("Employee Incentive Created")

        




