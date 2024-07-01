function getInwardOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inward-order";
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
    var url = baseUrl + "api/channel/erp";
	doAjax(url, 'GET', undefined, undefined, undefined, displayChannelDropdown, undefined )
	return false;
}

function getOrderForChannelOrderId(){
var channelName = document.getElementById("select-channel").value;
var orderId = $('#search-order-form input[name=channelOrderId]').val();
    if(channelName == "" && orderId == ""){
    		notifyWarn({"title": "Warning", "value": "Please enter inward order Id or channel Id."});
    		return false;
    	}
    var url = getInwardOrderUrl() + "/get";
    $("#search-order-form")[0].reset();
    if(channelName == ""){

                   let queryParams = {
                                   "channelOrderId": orderId
                               }

                   doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined);
                   return false;
    	}

    	if(orderId == ""){

                       let queryParams = {
                                       "channelName": channelName
                                   }

                       doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined);
                       return false;
        	}
    	else{

            let queryParams = {
                            "channelOrderId": orderId,
                            "channelName": channelName
                        }
            doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined);
            return false;
    	}
    return false;
}

function displayOrderList(data){
    var $thead = $('#inward-order-table').find('thead');
	var $tbody = $('#inward-order-table').find('tbody');
	$thead.empty();
	var row='<tr>'
	    	+ '<th scope="col" style="width: 20%;">Channel Order Id/Parent Order Id</th>'
	    	+ '<th scope="col" style="width: 15%;">Channel Name</th>'
            + '<th scope="col" style="width: 15%;">Order Time</th>'
            + '<th scope="col" style="width: 15%;">Supplier</th>'
            + '<th scope="col" style="width: 15%;">Location Code</th>'
            + '<th scope="col" style="width: 10%;">Order Type</th>'
            + '<th scope="col" style="width: 10%;"></th>'
	    + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'inward-order\',' + e.asimOrderId + ')">History</button>';
		var row = '<tr>'
		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#orderActions' + e.asimOrderId + '">' + e.channelOrderCode + "/" + e.parentOrderCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.channelId + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderTime + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.partnerData.partnerName + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderType + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
        row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderActions' + e.asimOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderDetails' + e.asimOrderId + '">Order details</a></h5></div><div id="collapseOrderDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimOrderId + '"><!-- Blank Row --><div class="row">    &nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimOrderId + '">Order Items</a></h5></div><div id="collapseItemDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div></div></div></div></div></td></tr>';
	    $tbody.append(row);
	    getCollapseDetails(e)
	}
}

function getCollapseDetails(f){
     $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-1" style="font-weight:bold;">Supplier:</div><div class="col-5" >' + f.partnerData.partnerName + ' (' + f.partnerData.partnerCode + ')</div><div class="col-3" style="font-weight:bold;">Supplier Location:</div><div class="col-3" >' + f.partnerLocationData.partnerLocationCode + '</div></div><div class="row"><div class="col-3" style="font-weight:bold;">Shipping Address:</div><div class="col-9" >' + f.shippingAddress.line1 + " " + f.shippingAddress.line2  + " " + f.shippingAddress.line3 + " " + f.shippingAddress.city + " " + f.shippingAddress.state + " " + f.shippingAddress.country + " " + f.shippingAddress.zip + '</div></div><div class="row"><div class="col-3" style="font-weight:bold;">Billing Address:</div><div class="col-9" >' + f.billingAddress.line1 + " " + f.billingAddress.line2  + " " + f.billingAddress.line3 + " " + f.billingAddress.city + " " + f.billingAddress.state + " " + f.billingAddress.country + " " + f.billingAddress.zip + '</div></div></div><div>&nbsp;</div>')
     $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2" style="font-weight:bold;">OrderItemCode</div><div class="col-2" style="font-weight:bold;">Channel SKU</div><div class="col-2" style="font-weight:bold;">Ordered Quantity</div>');
     for(var j in f.orderItems){
     var e = f.orderItems[j]
     $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2">' + e.orderItemCode + '</div><div class="col-2">' + e.channelSkuCode + '</div><div class="col-2">' + e.orderedQuantity + '</div></div></div>');
     }
     $("#lineItems" + f.asimOrderId).append('<div>&nbsp;</div>');
 }

function init(){
	$('#search-order').click(getOrderForChannelOrderId);
}

$(document).ready(init);
$(document).ready(getChannels);