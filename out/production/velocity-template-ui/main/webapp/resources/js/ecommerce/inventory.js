function getProductUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/inventory";
}

function getConsolidatedInventoryUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/consolidated-inventory";
}

function displayChannelDropdown(data){
var select = document.getElementById("selectChannel");
for(var i = 0; i < data.length; i++) {
    var opt = data[i].channelName;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-product-modal').modal('toggle');
	//getChannels();
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#product-file');
	$file.val('');
	$('#product-file-name').html("Choose File");
	processCount = 0;
}

function displayConsolidatedUploadData(){
 	resetConsolidatedUploadDialog();
	$('#upload-consolidated-inventory-modal').modal('toggle');
	//getChannels();
}

function resetConsolidatedUploadDialog(){
	//Reset file name
	var $file = $('#consolidated-inventory-file');
	$file.val('');
	$('#consolidated-inventory-file-name').html("Choose File");
	processCount = 0;
}

function updateFileName(){
	var $file = $('#product-file');
	var fileName = $file.val();
	$('#product-file-name').html(fileName);
}

function updateConsolidatedFileName(){
    var $file = $('#consolidated-inventory-file');
    var fileName = $file.val();
    $('#consolidated-inventory-file-name').html(fileName);
}

function processData(){
	var file = $('#product-file')[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
	}
	readFileData(file, readFileDataCallback);
}

function processConsolidatedData(){
    var file = $('#consolidated-inventory-file')[0].files[0];
    if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
    }
    readFileData(file, readConsolidatedFileDataCallBack);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function readConsolidatedFileDataCallBack(results){
    fileData = results.data;
    uploadConsolidatedRows();
}

function uploadRows(){
	//Update progress
	var json=[];
	while(processCount!=fileData.length){

	var row = fileData[processCount];
	//row[mrp]=Number(row[mrp]);
	processCount++;
	json.push(row);
	}
	var Json = {}
	Json["list"] = json;
	console.log(Json);
	var inventoryForm = new Object();
	inventoryForm.warehouseId = $('#inventory-form input[name=locationCode]').val();
	inventoryForm.syncExistingInventory = document.getElementById("isSyncRequired").checked;
	inventoryForm.channelName = document.getElementById("selectChannel").value;

	inventoryForm.inventoryList = json
	document.getElementById("location").value = '';
	document.getElementById("isSyncRequired").value='';
	$('#upload-product-modal').modal('toggle');
	uploadFile(inventoryForm,getProductUrl());
}

function uploadConsolidatedRows(){
	var json=[];
	while(processCount!=fileData.length){
	var row = fileData[processCount];
	processCount++;
	json.push(row);
	}
	var Json = {}
	Json["list"] = json;
	console.log(Json);
	var inventoryForm = new Object();
	inventoryForm.syncExistingInventory = document.getElementById("isSyncRequired").checked;
	inventoryForm.channelName = document.getElementById("selectChannel").value;

	inventoryForm.inventoryList = json
	document.getElementById("isSyncRequired").value='';
	$('#upload-consolidated-inventory-modal').modal('toggle');
	uploadFile(inventoryForm,getConsolidatedInventoryUrl());
}


function uploadFile(json, url){
    doAjax( url, 'PUT', undefined, json, undefined, undefined, undefined )
}

function getChannels(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    var url = baseUrl + "api/channel/marketplace";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	/*var options = ["1", "2", "3", "4", "5"];
	displayChannelDropdown(options)
	return false;*/
}

//INITIALIZATION CODE
function init(){
	$('#upload-product').click(displayUploadData);
	$('#process-data').click(processData);
    $('#product-file').on('change', updateFileName);
    $('#process-consolidated-inventory-data').click(processConsolidatedData);
    $('#consolidated-inventory-file').on('change',updateConsolidatedFileName);
    $('#consolidated-inventory-update').click(displayConsolidatedUploadData);
}

$(document).ready(init);
$(document).ready(getChannels);