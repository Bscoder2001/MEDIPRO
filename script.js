$(document).ready(function() {

    const content = $('#content');

    // Function to load module content dynamically
    function loadModule(moduleId) {
        content.load(`modules/${moduleId}.html`, function() {
            // Set up form submission handling for dynamically loaded forms
            $('.custom-form').submit(function(event) {
                event.preventDefault(); // Prevent default form submission

                var form = $(this); // Current form
                var formData = form.serializeArray(); // Serialize form data as an array of objects

                // Validate form fields
                var isValid = true;
                var nextField = null;
                form.find('input').each(function() {
                    if (!$(this).val()) {
                        isValid = false;
                        nextField = $(this).prev('label').text().split(":")[0].trim(); // Get label of next empty field
                        return false; // Exit each loop early
                    }
                });

                if (!isValid) {
                    // Show Bootstrap modal with next field name
                    $('#validationModal').find('.modal-body').text(`Please fill in the ${nextField} field.`);
                    $('#validationModal').modal('show');
                    return; // Exit submit handler if form is not valid
                }

                // Store data in localStorage
                var localStorageKey = form.attr('id') + '-data';
                var dataToStore = {};
                $.each(formData, function(_, item) {
                    dataToStore[item.name] = item.value;
                });
                localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));

                // Display success message (Bootstrap modal)
                $('#successModal').modal('show');

                // Optionally, you can clear the form after successful submission
                form[0].reset();
            });
        });
    }

    // Handle click events on sidebar links
    $('.sidebar ul li a').on('click', function(event) {
        event.preventDefault();
        $('.sidebar ul li a').removeClass("active");
        $(this).addClass("active");
        
        const moduleId = $(this).attr('id').replace('-link', '');
        content.html('Loading...');
        loadModule(moduleId);
    });

    // Function to generate and display invoice
    $(document).on('click', '#generate-invoice', function(event) {
        event.preventDefault();

        var invoiceHTML = '<h2>Generated Invoice</h2>';

        // Fetch data from localStorage for all forms
        var formIds = ['billing-form', 'appointment-form', 'inventory-form', 'patient-form']; // List of form IDs

        formIds.forEach(function(formId) {
            var localStorageKey = formId + '-data';
            var formData = JSON.parse(localStorage.getItem(localStorageKey));

            if (formData) {
                invoiceHTML += '<h3 style="text-transform: uppercase;">' + formId.replace('-form', '') + '</h3>';
                invoiceHTML += '<table class="table">';
                $.each(formData, function(key, value) {
                    invoiceHTML += '<tr><td style="text-transform: uppercase;"><strong>' + key.replace(/-/g, ' ') + ':</strong></td><td>' + value + '</td></tr>';
                });
                invoiceHTML += '</table>';
            } else {
                invoiceHTML += '<p>No data found for ' + formId + '.</p>';
            }
        });

        // Display invoice content in the modal
        $('#invoiceModal .modal-body').html(invoiceHTML);
        $('#invoiceModal').modal('show');

        // Focus the modal for printing
        $('#invoiceModal').focus();

        // Print function
        window.print();
    });

    // Display all stored data in console for debugging
    console.log(JSON.parse(localStorage.getItem('patient-form-data')));
});
