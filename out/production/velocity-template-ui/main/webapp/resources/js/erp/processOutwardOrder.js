function getOutwardOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/outward-order";
}

function getShipmentUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/shipment";
}

function getOrderForChannelOrderId(){
    if($('#search-outward-order input[name=outwardOrderId]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter outward order Id"});
		return false;
	}
	else{
        var url = getOutwardOrderUrl() + "/get";
        let queryParams = {
                        "channelOrderId": $('#search-outward-order input[name=outwardOrderId]').val(),
                         "channelType":"ERP"
                    }
                    $("#search-outward-order")[0].reset();
        doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
        return false;
	}
}

function syncOutwardOrder(orderId){
	var url = getOutwardOrderUrl() + "/sync";
            let queryParams = {
                            "asimOrderId": orderId
                        }
            doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
            return false;
}

function ackOutwardOrder(orderId){
	var url = getOutwardOrderUrl() + "/ack";
            let queryParams = {
                            "asimOrderId": orderId
                        }
            doAjax(url, 'PUT', queryParams, undefined, undefined, undefined, undefined)
            return false;
}

function getShippingLabel(orderId){
var shipmentCode= "shipment-code-" + orderId;
var shipmentCodeValue = document.getElementById(shipmentCode).value;
let queryParams = {
                            "shipmentCode": shipmentCodeValue
                        }
    var url = getShipmentUrl() + "/pack/shipping-label";
    doAjax(url, 'GET', queryParams, undefined, undefined, downloadShippingLabelDocument, undefined)
    return false;
}

function downloadShippingLabelDocument(data){
var link = document.createElement('a');
link.href = data;
link.download = 'shippingLabel.pdf';
link.dispatchEvent(new MouseEvent('click'));
}

function getInvoiceDocument(orderId){
var shipmentCode= "shipment-code-" + orderId;
var shipmentCodeValue = document.getElementById(shipmentCode).value;
    let queryParams = {
                                "shipmentCode": shipmentCodeValue
                            }
        var url = getShipmentUrl() + "/pack/invoice";
        doAjax(url, 'GET', queryParams, undefined, undefined, downloadInvoiceDocument, undefined)
        return false;
}

function downloadInvoiceDocument(data){
var link = document.createElement('a');
link.href = data;
link.download = 'invoice.pdf';
link.dispatchEvent(new MouseEvent('click'));
}

function packOrder(orderId){
var url = getOutwardOrderUrl();
            let queryParams = {
                            "asimOrderId": orderId
                        }
            doAjax(url, 'GET', queryParams, undefined, undefined, makePackCall, undefined)
            return false;
}

function cancelOrder(orderId){
var url = getOutwardOrderUrl();
            let queryParams = {
                            "asimOrderId": orderId
                        }
            doAjax(url, 'GET', queryParams, undefined, undefined, makeCancelCall, undefined)
            return false;

}

function makeCancelCall(data){
let CancelItems=new Array()
for(var i in data.orderItems){
		var e = data.orderItems[i];
		var cancelItem = new Object();
		cancelItem.orderItemId = e.orderItemCode;
		cancelItem.orderedQuantity = e.orderedQuantity;
		cancelItem.channelSkuCode = e.channelSkuCode;
		cancelItem.quantityToCancel = document.getElementById("cancel-quantity-" + e.orderItemCode).value;
		document.getElementById("cancel-quantity-" + e.orderItemCode).value = '';
		CancelItems.push(cancelItem);
		}
		var cancelForm = new Object();
        cancelForm.channelOrderId = data.channelOrderCode;
        cancelForm.asimOrderId = data.asimOrderId;
		cancelForm.items = CancelItems;
		var url = getOutwardOrderUrl() + "/cancel";
		doAjax(url, 'PUT', null, cancelForm, undefined, undefined, undefined)
}

function makePackCall(data){
var type = data.fulfillmentType;
let PackItems=new Array()
for(var i in data.orderItems) {
         var e = data.orderItems[i];
         let quantityToPack = document.getElementById("pack-quantity-" + e.orderItemCode).value;
         if(quantityToPack%1 != 0){
            notifyWarn({"title": "Warning", "value": "Quantity should be a whole number"});
            return false;
         }
	     if(quantityToPack == null || quantityToPack == "" || quantityToPack < 0){
            notifyWarn({"title": "Warning", "value": "Invalid Pack Quantity"});
            return false;
         }
}

for(var i in data.orderItems){
		var e = data.orderItems[i];
		var packItem = new Object();
		packItem.orderItemId = e.orderItemCode;
		packItem.orderedQuantity = e.orderedQuantity;
		packItem.channelSkuCode = e.channelSkuCode;
		packItem.quantityToPack = document.getElementById("pack-quantity-" + e.orderItemCode).value;
		if(type == "BLOCK_COMPLETE") {
                if(packItem.quantityToPack != packItem.orderedQuantity){
                  notifyWarn({"title": "Warning", "value": "Ordered Quantity should be same as Quantity to Pack"})
                  return false;
                  }
        }
		document.getElementById("pack-quantity-" + e.orderItemCode).value = '';
		PackItems.push(packItem);
		}
		var packForm = new Object();
        packForm.channelOrderId = data.channelOrderCode;
        packForm.asimOrderId = data.asimOrderId;
		packForm.items = PackItems;
		var url = getShipmentUrl() + "/pack";
		doAjax(url, 'PUT', null, packForm, undefined, showCreateShipmentData, undefined)
}

function showCreateShipmentData(data){
		notifySuccess({"title": "SUCCESS", "value": "Shipment Code is " + data});
}

function getShipment(orderId){
    var shipmentCode= "shipment-code-" + orderId;
    var shipmentCodeValue = document.getElementById(shipmentCode).value;
    let queryParams = {
                         "shipmentCode": shipmentCodeValue
                      }
    var url = getShipmentUrl() + "/pack";
    doAjax(url, 'GET', queryParams, undefined, undefined, undefined, undefined)
    return false;
}

function displayOrderList(data){
if(!data){
    	notifyWarn({"title": "Warning", "value": "No outward orders found."});
    	return;
    	}
	var $tbody = $('#outward-order-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'outward-order\',' + e.asimOrderId + ')">History</button>';
		var row = '<tr>'
        		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#orderProcess' + e.asimOrderId + '">' + e.channelOrderCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.channelId + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.parentOrderCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.orderTime + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.fulfillmentType + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
        		+ '</tr>';
                $tbody.append(row);
                row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderProcess' + e.asimOrderId + '"><div class="panel-group">'
                + '<div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderActions' + e.asimOrderId + '">Order Actions</a></h5></div>'
                + '<div id="collapseOrderActions' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimOrderId + '"><div class="row"> &nbsp;</div></div></div>'
                + '<div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapsePackOrder' + e.asimOrderId + '">Pack Order</a></h5></div>'
                + '<div id="collapsePackOrder' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="pack' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div>'
                + '<div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapsePackSlip' + e.asimOrderId + '">Order Pack Slip</a></h5></div>'
                + '<div id="collapsePackSlip' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="packslip' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div>'
                + '<div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseShipmentHistory' + e.asimOrderId + '" >Shipment History</a></h5></div>'
                + '<div id="collapseShipmentHistory' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="shipmenthistory' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div>';
                + '</div></div></td></tr>';
                $tbody.append(row);
                getShipmentHistory(e)
	}
}

function getShipmentHistory(e){
 url = getShipmentUrl() + "/shipment-ids";
 let queryParams = {
    "asimOrderId": e.asimOrderId
    };
    const getCollapseDetailsWrapper = (data) => {
        getCollapseDetails(data, e);
    };
    doAjax(url, 'GET', queryParams, undefined, undefined, getCollapseDetailsWrapper, undefined )
}

function getCollapseDetails(data,f){
    //Order Actions
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="ackOutwardOrder(\'' + f.asimOrderId + '\')">Ack Order</button></div></div><div class="row">&nbsp;</div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="syncOutwardOrder(\'' + f.asimOrderId + '\')">Sync Order</button></div></div><div class="row">&nbsp;</div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Channel SKU</div><div class="col-3" style="font-weight:bold;">Order Item Id</div><div class="col-2" style="font-weight:bold;">Ordered Quantity</div><div class="col-2" style="font-weight:bold;">Quantity To Cancel</div>');
    $("#orderDetails" + f.asimOrderId).append('<divclass="row">&nbsp;</div>');
        for(var j in f.orderItems){
        var e = f.orderItems[j]
        $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3">' + e.channelSkuCode + '</div><div class="col-3">' + e.orderItemCode + '</div><div class="col-2">' + e.orderedQuantity + '</div><div class="col-2"><input class="form-control isRequired3" placeholder="Quantity" type="number" id="cancel-quantity-' + e.orderItemCode + '"  autocomplete="off"></div></div></div>');
        $("#orderDetails" + f.asimOrderId).append('<form id="cancel-form-' + f.asimOrderId + '"><input class="form-control isRequired3" type="hidden" id="order-item-code-' + e.orderItemCode + '" value="' + e.orderItemCode + '"></form>');
        }
        $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="cancelOrder(\'' + f.asimOrderId + '\')">Cancel Order</button></div></div><div class="row">&nbsp;</div>');
        $("#orderDetails" + f.asimOrderId).append('<divclass="row">&nbsp;</div>');

    //Pack
    $("#pack" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Channel SKU</div><div class="col-3" style="font-weight:bold;">Order Item Id</div><div class="col-2" style="font-weight:bold;">Ordered Quantity</div><div class="col-2" style="font-weight:bold;">Quantity To Pack</div>');
    $("#pack" + f.asimOrderId).append('<divclass="row">&nbsp;</div>');

    for(var j in f.orderItems){
    var e = f.orderItems[j]
    $("#pack" + f.asimOrderId).append('<div class="row"><div class="col-3">' + e.channelSkuCode + '</div><div class="col-3">' + e.orderItemCode + '</div><div class="col-2">' + e.orderedQuantity + '</div><div class="col-2"><input class="form-control isRequired3" placeholder="Quantity" type="number" id="pack-quantity-' + e.orderItemCode + '"  autocomplete="off"></div></div></div>');
    $("#pack" + f.asimOrderId).append('<form id="pack-form-' + f.asimOrderId + '"><input class="form-control isRequired3" type="hidden" id="order-item-code-' + e.orderItemCode + '" value="' + e.orderItemCode + '"></form>');
    $("#pack" + f.asimOrderId).append('<divclass="row">&nbsp;</div>');
    }
    $("#pack" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="packOrder(\'' + f.asimOrderId + '\')">Pack Order</button></div></div><div class="row">&nbsp;</div>');
    $("#pack" + f.asimOrderId).append('<div>&nbsp;</div>');

    //Pack Slip
    $("#packslip" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><input class="form-control isRequired3" placeholder="Shipment Code" type="text" id="shipment-code-' + f.asimOrderId + '"  autocomplete="off" name="shipmentCode' + f.asimOrderId + '"></div><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="getShipment(\'' + f.asimOrderId + '\')">Get Shipment Details</button></div></div><div class="row">&nbsp;</div>');
    $("#packslip" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="getShippingLabel(\'' + f.asimOrderId + '\')">Download Shipping Label</button></div></div><div class="row">&nbsp;</div>');
    $("#packslip" + f.asimOrderId).append('<div class="row"><div class="col-md-3"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="getInvoiceDocument(\'' + f.asimOrderId + '\')">Download Invoice</button></div></div><div class="row">&nbsp;</div>');

    //Shipment History
    $("#shipmenthistory" + f.asimOrderId).append('<div class="row"><div class="col-1" style="font-weight:bold;">No.</div><div class="col-3" style="font-weight:bold;">Shipment Code</div><div class="col-1" style="font-weight:bold;">Action</div><br><br>');
    for(var x = 0 ; x < data.length ; x++){
       var code = data[x]
       $("#shipmenthistory" + f.asimOrderId).append('<div class="row"><div class="col-1">' + (x+1) + '</div><div class="col-3">' + code + '</div><div class="col-1"><div class="row"><div class="col-md-1"><button class="btn-sm btn btn-outline-primary ml-1 mr-2" onclick="shipmentItemFromCode(\'' + code + '\')">View</button></div></div><div class="row">&nbsp;</div></div>');
    }
}

function init(){
	$('#fetch-outward-order').click(getOrderForChannelOrderId);
}

$(document).ready(init);