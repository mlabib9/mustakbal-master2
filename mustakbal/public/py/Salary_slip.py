from traceback import print_tb
import frappe
import json
import collections
import functools
import operator


def validate(doc, event):

    x = frappe.get_list("Location Based Attendance", filters=[[
        'check_out', 'between', [doc.start_date, doc.end_date]
    ]], fields=["name"])

    d = []
    for element in x:
        doc = frappe.get_doc("Location Based Attendance", element.name)
        print(doc.compensation)
        for elements in doc.compensation:
            d.append({elements.salary_components: int(elements.value)})

    res = dict(functools.reduce(operator.add,
                                map(collections.Counter, d)))

    print(res)
