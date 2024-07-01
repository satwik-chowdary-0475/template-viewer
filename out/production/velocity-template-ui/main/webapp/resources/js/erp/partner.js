function getPartnerUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/partner";
}

var partnerType="";
$('#select-partner-type').on('change',function(){
	partnerType = $("#select-partner-type option:selected").text();
});


function getQueryParams(partnerCode){
	let queryParams
    if(partnerType.toLowerCase() == "vendor"){
         queryParams = {
            "vendorCode": partnerCode
        }
    }
    if(partnerType.toLowerCase() == "customer"){
         queryParams = {
            "customerCode": partnerCode
        }
    }
    return queryParams;
}

function openAddPartnerModal(){
    if(partnerType =="" || partnerType=="Select Partner Type"){
		notifyWarn({"title": "Warning", "value": "Please select Partner Type"});
    }
    else{
        $("#add-partner-form")[0].reset();
        $('#add-partner-modal').modal('toggle');
    }
}

function addPartner(){
	if($('#add-partner-form input[name=partnerCode]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter PartnerCode"});
		return false;
	}
	if($('#add-partner-form input[name=partnerName]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter partner Name"});
		return false;
	}
	if($('#add-partner-form input[name=country]').val()==""){
    		notifyWarn({"title": "Warning", "value": "Please =enter country"});
            return false;
    }
	if($('#add-partner-form input[name=zip]').val()==""){
		notifyWarn({"title": "Warning", "value": "Please enter zip"});
		return false;
	}

	$('#add-partner-modal').modal('toggle');
	var url = getPartnerUrl() + "/add-" + partnerType.toLowerCase();
	var $form = $("#add-partner-form");
	var json = toJson($form);
    json.isExcessGrnAllowed = document.getElementById("partner-isExcessGrnAllowed").checked;
	doAjax(url, 'POST', null, json, undefined, undefined, undefined)
}

function getPartnerList(){
    if(partnerType =="" || partnerType=="Select Partner Type"){
        notifyWarn({"title": "Warning", "value": "Please select Partner Type"});
    }
    else{
        var url = getPartnerUrl() + "/get-" + partnerType.toLowerCase();
        doAjax(url, 'GET', undefined, undefined, undefined, displayPartnerList, undefined)
	}
}

//UI DISPLAY METHODS
function displayPartnerList(data){
	var $thead = $('#partner-table').find('thead');
    var $tbody = $('#partner-table').find('tbody');
    $thead.empty();
    var row='<tr>'
            + '<th scope="col" style="width: 20%;">PartnerCode</th>'
            + '<th scope="col" style="width: 15%;">Name</th>'
            + '<th scope="col" style="width: 35%;">Address</th>'
            + '<th scope="col" style="width: 35%;">IsExcessGrnAllowed</th>'
            + '<th scope="col" style="width: 30%;"></th>'
        + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		e.mrp = (Number(e.mrp)*100)/100;
		e.mrp = (e.mrp).toFixed(2)
		var buttonHtml = '<button class="btn-sm btn btn-outline-primary" id="view-locations" onclick="openPartnerLocationModal(\'' + e.partnerCode + '\')">Locations</button>  <button class="btn-sm btn btn-outline-primary" id="add-location" onclick="openAddPartnerLocationModal(\'' + e.partnerCode + '\')">Add Location</button>  <button class="btn-sm btn btn-outline-primary" onclick="audit(\'partner\',' + e.partnerId + ')">History</button>';
		var row = '<tr>'
        		+ '<td>' + e.partnerCode + '</td>'
        		+ '<td>' + e.partnerName + '</td>'
        		+ '<td>' + e.line1 + " " + e.line2  + " " + e.line3 + " " + e.city + " " + e.state + " " + e.country
        		    + " " + e.zip + '</td>'
        		+ '<td>' + (e.isExcessGrnAllowed?"Yes":"No") + '</td>'
        		+ '<td>' + buttonHtml + '</td>'
        		+ '</tr>';
        $tbody.append(row);
	}
}

function openAddPartnerLocationModal(partnerCode){
    $("#add-partner-location-form")[0].reset();
    $("#add-partner-location-form input[name=partnerCode]").val(partnerCode);
	$('#add-partner-location-modal').modal('toggle');
}

function createPartnerLocation(partnerCode){
    if($('#add-partner-location-form input[name=locationCode]').val()==""){
		notifyWarn({"title": "Warning", "value": "Please select Partner Type"});
		return false;
	}

	if($('#add-partner-location-form input[name=gstin]').val()==""){
		notifyWarn({"title": "Warning", "value": "Please select Partner Type"});
        return false;
    }
	$('#add-partner-location-modal').modal('toggle');
	var url = getPartnerUrl() + "/add-" + partnerType.toLowerCase() + "-location";
	var $form = $("#add-partner-location-form");
	var $form2 = $("#billing-address");
	var $form3 = $("#shipping-address");
	var json = toJson($form);
    var json2 = toJson($form2);
    var json3 = toJson($form3);
	json = concatJson(json, json2, json3);

	doAjax(url, 'POST', getQueryParams($("#add-partner-location-form input[name=partnerCode]").val()), json, undefined, undefined, undefined)
}

function concatJson(json, json2, json3){
	delete json.city;
    delete json.country;
    delete json.email;
    delete json.line1;
    delete json.line2;
    delete json.line3;
    delete json.name;
    delete json.phone;
    delete json.state;
    delete json.zip;
    json.shippingAddress = json3;
    json.billingAddress = json2;
    return json;
}

function openPartnerLocationModal(partnerCode){
    var url = getPartnerUrl() + "/get-" + partnerType.toLowerCase() + "-locations";
    doAjax(url, 'GET', getQueryParams(partnerCode), undefined, undefined, displayLocationList, undefined)
	$('#view-location-modal').modal('toggle');
}

function displayLocationList(data){
    var $thead = $('#location-table').find('thead');
    var $tbody = $('#location-table').find('tbody');
    $thead.empty();
    var row='<tr>'
            + '<th scope="col" style="width: 20%;">PartnerLocationCode</th>'
            + '<th scope="col" style="width: 10%;">gstIn</th>'
            + '<th scope="col" style="width: 30%;">Shipping Address</th>'
            + '<th scope="col" style="width: 30%;">Billing Address</th>'
            + '<th scope="col" style="width: 10%;"></th>'
        + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
        var buttonHtml = '<button class="btn-sm btn btn-outline-primary" onclick="audit(\'partner-location\',' + e.partnerLocationId + ')">History</button>';
		var row = '<tr>'
        		+ '<td>' + e.partnerLocationCode + '</td>'
        		+ '<td>' + e.gstIn + '</td>'
        		+ '<td>' + e.shippingAddress.line1 + " " + e.shippingAddress.line2  + " " + e.shippingAddress.line3 + " "
        		+ e.shippingAddress.city + " " + e.shippingAddress.state + " " + e.shippingAddress.country  +
        		" " + e.shippingAddress.zip + '</td>'
        		+ '<td>' + e.billingAddress.line1 + " " + e.billingAddress.line2  + " " + e.billingAddress.line3 + " "
                + e.billingAddress.city + " " + e.billingAddress.state + " " + e.billingAddress.country  +
                " " + e.billingAddress.zip + '</td>'
        		+ '<td>' + buttonHtml + '</td>'
        		+ '</tr>';
        $tbody.append(row);
	}
}

//INITIALIZATION CODE
function init(){
	$('#show-partners').click(getPartnerList);
	$('#add-partner').click(openAddPartnerModal);
	$('#create-partner').click(addPartner);
	$('#create-partner-location').click(createPartnerLocation);
	$('#add-location').click(openAddPartnerLocationModal);
}

$(document).ready(init);
