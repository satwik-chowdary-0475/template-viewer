function getGeneralUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/channel";
}

function getFetchListingUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/skuListing/";
}

function displayChannelDropdown(data){
var select = document.getElementById("select-erp-channel");
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

function getChannelList(data){
  var url = getGeneralUrl() + "/channel-code"
  let queryParams = {
                  "channelName": data
  };
  doAjax(url, 'GET', queryParams, undefined, undefined, createChannelData, undefined )
}

function createChannelData(data)
{
  fillChannelDrop($('#select-channel'), data);
}

function fillChannelDrop(selectbody, data){
  var $selectbody=selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled>Select MarketPlace</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option value="' + e.channelName + '">' + e.channelName + '</option>';
    $selectbody.append(row);
  }
}

function fetchListings(){
    var erpChannelName = $("#select-erp-channel option:selected").val();
    var marketPlace = $("#select-channel option:selected").text();
    if(erpChannelName == "" || erpChannelName == "Select ERP Channel" || marketPlace == "" || marketPlace == "Select MarketPlace"){
		notifyWarn({"title": "Warning", "value": "Please Select Both"});
    }
    else{
        let queryParams = {
            "channelCode": marketPlace,
            "channelName": erpChannelName
        };
        var url = getFetchListingUrl() + "/get-all";
        doAjax(url, 'GET', queryParams, undefined, undefined, displayListings, undefined)
    }
}

function displayListings(data){
	var $thead = $('#listings-table').find('thead');
	var $tbody = $('#listings-table').find('tbody');
	$thead.empty();
	var row='<tr>'
	    	+ '<th scope="col" style="width: 20%;">Barcode</th>'
            + '<th scope="col" style="width: 20%;">ChannelSkuCode</th>'
	    	+ '<th scope="col" style="width: 20%;">ChannelSerialNumber</th>'
            + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
//		e.mrp = (Number(e.mrp)*100)/100;
//		e.mrp = (e.mrp).toFixed(2)
		//var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'product\',' + e.globalSkuId + ')">History</button>';
		var row = '<tr>'
		+ '<td>' + e.barcode + '</td>'
        + '<td>' + e.channelSkuCode + '</td>'
		+ '<td>' + e.channelSerialNo + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
}

function init(){
    $('#fetch-listings').click(fetchListings);
    $("#select-erp-channel").change(function () {
        var selectedText = $(this).find("option:selected").text();
        getChannelList(selectedText)
    });
}

$(document).ready(init);
$(document).ready(getChannels);