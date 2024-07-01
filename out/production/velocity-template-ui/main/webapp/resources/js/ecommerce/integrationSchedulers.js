let selectedChannelName

function getIntegrationSchedulersUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/scheduler-flow";
}

function getNewOrders(){
    var locationCode = document.getElementById("select-location-orders").value;
    let queryParams = {
                "channelName": selectedChannelName,
                "locationCode": locationCode
            }
	var url = getIntegrationSchedulersUrl() + "/get-orders";
        doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
       return false;
}

function forceSyncOrders(){
    var locationCode = document.getElementById("select-location-sync-orders").value;
    var orderId = document.getElementById("channelOrderId").value;
    let queryParams = {
                "channelName": selectedChannelName,
                "locationCode": locationCode,
                "orderId": orderId
            }
	var url = getIntegrationSchedulersUrl() + "/force-sync-orders";
        doAjax(url, 'PUT', queryParams, undefined, undefined, undefined, undefined)
       return false;
}

function getPendingOrders(){
    var locationCode = document.getElementById("select-location-orders").value;
    let queryParams = {
                "channelName": selectedChannelName,
                "locationCode": locationCode
            }
	var url = getIntegrationSchedulersUrl() + "/get-pending-orders";
        doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
       return false;
}

function getCancelledOrders(){
    var locationCode = document.getElementById("select-location-orders").value;
    let queryParams = {
                "channelName": selectedChannelName,
                "locationCode": locationCode
            }
	var url = getIntegrationSchedulersUrl() + "/get-cancelled-orders";
        doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
       return false;
}

function displayChannelDropdown(data){
var selectSync = document.getElementById("select-channel-new-orders");
//var selectForceSync = document.getElementById("select-channel-sync-orders");
for(var i = 0; i < data.length; i++) {
    var opt = data[i].channelName;
    var el1 = document.createElement("option");
    el1.textContent = opt;
    el1.value = opt;
    var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
    selectSync.appendChild(el);
    //selectForceSync.appendChild(el1);
}
}

function displayLocationDropdown(data){
var selectSync = document.getElementById("select-location-orders");
var selectOrderSync = document.getElementById("select-location-sync-orders");
var selectForceSync = document.getElementById("select-location-force-sync-orders");
for(var i = 0; i < data.length; i++) {
    var opt = data[i];
    var el2 = document.createElement("option");
    el2.textContent = opt;
    el2.value = opt;
    var el1 = document.createElement("option");
        el1.textContent = opt;
        el1.value = opt;
    var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
    selectSync.appendChild(el);
    selectForceSync.appendChild(el1);
    selectOrderSync.appendChild(el2);
}
}

function getChannels(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    var url = baseUrl + "api/channel/marketplace";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	return false;
}

function getLocations(){
var channelName = document.getElementById("select-channel-new-orders").value;
selectedChannelName = channelName;
    var baseUrl = $("meta[name=baseUrl]").attr("content")
        var url = baseUrl + "api/channel/location";
        let queryParams = {
                    "channelName": selectedChannelName
                };
        doAjax(url, 'GET', queryParams, undefined, undefined, displayLocationDropdown, undefined )
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#product-file');
	$file.val('');
	$('#product-file-name').html("Choose File");
	processCount = 0;
}

function updateFileName(){
	var $file = $('#product-file');
	var fileName = $file.val();
	$('#product-file-name').html(fileName);
}

function processData(){
	var file = $('#product-file')[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
	}
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	var json=[];
	processCount = 0;
	while(processCount!=fileData.length){

	var row = fileData[processCount];
	//row[mrp]=Number(row[mrp]);
	processCount++;
	json.push(row.channelOrderId);
	}
	var Json = {}
	var locationCode = document.getElementById("select-location-sync-orders").value;
	Json["list"] = json;
	console.log(Json);
	var syncOrderForm = new Object();
	syncOrderForm.orderIds = json;
	syncOrderForm.channelName = selectedChannelName;
	syncOrderForm.locationCode = locationCode;
	resetUploadDialog();
	uploadFile(syncOrderForm);
}

function uploadFile(json){
    var url = getIntegrationSchedulersUrl() + "/sync-orders";
    doAjax( url, 'PUT', undefined, json, undefined, undefined, undefined )
}

function init(){
	$('#select-channel').click(getLocations);
	$('#force-sync-orders').click(forceSyncOrders);
	$('#sync-orders').click(processData);
	$('#new-orders').click(getNewOrders);
	$('#pending-orders').click(getPendingOrders);
	$('#cancelled-orders').click(getCancelledOrders);
	$('#product-file').on('change', updateFileName);
}

$(document).ready(init);
$(document).ready(getChannels);