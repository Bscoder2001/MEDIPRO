$(document).ready(function() {
    const content = $('#content');

    function loadModule(moduleId) {
        content.load(`modules/${moduleId}.html`);
    }

    $('.sidebar ul li a').on('click', function(event) {
        event.preventDefault();
        const moduleId = $(this).attr('id').replace('-link', '');
        loadModule(moduleId);
    });

    content.html('<h1>Welcome to Healthcare ERP</h1><p>Select a module from the left panel to get started.</p>');
});
