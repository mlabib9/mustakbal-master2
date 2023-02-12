// Copyright (c) 2022,   and contributors
// For license information, please see license.txt

frappe.ui.form.on('Visit', {
	refresh: function (frm) {

		frm.set_query("party_type", function () {
			return {
				"filters": {
					"name": ["in", ["Customer", "Lead"]],
				}
			}
		});


	}
});
