function getOutwardOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/outward-order";
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

function getPostOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/post/b2b-order";
}

function getAllOrderList(){
    var url = getOutwardOrderUrl() + "/get-all";
    let queryParams = {
    "type": "ERP"
    };
	doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined )
}

function getOrderForChannelOrderId(){
var channelName = document.getElementById("select-channel").value;
var orderId = $('#search-order-form input[name=channelOrderId]').val();
    if(channelName == "" && orderId == ""){
    		notifyWarn({"title": "Warning", "value": "Please enter outward order Id or channel Id."});
    		return false;
    	}
    	$("#search-order-form")[0].reset();
        if(channelName == ""){
           var url = getOutwardOrderUrl() + "/get-all";
                   let queryParams = {
                                   "orderId": orderId,
                                   "channelType": "ERP"
                               }

                   doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
                   return false;
        }

        if(orderId == ""){
               var url = getOutwardOrderUrl() + "/get-all";
                       let queryParams = {
                                       "channelName": channelName,
                                       "channelType": "ERP"
                                   }

                       doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
                       return false;
            }
        else{
            var url = getOutwardOrderUrl() + "/get-all";
            let queryParams = {
                            "orderId": orderId,
                            "channelName": channelName,
                            "channelType": "ERP"
                        }
            doAjax(url, 'GET', queryParams, undefined, undefined, displayOrderList, undefined)
            return false;
        }

    return false;
}

function displayOrderList(data){
    var $thead = $('#outward-order-table').find('thead');
	var $tbody = $('#outward-order-table').find('tbody');
	$thead.empty();
	var row='<tr>'
	    	+ '<th scope="col" style="width: 20%;">Channel Order Id/Parent Order Id</th>'
	    	+ '<th scope="col" style="width: 15%;">Channel Name</th>'
            + '<th scope="col" style="width: 20%;">Order Time</th>'
            + '<th scope="col" style="width: 15%;">Customer</th>'
            + '<th scope="col" style="width: 10%;">Location Code</th>'
            + '<th scope="col" style="width: 10%;">Order Type</th>'
            + '<th scope="col" style="width: 10%;"></th>'
	    + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
        var partnerName ;
        var parentOrderCode = "/"
        if(e.parentOrderCode == null || e.parentOrderCode === ""){
            parentOrderCode = ""
        }
        else{
           parentOrderCode = parentOrderCode + e.parentOrderCode
        }
        if(e.partnerData == null || e.partnerData === ""){
            partnerName=""
        }
        else{
            partnerName = e.partnerData.partnerName;
        }
		var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'outward-order\',' + e.asimOrderId + ')">History</button>';
		var row = '<tr>'
		+ '<td class="align-middle border-top-0 p-2" data-toggle="collapse" href="#orderActions' + e.asimOrderId + '">' + e.channelOrderCode + parentOrderCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.channelId + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderTime + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + partnerName + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.locationCode + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + e.orderType + '</td>'
		+ '<td class="align-middle border-top-0 p-2">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
        row = '<tr><td colspan="20"><div class="panel-collapse collapse" id="orderActions' + e.asimOrderId + '"><div class="panel-group"><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse">'
              + '<h5 class="panel-title"><a data-toggle="collapse" href="#collapseOrderDetails' + e.asimOrderId + '">Order details</a>'
               + '</h5></div><div id="collapseOrderDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="orderDetails' + e.asimOrderId + '"><div class="row">    &nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><h5 class="panel-title"><a data-toggle="collapse" href="#collapseItemDetails' + e.asimOrderId + '">Order Items</a></h5></div><div id="collapseItemDetails' + e.asimOrderId + '" class="panel-collapse collapse"><div class="container" id="lineItems' + e.asimOrderId + '"><div class="row">&nbsp;</div></div></div><div class="card-header border-bottom-0 pointer shadow-sm bg-white" data-toggle="collapse"><div class="col-md-3 py-0"><div class="posting-file"><input type="file" class="custom-file-input" id="posting-file-' + e.asimOrderId + '"><label class="custom-file-label" for="posting-file-' + e.asimOrderId + '" id="posting-file-name-' + e.asimOrderId + '">Choose file</label></div></div><button class="btn-sm btn btn-outline-primary ml-1 mr-2" id="post-order" onclick="postOrder(' + e.asimOrderId + ')">Post Order</button></div></div></div></div></div></td></tr>';
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

function postOrder(asimOrderId){
    var file = $('#posting-file-' + asimOrderId )[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please select file first"});
		return false;
	}
	customReadFileData(file, asimOrderId, readFileDataCallback);
}

function customReadFileData(file, asimOrderId, callback){
	var config = {
		header: true,
		delimiter: ",",
		skipEmptyLines: "greedy",
		complete: function(results) {
			callback(results, asimOrderId);
	  	}
	}
	Papa.parse(file, config);
}

function readFileDataCallback(results, asimOrderId){
	fileData = results.data;
	uploadRows(asimOrderId);
}

function uploadRows(asimOrderId){
	//Update progress
	var json=[];
	for(var i in fileData){
	var row = fileData[i];
	json.push(row);
	}
	console.log(json);
	var Json = {}
	Json["items"] = json;
	uploadFile(Json, asimOrderId);
}

function uploadFile(json, asimOrderId){
	//Make ajax call
    var url = getPostOrderUrl();
    console.log(json);
    let queryParams = {
                "asimOrderId": asimOrderId
       };
    doAjax( url, 'POST', queryParams, json, undefined, undefined, undefined )
}

function updateFileName(asimOrderId){
	var $file = $('#posting-file-' + asimOrderId);
	var fileName = $file.val();
	$('#grn-file-name').html(fileName);
}

function init(){
	$('#search-order').click(getOrderForChannelOrderId);
	showFileNameOnInput();
}

$(document).ready(init);
$(document).ready(getChannels);