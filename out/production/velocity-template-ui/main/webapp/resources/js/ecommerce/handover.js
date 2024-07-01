let ManifestItems=new Array()

function getHandoverUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	console.log(baseUrl);
	return baseUrl + "api/handover";
}

function displayChannelDropdown(data){
var select = document.getElementById("select-channel");
for(var i = 0; i < data.length; i++) {
    var opt = data[i].channelName;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

//audit dropdown
var select = document.getElementById("select-channel-audit");
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
	if($('#manifest-form input[name=transporter]').val().trim() == ""){
    		notifyWarn({"title": "Warning", "value": "Please enter transporter."});
    		return false;
    	}
    	if($('#manifest-form input[name=warehouseId]').val().trim() == ""){
        		notifyWarn({"title": "Warning", "value": "Please enter location code."});
        		return false;
        	}
	var $form = $("#manifest-form");
	var channel = document.getElementById("select-channel").value;
	var json = toJson($form);
	json.channelName = channel;
    	delete json['attr-channel-order-id']
            	delete json['attr-shipment-code']
            	delete json['attr-awb-number']
    	json['manifestItems']=ManifestItems;
    	$("#manifest-form")[0].reset();
            	$("#manifest-item-table > tbody").find("tr:not(:first)").remove()
            	$('#create-manifest-modal').modal('toggle');
    	var url = getHandoverUrl();
	doAjax(url, 'POST', null, json, undefined, undefined, undefined)
}

function openCreateMnaifestModal(){
	$('#create-manifest-modal').modal('toggle');
}

function viewHistory(){
var channel = document.getElementById("select-channel-audit").value;
url = getHistoryUrl() + "/handover";
 let queryParams = {
    "channelName": channel
    };
    doAjax(url, 'GET', queryParams, undefined, undefined, displayHistoryModal, undefined )
}

//INITIALIZATION CODE
function init(){
$('#add-manifest-item').click(addManifestItem);
	$('#add-manifest').click(openCreateMnaifestModal);
	$('#create-manifest').click(addManifest);
	$('#view-history').click(viewHistory);
}

$(document).ready(init);
$(document).ready(getChannels);