let eventType
let erpChannel
let b2cLocation
let b2cChannelCode

function getGeneralUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/channel";
}

function displayChannelDropdown(data){
var select = document.getElementById("select-erp-channel");
for(var i = 0; i < data.length; i++) {
    var opt = data[i].channelName;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
}

function getChannels(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    var url = baseUrl + "api/channel/erp";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	return false;
}

function getSalesPostingUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/post/b2c-order";
}

function getChannelList(data){
  var url = getGeneralUrl() + "/channel-code"
  let queryParams = {
                  "channelName": data
              };
  doAjax(url, 'GET', queryParams, undefined, undefined, createChannelData, undefined )
}

function createChannelData(data)
{
  fillChannelDrop($('#select-channel'), data);
}

function fillChannelDrop(selectbody, data){
  var $selectbody=selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled>Select Channel</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option value="' + e.channelName + '">' + e.channelName + '</option>';
    $selectbody.append(row);
  }
}

function getLocationList(data){
    var url = getGeneralUrl() + "/location"
    let queryParams = {
                "channelName": data
            };
    doAjax(url, 'GET', queryParams, undefined, undefined, createLocationData, undefined )
}

function createLocationData(data)
{
  fillLocationDrop($('#select-location'), data);
}


function fillLocationDrop(selectbody, data){
  var $selectbody=selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled>Select Location</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option>' + e + '</option>';
    $selectbody.append(row);
  }
}

function postOrder(){
    var channel = $("#select-channel option:selected").val();
    var location = $("#select-location option:selected").text();
    var erpChannelName = document.getElementById("select-erp-channel").value;
    var eventType = document.getElementById("select-event-type").value;
    if(channel == "" || channel == "Select Channel" || location == "" || location == "Select Location" || eventType == "" || eventType == "Select Event Type"){
		notifyWarn({"title": "Warning", "value": "Please Select channel, Location and Event type"});
    }
    else{
        let b2cPostingForm = new Object();
        b2cPostingForm.channelName = erpChannelName;
        b2cPostingForm.locationCode = location;
        b2cPostingForm.eventType = eventType;
        b2cPostingForm.channelCode = channel
        var url = getSalesPostingUrl();
        doAjax(url, 'POST', undefined, b2cPostingForm, undefined, undefined, undefined)
    }
}

function readFileDataCallback(results){
    fileData = results.data;
    uploadRows();
}

function validateAddress(address, type) {
    if(!address.country){
        notifyWarn({"title": "Warning", "value": "please provide country details for " + type})
        return false;
    }
    if(!address.state){
        notifyWarn({"title":"Warning", "value":"please provide state details for " + type})
        return false;
    }
    if(!address.zip){
        notifyWarn({"title":"Warning", "value":"please provide zip details for " + type})
        return false;
    }
    return true;

}

function uploadRows(){
    //Update progress
    var json=[];
    processCount = 0;
    while(processCount!=fileData.length){
        var row = fileData[processCount];
        //row[mrp]=Number(row[mrp]);
        processCount++;
        json.push(row);
    }
    var Json = {}
    Json["list"] = json;
    if(json.length === 0){
        notifyWarn({"title": "Warning", "value": "Data not present in file, Please provide"});
    }
    let billingAddress = toJson($('#billing-address'))
    if(!validateAddress(billingAddress, "Billing Address")){
        return
    }
    let shippingAddress
    if(document.getElementById("posting-sameAsBillingAddress").checked){
        shippingAddress = billingAddress;
    }
    else {
        shippingAddress = toJson($('#shipping-address'))
        if(!validateAddress(shippingAddress, "Shipping Address")){
            return;
        }
    }
    var b2cPostingForm = new Object();
    b2cPostingForm.itemLists = json
    b2cPostingForm.eventType = eventType;
    b2cPostingForm.channelName = erpChannel;
    b2cPostingForm.locationCode = b2cLocation;
    b2cPostingForm.channelCode = b2cChannelCode
    b2cPostingForm.billingAddress = billingAddress
    b2cPostingForm.shippingAddress = shippingAddress
    resetUploadDialog();
    uploadFile(b2cPostingForm);
}
function uploadFile(json){
    var url = getSalesPostingUrl();
    doAjax( url, 'POST', undefined, json, undefined, undefined, undefined )
}
function resetUploadDialog(){
	//Reset file name
	var $file = $('#product-file');
	$file.val('');
	$('#product-file-name').html("Choose File");
	processCount = 0;
}
function updateFileNameB2C(){
	var $file = $('#product-file');
	var fileName = $file.val();
  	$('#product-file-name').html(fileName);
}
function processB2CData(){
 	var file = $('#product-file')[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
	}
	readFileData(file, readFileDataCallback);
}


function postOrderUpload(){
        processB2CData()
}


function fetchErpChannelData(){
     var erpChannelName = document.getElementById("select-erp-channel").value;
     getChannelList(erpChannelName);
     getLocationList(erpChannelName);
}

function openB2CPostingModal(){
     b2cChannelCode = $("#select-channel option:selected").text();
     b2cLocation = $("#select-location option:selected").text();
     erpChannel = document.getElementById("select-erp-channel").value;
     eventType = document.getElementById("select-event-type").value;
    if(b2cChannelCode == "" || b2cChannelCode == "Select Channel" || b2cLocation == "" || b2cLocation == "Select Location" || eventType == "" || eventType == "Select Event Type"){
        notifyWarn({"title": "Warning", "value": "Please Select channel, location and event type"});
    }else {
        $('#upload-b2c-posting-form')[0].reset()
        $('#upload-b2c-posting-modal').modal('toggle')
    }
}

//INITIALIZATION CODE
function init(){
    $('#post-order').click(postOrder);
    $('#upload-b2c-posting').click(postOrderUpload);
    $('#fetch-erp-channel').click(fetchErpChannelData);
    $('#product-file').on('change', updateFileNameB2C);
    $('#upload-posting').click(openB2CPostingModal)
}

$(document).ready(init);
$(document).ready(getChannels);