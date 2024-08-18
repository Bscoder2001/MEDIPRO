$(document).ready(function () {
	includeHTML(function () {

		const content = $('#content');
		console.log(content[0]['innerHTML']);
		function loadModule(moduleId)
		{
			content.load(`modules/${moduleId}.html`, function () {
				content.fadeIn(200);
				$('.custom-form').submit(function (event)
				{
					event.preventDefault();

					var form = $(this);
					var formData = form.serializeArray();

					var isValid = true;
					var nextField = null;
					form.find('input').each(function ()
					{
						if (!$(this).val())
						{
							isValid = false;
							nextField = $(this).prev('label').text().split(":")[0].trim();
							return false;
						}
					});

					if (!isValid)
					{
						$('#validationModal').find('.modal-body').text(`Please fill in the ${nextField} field.`);
						$('#validationModal').modal('show');
						return;
					}

					var localStorageKey = form.attr('id') + '-data';
					var dataToStore = {};
					$.each(formData, function (_, item)
					{
						dataToStore[item.name] = item.value;
					});
					localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));

					$('#successModal').modal('show');

					form[0].reset();
				});

				if (moduleId === 'dashboard')
				{
					initializeCharts();
				}
			});
		}

		loadModule('dashboard');
		$('.sidebar ul li a').on('click', function (event)
		{
			event.preventDefault();
			$('.sidebar ul li a').removeClass("active");
			$(this).addClass("active");

			const moduleId = $(this).attr('id').replace('-link', '');
			content.fadeOut(200, function () {
				content.html('Loading...')
				loadModule(moduleId);
				console.log(moduleId);
			});
		});

		$(document).on('click', '#generate-invoice', function (event)
		{
			event.preventDefault();

			var invoiceHTML = '<h2>Generated Invoice</h2>';

			var formIds = ['billing-form', 'appointment-form', 'inventory-form', 'patient-form'];

			formIds.forEach(function (formId)
			{
				var localStorageKey = formId + '-data';
				var formData = JSON.parse(localStorage.getItem(localStorageKey));

				if (formData)
				{
					invoiceHTML += '<h3 style="text-transform: uppercase;">' + formId.replace('-form', '') + '</h3>';
					invoiceHTML += '<table class="table">';
					$.each(formData, function (key, value) {
						invoiceHTML += '<tr><td style="text-transform: uppercase;"><strong>' + key.replace(/-/g, ' ') + ':</strong></td><td>' + value + '</td></tr>';
					});
					invoiceHTML += '</table>';
				}
				else
				{
					invoiceHTML += '<p>No data found for ' + formId + '.</p>';
				}
			});

			$('#invoiceModal .modal-body').html(invoiceHTML);
			$('#invoiceModal').modal('show');

			$('#invoiceModal').focus();

			window.print();
		});

		function initializeCharts() {
			var ctx = document.getElementById('genderRatioChart').getContext('2d');
			new Chart(ctx, {
				type: 'pie',
				data: {
					labels: ['Male', 'Female', 'Other'],
					datasets: [{
						label: 'Gender Ratio',
						data: [120, 80, 10],
						backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
					}]
				},
				options: {
					responsive: true
				}
			});

			var ctxAppointments = document.getElementById('appointmentsByDeptChart').getContext('2d');
			new Chart(ctxAppointments, {
				type: 'bar',
				data: {
					labels: ['Cardiology', 'Neurology', 'Pediatrics', 'General Surgery', 'Orthopedics'],
					datasets: [{
						label: 'Appointments',
						data: [30, 20, 25, 35, 15],
						backgroundColor: '#36A2EB'
					}]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});

			var ctxMonthly = document.getElementById('monthlyPatientVisitsChart').getContext('2d');
			new Chart(ctxMonthly, {
				type: 'line',
				data: {
					labels: ['January', 'February', 'March', 'April', 'May', 'June'],
					datasets: [{
						label: 'Patient Visits',
						data: [50, 75, 60, 80, 95, 100],
						borderColor: '#FF6384',
						fill: false,
					}]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});

			var ctxInventory = document.getElementById('inventoryLevelsChart').getContext('2d');
			new Chart(ctxInventory, {
				type: 'doughnut',
				data: {
					labels: ['Medicines', 'Equipment', 'Supplies'],
					datasets: [{
						label: 'Inventory Levels',
						data: [120, 60, 30],
						backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
					}]
				},
				options: {
					responsive: true
				}
			});

			var ctxVitalRecords = document.getElementById('vitalRecordsChart').getContext('2d');
			new Chart(ctxVitalRecords, {
				type: 'bar',
				data: {
					labels: ['Total Records', 'Missing Records'],
					datasets: [{
						label: 'Vital Records',
						data: [200, 20],
						backgroundColor: ['#36A2EB', '#FF6384'],
					}]
				},
				options: {
					responsive: true,
					indexAxis: 'y',
					scales: {
						x: {
							beginAtZero: true
						}
					}
				}
			});
		}

	});
});
