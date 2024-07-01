function getProductUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/inventory";
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
	uploadFile(inventoryForm);
}

function uploadFile(json){
    var url = getProductUrl();
    	console.log(json);
    doAjax( url, 'PUT', undefined, json, undefined, undefined, undefined )
}

function getChannels(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    var url = baseUrl + "api/channel/erp";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
}

//INITIALIZATION CODE
function init(){
	$('#upload-product').click(displayUploadData);
	$('#process-data').click(processData);
    $('#product-file').on('change', updateFileName);
}

$(document).ready(init);
$(document).ready(getChannels);