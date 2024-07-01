function getInwardOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inward-order";
}

function getGrnUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/post-grn";
}

function getGrnNotiUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/post-grn-notification";
}

function getOrderForChannelOrderId(){
    if($('#search-order-form input[name=channelOrderId]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter channelOrderId"});
		return false;
	}
    let queryParams = {
            "channelOrderId": $('#search-order-form input[name=channelOrderId]').val()
        }
    var url = getInwardOrderUrl() + "/get";
    doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined);
    $("#search-order-form")[0].reset();
    return false;
}

function displayOrderList(data){
    var $thead = $('#inward-order-table').find('thead');
	var $tbody = $('#inward-order-table').find('tbody');
	$thead.empty();
	var row='<tr>'
	    	+ '<th scope="col" style="width: 20%;">Channel Order Id/Parent Order Id</th>'
	    	+ '<th scope="col" style="width: 15%;">Channel Name</th>'
            + '<th scope="col" style="width: 25%;">Order Time</th>'
            + '<th scope="col" style="width: 15%;">Supplier</th>'
            + '<th scope="col" style="width: 15%;">Location Code</th>'
            + '<th scope="col" style="width: 15%;">Order Type</th>'
	    + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var row = '<tr>'
		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#grnActions' + e.asimOrderId + '">' + e.channelOrderCode + "/" + e.parentOrderCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.channelId + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderTime + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.partnerData.partnerName + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderType + '</td>'
		+ '</tr>';
        $tbody.append(row);
        row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="grnActions' + e.asimOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimOrderId + '">Order Items</a></h5></div><div id="collapseItemDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" id="grn-order-wise" onclick="postGrnOrderWise(' + e.asimOrderId + ')">GRN Order Wise</button><button class="btn-sm btn btn-outline-primary ml-1 mr-2" id="grn-gate-entry" onclick="postGrnGateEntryWise(' + e.asimOrderId + ')">GRN Gate Entry Wise</button><button class="btn-sm btn btn-outline-primary ml-1 mr-2" id="grn-notification" onclick="postGrnNotification(' + e.asimOrderId + ')">GRN Notification</button><button class="btn-sm btn btn-outline-primary ml-1 mr-2" id="grn-gate-entry-notification" onclick="postGrnGateEntryNotification(' + e.asimOrderId + ')">GRN Gate Entry Notification</button></div></div></div></td></tr>';
	    $tbody.append(row);
	    getCollapseDetails(e)
	}
}

function getCollapseDetails(f){
    $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2" style="font-weight:bold;">OrderItemCode</div><div class="col-2" style="font-weight:bold;">Channel SKU</div><div class="col-3" style="font-weight:bold;">Ordered Quantity</div>');
    for(var j in f.orderItems){
    var e = f.orderItems[j]
    $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2">' + e.orderItemCode + '</div><div class="col-2">' + e.channelSkuCode + '</div><div class="col-3">' + e.orderedQuantity + '</div></div></div>');
    }
    $("#lineItems" + f.asimOrderId).append('<div>&nbsp;</div>');
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#grn-file-1');
	$file.val('');
	$('#grn-file-1-name').html("Choose File");
	var $file2 = $('#grn-file-2');
    $file2.val('');
    $('#grn-file-2-name').html("Choose File");
    $("#grn-form-2")[0].reset();
}

function postGrnOrderWise(asimOrderId){
    document.getElementById("sample-grn-1").removeAttribute("hidden");
    document.getElementById("sample-grn-notification-1").setAttribute("hidden","true");
    $('#grn-form-1 input[name=asimOrderId]').val(asimOrderId);
    $('#grn-form-1 input[name=type]').val("ORDER_WISE");
    resetUploadDialog();
    $('#upload-grn-file-1').modal('toggle');
}

function postGrnNotification(asimOrderId){
    document.getElementById("sample-grn-notification-1").removeAttribute("hidden");
    document.getElementById("sample-grn-1").setAttribute("hidden","true");
    $('#grn-form-1 input[name=asimOrderId]').val(asimOrderId);
    $('#grn-form-1 input[name=type]').val("NOTIFICATION");
    resetUploadDialog();
    $('#upload-grn-file-1').modal('toggle');
}

function postGrnGateEntryNotification(asimOrderId){
    document.getElementById("sample-grn-notification-2").removeAttribute("hidden");
    document.getElementById("sample-grn-2").setAttribute("hidden","true");
    $('#grn-form-2 input[name=asimOrderId]').val(asimOrderId);
    $('#grn-form-2 input[name=type]').val("GATE_ENTRY_NOTIFICATION");
    resetUploadDialog();
    $('#upload-grn-file-2').modal('toggle');
}

function postGrnGateEntryWise(asimOrderId){
    document.getElementById("sample-grn-2").removeAttribute("hidden");
    document.getElementById("sample-grn-notification-2").setAttribute("hidden","true");
    $('#grn-form-2 input[name=asimOrderId]').val(asimOrderId);
    $('#grn-form-2 input[name=type]').val("GATE_ENTRY_WISE");
    resetUploadDialog();
    $('#upload-grn-file-2').modal('toggle');
}

function postGRN1() {
    postGrn(1);
}

function postGRN2() {
    postGrn(2);
}

function postGrn(num){
    var file = $('#grn-file-' + num )[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
	}
	var asimOrderId = $('#grn-form-' + num + ' input[name=asimOrderId]').val();
	var grnType = $('#grn-form-' + num + ' input[name=type]').val();
    $('#upload-grn-file-' + num).modal('toggle');
	customReadFileData(file, asimOrderId, grnType, readFileDataCallback);
}

function customReadFileData(file, asimOrderId, grnType, callback){
	var config = {
		header: true,
		delimiter: ",",
		skipEmptyLines: "greedy",
		complete: function(results) {
			callback(results, asimOrderId, grnType);
	  	}
	}
	Papa.parse(file, config);
}

function readFileDataCallback(results, asimOrderId, grnType){
	fileData = results.data;
	uploadRows(asimOrderId, grnType);
}

function uploadRows(asimOrderId, grnType){
	//Update progress
	var json=[];
	for(var i in fileData){
	var row = fileData[i];
	json.push(row);
	}
	console.log(json);
	var Json = {}
	Json["items"] = json;
	uploadFile(Json, asimOrderId, grnType);
}

function uploadFile(json, asimOrderId, grnType){
	//Make ajax call
	var url;
	if(grnType == "GATE_ENTRY_WISE" || grnType == "GATE_ENTRY_NOTIFICATION"){
	    json["invoiceCode"] = $('#grn-form-2 input[name=invoiceCode]').val();
        json["awbNumber"] = $('#grn-form-2 input[name=awbNumber]').val();
    }
	if(grnType == "NOTIFICATION" || grnType == "GATE_ENTRY_NOTIFICATION")
	    url = getGrnNotiUrl();
	else
        url = getGrnUrl();
    console.log(json);
    let queryParams = {
                "asimOrderId": asimOrderId,
                "grnType": grnType
       };
    doAjax( url, 'POST', queryParams, json, undefined, undefined, undefined )
}

function init(){
	$('#search-order').click(getOrderForChannelOrderId);
    $('#process-grn-file-2').click(postGRN2);
	$('#process-grn-file-1').click(postGRN1);
	showFileNameOnInput();
}

$(document).ready(init);
