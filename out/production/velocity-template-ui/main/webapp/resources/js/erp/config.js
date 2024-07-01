let channelName
let integration_type
let loginCredentialDataERP

function populateChannelName(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('channel_name');
    const type = urlParams.get('integration_type');
	channelName = page_type;
	integration_type = type;
	validateERPName();
	return false;
}

function getConfigUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/channel";
}

function makeLocationTable(data){
	let $tbody =$('#location-table').find('tbody');
	$tbody.empty();
	let row=''
	for(var i in data){
    		var e = data[i];
		row="<tr>"+
		"<td>"+e+"</td>"+
	    "</tr>";
		$tbody.append(row);
	}
}

function makeChannelMappingTable(data){
	let $tbody =$('#channel-mapping-table').find('tbody');
	$tbody.empty();
	let row=''
	for(var i in data){
    		var e = data[i];
		row="<tr>"+
		"<td>"+e.channelName+"</td>"+
		"<td>"+e.channelCode+"</td>"+
	    "</tr>";
		$tbody.append(row);
	}
}

function getLocations(){
let queryParams = {
                "channelName": channelName
            }
	var url = getConfigUrl() + "/location";
    doAjax(url, 'GET', queryParams, undefined, undefined, makeLocationTable, undefined)
}

function getChanelMappings(){
	var url = getConfigUrl() + "/channel-code";
	let queryParams = {
                    "channelName": channelName
                }
    doAjax(url, 'GET', queryParams, undefined, undefined, makeChannelMappingTable, undefined)
}

function getPushCredentials(){
let queryParams = {
                "channelName": channelName
            }
	var url = getConfigUrl() + "/push-credentials";
    doAjax(url, 'GET', queryParams, undefined, undefined, displayPushCredentials, undefined)
}

function displayPushCredentials(data){
$("#channel-name").append('<label class="col-8 col-md-8 col-lg-8 font-weight-bold col-form-label">'+ channelName+'</label>');
$("#login-credentials-username").append('<label class="col-6 col-md-8 col-lg-9 font-weight-bold col-form-label">'+ data.userName+'</label>');
$("#login-credentials-password").append('<label class="col-6 col-md-8 col-lg-9 font-weight-bold col-form-label">'+ data.password+'</label>');
}

function getLoginCredentials(){
let queryParams = {
                "channelName": channelName
            }
	var url = getConfigUrl() + "/login-credentials";
        doAjax(url, 'GET', queryParams, undefined, undefined, displayLoginCredentials, undefined)
}

function displayLoginCredentials(data){
    loginCredentialDataERP=data
    for (var key in data) {
        $("#login-credentials").append('<div class="form-group row"><div class="col-md-3 form-label-group">' + key + '</div><div class="col-md-6 form-label-group"><input class="form-control isRequired3" value="'+ data[key] +'" type="text" id="'+ key + '" disabled></div></div>');
    }
    if(!(Object.keys(data).length === 0 && data.constructor === Object)) {
        if (integration_type == 'OTHERS') {
            $("#login-credentials").append('<div class="offset-md-4 offset-lg-1 col">' +
                '<button class="btn btn-success " type="button" onclick="testCredentials()">Test Credentials</button>' +
                '<button type="button" class="btn btn-primary offset-md-1"  id="update-credential-modal-btn" data-toggle="modal" data-target="#update-credential-modal" onclick="fillCredentialDataInUpdateModalERP()">Update credentials</button></div>');
        } else {
            $("#login-credentials").append('<div class="offset-md-4 offset-lg-3 col">' +
                '<button type="button" class="btn btn-primary "  id="update-credential-modal-btn" data-toggle="modal" data-target="#update-credential-modal" onclick="fillCredentialDataInUpdateModalERP()" >Update credentials</button></div>');
        }
    }
}

