from . import __version__ as app_version

app_name = "mustakbal"
app_title = "Mustakbal"
app_publisher = " "
app_description = "this app was made by Brandimic "
app_email = "info@brandimic.com"
app_license = "MIT"
required_apps = ["hrms"]


# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/mustakbal/css/mustakbal.css"
# app_include_js = "/assets/mustakbal/js/mustakbal.js"

# include js, css files in header of web template
# web_include_css = "/assets/mustakbal/css/mustakbal.css"
# web_include_js = "/assets/mustakbal/js/mustakbal.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "mustakbal/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views


# doctype_js = {'Supplier Quotation': "public/js/Supplier_Quotation.js"}
doctype_list_js = {"Quotation": "public/js/Quotation.js", 'Supplier Quotation':
                   "public/js/Supplier_Quotation.js", "Opportunity": "public/js/Opportunity.js",
                   "Project": "public/js/Project.js", "Leave Period": "public/js/Leave Period.js",
                   "Purchase Receipt": "public/js/Purchase Receipt.js", "Sales Invoice": "public/js/Sales Invoice.js",
                   "Perform Invoice": "public/js/Perform Invoice.js", "Request for Quotation": "public/js/Request for Quotation.js", "Survey Request": "public/js/Survey Request.js", "Employee": "public/js/Employee.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "mustakbal.utils.jinja_methods",
#	"filters": "mustakbal.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "mustakbal.install.before_install"
# after_install = "mustakbal.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "mustakbal.uninstall.before_uninstall"
# after_uninstall = "mustakbal.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "mustakbal.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    #	"*": {
    #		"on_update": "method",
    #		"on_cancel": "method",
    #		"on_trash": "method"
    #	}
    "Supplier Quotation": {
        "refresh": "public/py/make_quotation"
    },
    "Quotation": {
        "refresh": "public/py/new_prime_contractor_quotation"
    },
    "Salary Slip": {
        "validate": "mustakbal.public.py.Salary_slip.validate"
    },
    "Lead": {
        "onload": "mustakbal.public.py.lead.event_update"
    },
    "Request for Quotation": {
        "before_save": "mustakbal.public.py.Request for Quotation.fetch_item_name",

    },
    "Supplier Quotation": {
        "before_save": "mustakbal.public.py.supplier_quotation.fetch_item_name",
    },
    "Opportunity": {
        "refresh": "mustakbal.public.py.opportunity_dashboard.get_data",
    },
    "Appraisal": {
        "on_submit": "mustakbal.public.py.appraisal.on_submit",
        "on_cancel": "mustakbal.public.py.appraisal.on_cancel",
    },
  




}

# Scheduled Tasks
# ---------------

# scheduler_events = {
#     "cron": {
#         "* * * * *": ["mustakbal.public.py.lead.event_update"]
#     }
# }

# Testing
# -------

# before_tests = "mustakbal.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "mustakbal.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "mustakbal.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"mustakbal.auth.validate"
# ]
