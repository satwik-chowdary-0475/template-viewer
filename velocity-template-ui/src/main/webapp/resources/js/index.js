function getRenderPdfUrl() {
    return $('meta[name="baseUrl"]').attr('content') + "/api/render-pdf";
}

function beautifyJson() {
    var jsonInput = $('#jsonInput').val();
    if (jsonInput == "" || jsonInput == undefined) {
        alert("Please add JSON.");
        return false;
    }
    try {
        var json = JSON.parse(jsonInput);
        var beautifiedJson = JSON.stringify(json, null, 4);
        $('#jsonInput').val(beautifiedJson);
    } catch (e) {
        alert("Invalid JSON.");
    }
}

function uploadTemplate(event) {
    var file = event.target.files[0];
    if (file) {
        var formData = new FormData();
        formData.append('file', file);

        var jsonInput = $('#jsonInput').val();
        if (jsonInput == "" || jsonInput == undefined) {
            alert("Please add JSON.");
            return;
        }
        var jsonForm;
        try {
            jsonForm = JSON.parse(jsonInput);
        } catch (e) {
            alert("Invalid JSON.");
            return;
        }
        formData.append('jsonString', JSON.stringify(jsonForm));

        $.ajax({
            url: getRenderPdfUrl(),
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
            success: function(data) {
                console.log("PDF generated successfully");
                var pdfData = 'data:application/pdf;base64,' + data;
                $('#pdfViewer').attr('src', pdfData);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error generating PDF:", textStatus, errorThrown);
                alert("Error generating PDF. Please try again.");
            }
        });
    } else {
        alert("No file chosen.");
    }
}

function init() {
    $('#beautifyJsonButton').click(beautifyJson);
    $('#uploadPdfButton').change(uploadTemplate);
}

$(document).ready(init);