function addLocation(){
	if($('#location-form input[name=name]').val().trim() == ""){
        notifyWarn({"title": "Warning", "value": "Please enter Name"});
        return false;
    }
    if($('#location-form input[name=email]').val().trim() == ""){
        notifyWarn({"title": "Warning", "value": "Please enter email"});
        return false;
    }
    if($('#location-form input[name=country]').val()==""){
        notifyWarn({"title": "Warning", "value": "Please enter country"});
         return false;
     }
    if($('#location-form input[name=zip]').val()==""){
        notifyWarn({"title": "Warning", "value": "Please enter zip"});
        return false;
    }


    var $form = $("#location-form");
    var json = toJson($form);
    var json2 = convertToLocationForm(json, channelName);
    var url = getConfigUrl() + "/location";

    $("#location-form")[0].reset();
    $('#add-location-modal').modal('toggle');
    doAjax(url, 'POST', null, json2, undefined, undefined, undefined)

}

function addChannelMapping(){

    if($('#channel-mapping-form input[name=channelCode]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter Channel Code"});
		return false;
	}
	if($('#channel-mapping-form input[name=channelName]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter Channel Name"});
		return false;
	}
	$('#add-channel-mapping-modal').modal('toggle');
	var url = getConfigUrl() + "/channel-code";
	const urlParams = new URLSearchParams(window.location.search);
    $('#channel-mapping-form input[name=erpChannelName]').val(urlParams.get('channel_name'));
	var $form = $("#channel-mapping-form");
    var json = toJson($form);
    doAjax(url, 'POST', undefined, json, undefined, getChanelMappings, undefined)
}

function getERPName(){
/*var url = getConfigUrl() + "/erp";
    doAjax(url, 'GET', null, undefined, undefined, validateERPName, undefined)*/
    validateERPName(channelName);
}

function validateERPName(){
    getLocations();
        	getChanelMappings();
        	getPushCredentials();
        	getLoginCredentials();
}

function testCredentials(){
let queryParams = {
                "channelName": channelName,
                "channelType": "MARKETPLACE"
            }
	var url = getConfigUrl() + "/test-credentials";
        doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
}

function openAddLocationModal(){
    $("#location-form")[0].reset();
	$('#add-location-modal').modal('toggle');
}

function openAddChannelMappingModel(){
    $("#channel-mapping-form")[0].reset();
	$('#add-channel-mapping-modal').modal('toggle');
}
function fillCredentialDataInUpdateModalERP(){
    $('#update-credential-form').html("")
    for (var key in loginCredentialDataERP) {
        $('#update-credential-form').append(`<div class="form-group row"><div class="col-md-3 form-label-group"> ${key} </div><div class="col-md-6 form-label-group">
			<input class="form-control" id="input-${key}" type="text"></div></div>`)
        $("#input-" + key)?.val(loginCredentialDataERP[key]);
    }
}
function updateCredentials(){
    let newJson={};
    for (var key in loginCredentialDataERP){
        let val = $("#input-" + key).val();
        if(!val){
            notifyWarn({"title": "Warning", "value": "Fill all credentials"});
            return;
        }
        newJson[key]= val;
    }
    var updateForm = new Object();
    updateForm.channelName = channelName;
    updateForm.channelType = "ERP";
    updateForm.credentialMap = newJson;
    updateForm.integrationType = integration_type
    var url = getConfigUrl() + "/login-credentials";
    doAjax(url, 'PUT', undefined, updateForm, undefined, refreshPage, undefined)

}
function refreshPage(){
    location.reload()
}
//INITIALIZATION CODE
function init(){
	$('#add-new-location').click(openAddLocationModal);
	$('#add-location').click(addLocation);
	$('#refresh-locations').click(getLocations);
    $('#add-new-channel-mapping').click(openAddChannelMappingModel);
    $('#add-channel-mapping').click(addChannelMapping);
    $('#refresh-channel-mapping').click(getChanelMappings);
    $('#update-credentials').click(updateCredentials)
}

$(document).ready(init);
$(document).ready(populateChannelName);
