

from frappe.desk.form.linked_with import get_linked_docs, get_linked_doctypes
import frappe
import json
from frappe import _
import frappe.utils


def event_update(doc, event):
    '''
   the function is collect the lead's events and fetch in (lead_activities)table
    '''
   
    docs = get_linked_docs(
        'Lead', doc.name, linkinfo=get_linked_doctypes("Lead"))
    activities = []
    event = []
    eventNames = []

    if 'Event' in docs.keys():
        for element in docs['Event']:
            eventNames.append(element['name'])
        for elements in eventNames:
            event.append(frappe.db.get_value(
                'Event', elements, 'event_category'))

        eventCount = int(event.count("Event"))
        callCount = int(event.count("Call"))
        meetingCount = int(event.count("Meeting"))
        sentreceived_email = int(event.count("Sent/Received Email"))
        otherCount = int(event.count("Other"))
        
        doc.set('lead_activities', [])
        doc.append("lead_activities", {
            'event': eventCount,
            'call': callCount,
            'meeting': meetingCount,
            'sentreceived_email': sentreceived_email,
            'other': otherCount
        })
       
      
