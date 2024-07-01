function getReturnOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/return-order";
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
}

function getChannels(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    var url = baseUrl + "api/channel/marketplace";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	return false;
}

function getRecentOrderList(){
    var url = getReturnOrderUrl();
	doAjax(url, 'GET', undefined, undefined, undefined, displayReturnOrderList, undefined )
	return false;
}

function getOrderForChannelOrderId(){
var channelName = document.getElementById("select-channel").value;
var returnOrderId = $('#search-return-order input[name=returnOrderId]').val();
    if(channelName == "" && returnOrderId == ""){
		notifyWarn({"title": "Warning", "value": "Please enter return order Id or channel name."});
		return false;
	}
	$("#search-return-order")[0].reset();
	if(channelName == ""){
        var url = getReturnOrderUrl();
        let queryParams = { "returnOrderId": returnOrderId }
        doAjax(url, 'GET', queryParams, undefined, undefined, displayReturnOrderList, undefined)
        return false;
	}
	if(returnOrderId == ""){
            var url = getReturnOrderUrl();
            let queryParams = {"channelName": channelName }
            doAjax(url, 'GET', queryParams, undefined, undefined, displayReturnOrderList, undefined)
            return false;
    	}
    	else{
    	var url = getReturnOrderUrl();
                    let queryParams = { "returnOrderId": returnOrderId, "channelName": channelName }
                    doAjax(url, 'GET', queryParams, undefined, undefined, displayReturnOrderList, undefined)
                    return false;
    	}
}

function displayReturnOrderList(data){
if(!data){
    	notifyWarn({"title": "Warning", "value": "No such return order found."});
    	return;
    	}
    var $thead = $('#return-order-table').find('thead');
	var $tbody = $('#return-order-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'return-order\',' + e.asimReturnOrderId + ')">History</button>';
		var row = '<tr>'
		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#orderActions' + e.asimReturnOrderId + '"><a>' + e.returnOrderCode + '</a></td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.channelName + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.returnOrderType + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
        row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderActions' + e.asimReturnOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderDetails' + e.asimReturnOrderId + '">Return Order details</a></h5></div><div id="collapseOrderDetails' + e.asimReturnOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimReturnOrderId + '"><!-- Blank Row --><div class="row">    &nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimReturnOrderId + '">Return Order Items</a></h5></div><div id="collapseItemDetails' + e.asimReturnOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimReturnOrderId + '"><div class="row">&nbsp;</div></div></div></div></div></div></div></td></tr>';
        	    $tbody.append(row);
        	    getCollapseDetails(e)
	}
}

function getCollapseDetails(f){
     $("#orderDetails" + f.asimReturnOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Return Order Time:</div><div class="col-3" >' + f.channelReturnTime + '</div><div class="col-3" style="font-weight:bold;">Tracking Id:</div><div class="col-3" >' + f.trackingCode + '</div><div class="col-3" style="font-weight:bold;">Transporter:</div><div class="col-3" >' + f.transporter + '</div></div></div><div>&nbsp;</div>')
    $("#lineItems" + f.asimReturnOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Channel SKU</div><div class="col-3" style="font-weight:bold;">Return Order Item Id</div><div class="col-3" style="font-weight:bold;">Reason For Return</div>');
    for(var j in f.returnLineItems){
    var e = f.returnLineItems[j]
    $("#lineItems" + f.asimReturnOrderId).append('<div class="row"><div class="col-3">' + e.channelSkuCode + '</div><div class="col-3">' + e.channelReturnItemCode + '</div><div class="col-3">' + e.reasonForReturn + '</div></div></div>');
    }
    $("#lineItems" + f.asimReturnOrderId).append('<div>&nbsp;</div>');
}

function init(){
	$('#fetch-return-order').click(getOrderForChannelOrderId);
}

$(document).ready(init);
$(document).ready(getChannels);