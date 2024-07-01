let channelName
let integration_type
let loginCredentialData
function populateChannelName(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('channel_name');
    const type = urlParams.get('integration_type');
	channelName = page_type;
	integration_type = type;
	validateMarketplaceName();
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

function getLocations(){
    let queryParams = {
                "channelName": channelName
            }
	var url = getConfigUrl() + "/location";
        doAjax(url, 'GET', queryParams, undefined, undefined, makeLocationTable, undefined)
       return false;
}

function getPushCredentials(){
let queryParams = {
                "channelName": channelName
            }
	var url = getConfigUrl() + "/push-credentials";
        doAjax(url, 'GET', queryParams, undefined, undefined, displayPushCredentials, undefined)
}

function displayPushCredentials(data){
$("#channel-name").append('<label class="col-6 col-md-8 col-lg-9 font-weight-bold col-form-label">'+ channelName+'</label>');
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
loginCredentialData=data
for (var key in data) {
  $("#login-credentials").append('<div class="form-group row"><div class="col-md-3 form-label-group">' + key + '</div><div class="col-md-6 form-label-group"><input class="form-control isRequired3" value="'+ data[key] +'" type="text" id="'+ key + '" disabled></div></div>');
}

if(!(Object.keys(data).length === 0 && data.constructor === Object)) {
	if (integration_type == 'OTHERS') {
		$("#login-credentials").append('<div class="offset-md-4 offset-lg-1 col">' +
			'<button class="btn btn-success " type="button" onclick="testCredentials()">Test Credentials</button>' +
			'<button type="button" class="btn btn-primary offset-md-1"  id="update-credential-modal-btn" data-toggle="modal" data-target="#update-credential-modal" onclick="fillCredentialDataInUpdateModal()">Update credentials</button></div>');
	} else {
		$("#login-credentials").append('<div class="offset-md-4 offset-lg-3 col">' +
			'<button type="button" class="btn btn-primary "  id="update-credential-modal-btn" data-toggle="modal" data-target="#update-credential-modal" onclick="fillCredentialDataInUpdateModal()" >Update credentials</button></div>');
	}
}
}



function testCredentials(){
let queryParams = {
                "channelName": channelName,
                "channelType": "MARKETPLACE"
            }
	var url = getConfigUrl() + "/test-credentials";
        doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
}


function fillCredentialDataInUpdateModal(){
	$('#update-credential-form').html("")
	for (var key in loginCredentialData) {
		$('#update-credential-form').append(`<div class="form-group row"><div class="col-md-3 form-label-group"> ${key} </div><div class="col-md-6 form-label-group">
			<input class="form-control" id="input-${key}" type="text"></div></div>`)
		$("#input-" + key).val(loginCredentialData[key]);
	}
}
function updateCredentials(){
	let newJson={};
	for (var key in loginCredentialData){
		let val = $("#input-" + key)?.val();
		if(!val){
			notifyWarn({"title": "Warning", "value": "Fill all credentials"});
			return;
		}
		newJson[key]= val;
	}
	var updateForm = new Object();
	updateForm.channelName = channelName;
	updateForm.channelType = "MARKETPLACE";
	updateForm.credentialMap = newJson;
	updateForm.integrationType = integration_type
	var url = getConfigUrl() + "/login-credentials";
	doAjax(url, 'PUT', undefined, updateForm, undefined, refreshPage, undefined)

}
function refreshPage(){
location.reload()
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
//        console.log(json);
        var json2 = convertToLocationForm(json, channelName);
//    	console.log(json2);
//    	return false;
    	var url = getConfigUrl() + "/location";


        $("#location-form")[0].reset();
        $('#add-location-modal').modal('toggle');
    	doAjax(url, 'POST', null, json2, undefined, undefined, undefined)

//    let queryParams = {
//                "channelName": channelName,
//                "location": $('#location-form input[name=location]').val()
//            }
//            $("#location-form")[0].reset();
//            $('#add-location-modal').modal('toggle');
//	var url = getConfigUrl() + "/location";
//        doAjax(url, 'POST', queryParams, undefined, undefined, getLocations, undefined)
}


function validateMarketplaceName(){
    	getLocations();
    	getPushCredentials();
    	getLoginCredentials();
}

function openAddLocationModal(){
	$('#add-location-modal').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#add-new-location').click(openAddLocationModal);
	$('#add-location').click(addLocation);
	$('#refresh-locations').click(getLocations)
	$('#update-credential').click(updateCredentials);
}

$(document).ready(init);
$(document).ready(populateChannelName);
