let ManifestItems=new Array()

function getManifestUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	console.log(baseUrl);
	return baseUrl + "api/manifest";
}

function displayChannelDropdown(data){
	displayDropDown(data, "select-channel")
	displayDropDown(data, "select-channel-main")

}

 function displayDropDown(data, htmlId){
	 var select = document.getElementById(htmlId);
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
    var url = baseUrl + "api/channel/marketplace";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	return false;
}

function displayManifestItemData(){
	let $tbody =$('#manifest-item-table').find('tbody');
	$("#manifest-item-table > tbody").find("tr:not(:first)").remove();
	let row=''
	ManifestItems.forEach(manifestItem => {
		row="<tr>"+
		"<td class='pl-2'>"+manifestItem.orderCode+"</td>"+
		"<td class='pl-2'>"+manifestItem.shipmentCode+"</td>"+
		"<td class='pl-2'>"+manifestItem.awbCode+"</td>"+
		"</tr>";
		$tbody.append(row);
		}
	)
	$('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })
}

function addManifestItem(){
	if(!validateManifestItems())
		return;
	dismissDialog();
	let channelOrderId = $('#attr-channel-order-id').val()
	let shipmentCode = $('#attr-shipment-code').val();
	let awbNumber = $('#attr-awb-number').val();
	var manifestItem = new Object();
    manifestItem.orderCode = channelOrderId;
    manifestItem.shipmentCode = shipmentCode;
    manifestItem.awbCode = awbNumber;
    ManifestItems.push(manifestItem)
	displayManifestItemData();
	$('#attr-channel-order-id').val("")
	$('#attr-channel-order-id').removeClass('invalid-state').removeClass('valid-state');
	$('#attr-shipment-code').val("");
	$('#attr-shipment-code').removeClass('invalid-state').removeClass('valid-state');
	$('#attr-awb-number').val("");
    $('#attr-awb-number').removeClass('invalid-state').removeClass('valid-state');
}

function validateManifestItems(){
	let validated=true;
	let channelOrderId = $('#attr-channel-order-id').val()
    	let shipmentCode = $('#attr-shipment-code').val();
        	let awbNumber = $('#attr-awb-number').val();
	if(!channelOrderId ||channelOrderId.trim().length==0){
		notifyWarn({"title": "Warning", "value": "Channel Order Id is required."});
		validated= false;
	}

	if(!shipmentCode ||shipmentCode.trim().length==0){
		notifyWarn({"title": "Warning", "value": "Shipment Code is required."});
		validated= false;
	}

	if(!awbNumber ||awbNumber.trim().length==0){
    		notifyWarn({"title": "Warning", "value": "Shipment Code is required."});
    		validated= false;
    	}
	return validated;
}

function addManifest(){
var channelName = document.getElementById("select-channel").value;
	if($('#manifest-form input[name=transporter]').val().trim() == ""){
    		notifyWarn({"title": "Warning", "value": "Please enter transporter."});
    		return false;
    	}
    	if($('#manifest-form input[name=warehouseId]').val().trim() == ""){
        		notifyWarn({"title": "Warning", "value": "Please enter location code."});
        		return false;
        	}
	var $form = $("#manifest-form");
	var json = toJson($form);
	json.channelName = channelName;
    	delete json['attr-channel-order-id']
    	delete json['attr-shipment-code']
    	delete json['attr-awb-number']
    	json['manifestItems']=ManifestItems;
    	console.log(json);
    	var url = getManifestUrl();
    	$("#manifest-form")[0].reset();
    	$("#manifest-item-table > tbody").find("tr:not(:first)").remove()
    	$('#create-manifest-modal').modal('toggle');
	doAjax(url, 'POST', null, json, undefined, showCreateManifestData, undefined)
	return false;
}

function showCreateManifestData(data){
		notifySuccess({"title": "SUCCESS", "value": "Manifest Id is " + data});
}

function downloadManifestDocument(data){
var link = document.createElement('a');
link.href = data;
link.download = 'manifest.pdf';
link.dispatchEvent(new MouseEvent('click'));
}

function searchManifest(){
if($('#manifestId').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter manifest Id"});
		return false;
	}
	let queryParam = {
		"channelName": $("#select-channel-main option:selected").val()
	}
    let manifestId = $('#manifestId').val()
    channelManifestId = manifestId;
    var url = getManifestUrl() + "/search/" + manifestId;
    document.getElementById("manifestId").value = '';
    doAjax(url, 'GET', queryParam, undefined, undefined, displayManifestData, undefined)
    return false;
}

function getManifestFromChannel(data){
    var url = getManifestUrl() + "/" + data;
    doAjax(url, 'PUT', undefined, undefined, undefined, downloadManifestDocument, undefined)
}

function getLatestManifestDocument(data){
    var url = getManifestUrl() + "/" + data;
    doAjax(url, 'GET', undefined, undefined, undefined, downloadManifestDocument, undefined)
}

function displayManifestData(data){
    var $tbody = $('#manifest-table').find('tbody');
	$tbody.empty();
	for(var i in data){
    	var e = data[i];
	var manifestId = e.manifestId;
	var row = '<tr>'
            		+ '<td>' + e.manifestCode + '</td>'
            		+ '<td>' + e.channelName + '</td>'
            		+ '<td>' + e.manifestDate + '</td>'
            		+ '<td><button class="btn-sm btn btn-outline-primary" id="get-manifest" onclick="getManifestFromChannel('+ e.manifestId +')">Get Manifest</button>'
            		+ '<button class="btn-sm btn btn-outline-primary" id="download-manifest" onclick="getLatestManifestDocument('+ e.manifestId +')">Download Manifest</button>'
                    + '<button class="btn-sm btn btn-outline-primary" id="view-history" onclick="audit(\'manifest\',' + e.manifestId + ')">History</button></td>'
            		+ '</tr>';
            $tbody.append(row);
            }
}


function openCreateMnaifestModal(){
	$('#create-manifest-modal').modal('toggle');
}


function displayHistory(){
	$('#audit-modal').modal('toggle');
}

//INITIALIZATION CODE
function init(){
$('#add-manifest-item').click(addManifestItem);
	$('#add-manifest').click(openCreateMnaifestModal);
	//$('#view-history').click(displayHistory);
	$('#show-manifest').click(searchManifest);
	$('#create-manifest').click(addManifest);
}

$(document).ready(init);
$(document).ready(getChannels);