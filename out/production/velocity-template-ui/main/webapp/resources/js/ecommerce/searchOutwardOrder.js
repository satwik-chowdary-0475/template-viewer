function getOutwardOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/outward-order";
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

function getOrderForChannelOrderId(){
var channelName = document.getElementById("select-channel").value;
var orderId = $('#search-outward-order input[name=outwardOrderId]').val();
    if(channelName == "" && orderId == ""){
		notifyWarn({"title": "Warning", "value": "Please enter outward order Id or channel Id."});
		return false;
	}
	$("#search-outward-order")[0].reset();
	if(channelName == ""){
	   var url = getOutwardOrderUrl() + "/get-all";
               let queryParams = {
                               "orderId": orderId,
                               "channelType": "MARKETPLACE"
                           }
                           $("#search-outward-order")[0].reset();
               doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
               return false;
	}

	if(orderId == ""){
    	   var url = getOutwardOrderUrl() + "/get-all";
                   let queryParams = {
                                   "channelName": channelName,
                                   "channelType": "MARKETPLACE"
                               }
                               $("#search-outward-order")[0].reset();
                   doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
                   return false;
    	}
	else{
        var url = getOutwardOrderUrl() + "/get-all";
        let queryParams = {
                        "orderId": orderId,
                        "channelType": "MARKETPLACE",
                        "channelName": channelName
                    }
        doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
        return false;
	}
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
        		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#orderActions' + e.asimOrderId + '">' + e.channelOrderCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.channelId + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.parentOrderCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + e.orderTime + '</td>'
        		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
        		+ '</tr>';
                $tbody.append(row);
                row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderActions' + e.asimOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse">'
                +'<h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderDetails' + e.asimOrderId + '">Order details</a>'
                +'</h5></div><div id="collapseOrderDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimOrderId + '"><!-- Blank Row --><div class="row">    &nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimOrderId + '">Order Items</a></h5></div><div id="collapseItemDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div></div></div></div></div></td></tr>';
        	    $tbody.append(row);
        	    getCollapseDetails(e)
	}
}

function getCollapseDetails(f){
    let billingAddressLine1 = f.billingAddress.line2 + " " + f.billingAddress.line3;
    let billingAddressLine2 = f.billingAddress.city + " " + f.billingAddress.state + f.billingAddress.zip + " " + f.billingAddress.country;

    let shippingAddressLine1 = f.shippingAddress.line2 + " " + f.shippingAddress.line3;
    let shippingAddressLine2 = f.shippingAddress.city + " " + f.shippingAddress.state + f.shippingAddress.zip + " " + f.shippingAddress.country;

    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Order SLA:</div><div class="col-9" >' + f.turnAroundTime + '</div></div><div>&nbsp;</div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Start Processing Time:</div><div class="col-9" >' + f.startProcessingTime + '</div></div><div>&nbsp;</div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Billing Address:</div><div class="col-9" >' + f.billingAddress.name + '</div></div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + f.billingAddress.line1 + '</div></div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + billingAddressLine1 + '</div></div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + billingAddressLine2 + '</div></div><div>&nbsp;</div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;">Shipping Address:</div><div class="col-9" >' + f.shippingAddress.name + '</div></div>');
    $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + f.shippingAddress.line1 + '</div></div>');
        $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + shippingAddressLine1 + '</div></div>');
        $("#orderDetails" + f.asimOrderId).append('<div class="row"><div class="col-3" style="font-weight:bold;"></div><div class="col-9" >' + shippingAddressLine2 + '</div></div><div>&nbsp;</div>');
    $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2" style="font-weight:bold;">Channel SKU</div><div class="col-2" style="font-weight:bold;">Ordered Quantity</div><div class="col-2" style="font-weight:bold;">Selling Price</div><div class="col-2" style="font-weight:bold;">Shipping Charge</div><div class="col-2" style="font-weight:bold;">Channel Discount</div><div class="col-2" style="font-weight:bold;">Seller Discount</div>');
    $("#lineItems" + f.asimOrderId).append('<div>&nbsp;</div>');
    for(var j in f.orderItems){
    var e = f.orderItems[j]
    $("#lineItems" + f.asimOrderId).append('<div class="row"><div class="col-2">' + e.channelSkuCode + '</div><div class="col-2">' + e.orderedQuantity + '</div><div class="col-2">' + e.sellingPrice + '</div><div class="col-2">' + e.shippingCharge + '</div><div class="col-2">' + e.channelDiscount + '</div><div class="col-2">' + e.sellerDiscount + '</div></div></div>');
    $("#lineItems" + f.asimOrderId).append('<div>&nbsp;</div>');
    }
    $("#lineItems" + f.asimOrderId).append('<div>&nbsp;</div>');
}

function init(){
	$('#fetch-outward-order').click(getOrderForChannelOrderId);
}

$(document).ready(init);
$(document).ready(getChannels);