function getReturnOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/return-order";
}

function getOrderForChannelOrderId(){
    if($('#search-return-order input[name=returnOrderId]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter return order Id"});
		return false;
	}
	else{
            var returnOrderId = $('#search-return-order input[name=returnOrderId]').val();
        var url = getReturnOrderUrl();
        let queryParams = {
                            "returnOrderId": returnOrderId
                        }
        $("#search-return-order")[0].reset();
        doAjax(url, 'GET', queryParams, undefined, undefined, displayReturnOrderList, undefined)
        return false;
	}
}

function ackReturnOrder(data){
    let queryParams = {
                    "returnOrderId": data
                }
    url = getReturnOrderUrl() + "/ack-order";
    doAjax(url, 'PUT', queryParams, undefined, undefined, undefined, undefined)
    return false;
}

function ackReturnOrderItems(data){
var url = getReturnOrderUrl() + "/" + data;
        doAjax(url, 'GET', undefined, undefined, undefined, makeAckItemCall, undefined)
            return false;
}

function makeAckItemCall(data){
let AckItems=new Array()
let returnOrder = data[0];
for(var i in returnOrder.returnLineItems){
		var e = returnOrder.returnLineItems[i];
		var ackItem = new Object();
		ackItem.returnOrderItemCode = e.channelReturnItemCode;
		ackItem.channelSkuCode = e.channelSkuCode;
		ackItem.qcStatus = document.getElementById("qc-status-" + e.channelReturnItemCode).value;
		AckItems.push(ackItem);
		document.getElementById("qc-status-" + e.channelReturnItemCode).value = '';
		}
		var ackForm = new Object();
        ackForm.returnOrderId = returnOrder.returnOrderCode;
        ackForm.asimReturnOrderId = returnOrder.asimReturnOrderId;
		ackForm.returnItemForms = AckItems;
		var url = getReturnOrderUrl() + "/ack-items";
		doAjax(url, 'PUT', null, ackForm, undefined, undefined, undefined)
		return false;
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
		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
        row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderActions' + e.asimReturnOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderDetails' + e.asimReturnOrderId + '">Ack Return Order</a></h5></div><div id="collapseOrderDetails' + e.asimReturnOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimReturnOrderId + '"><!-- Blank Row --><div class="row">    &nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimReturnOrderId + '">Ack Return Order Items</a></h5></div><div id="collapseItemDetails' + e.asimReturnOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimReturnOrderId + '"><div class="row">&nbsp;</div></div></div></div></div></div></div></td></tr>';
                	    $tbody.append(row);
                	    getCollapseDetails(e)

	}
}

function getCollapseDetails(f){

    $("#orderDetails" + f.asimReturnOrderId).append('<div class="row"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="ackReturnOrder(\'' + f.asimReturnOrderId + '\')">Ack Return Order</button></div><div class="row">&nbsp;</div>');
    $("#lineItems" + f.asimReturnOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Channel SKU</div><div class="col-3" style="font-weight:bold;">Return Order Item Id</div><div class="col-3" style="font-weight:bold;">QC Status</div>');
    $("#lineItems" + f.asimReturnOrderId).append('<div>&nbsp;</div>');
    for(var j in f.returnLineItems){
    var e = f.returnLineItems[j]
    $("#lineItems" + f.asimReturnOrderId).append('<div class="row"><div class="col-3">' + e.channelSkuCode + '</div><div class="col-3">' + e.channelReturnItemCode + '</div><div class="col-3"><select class="form-control custom-select custom-select-sm col-md-5 isRequired2" id="qc-status-'+ e.channelReturnItemCode+'" name="qc-status"><option selected hidden disabled value="">Select</option><option value="PASS">PASS</option><option value="FAIL">FAIL</option></select></div></div></div></div>');
    $("#lineItems" + f.asimReturnOrderId).append('</form><div>&nbsp;</div>');
    }
    $("#lineItems" + f.asimReturnOrderId).append('<div class="row"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="ackReturnOrderItems(\'' + f.asimReturnOrderId + '\')">Ack Return Items</button></div></form>');
    $("#lineItems" + f.asimReturnOrderId).append('</form><div>&nbsp;</div>');
}

function showHistory(){
	$('#view-sku-history').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#fetch-return-order').click(getOrderForChannelOrderId);
	$('#return-order-history').click(showHistory);

}

$(document).ready(init);