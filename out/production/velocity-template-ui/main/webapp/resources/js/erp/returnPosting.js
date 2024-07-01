function getConfigUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/channel";
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

function getReturnsPostingUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/post/return-order";
}

function getChannelList(data){
  var url = getConfigUrl() + "/channel-code"
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
  var row = "<option selected hidden disabled>Select Channel</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option value="' + e.channelName + '">' + e.channelName + '</option>';
    $selectbody.append(row);
  }
}

function getLocationList(data){
    var url = getConfigUrl() + "/location"
    let queryParams = {
                    "channelName": data
                };
    doAjax(url, 'GET', queryParams, undefined, undefined, createLocationData, undefined )
}

function createLocationData(data)
{
  fillLocationDrop($('#select-location'), data);
}

function fillLocationDrop(selectbody, data){
  var $selectbody=selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled>Select Location</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option>' + e + '</option>';
    $selectbody.append(row);
  }
}

function postReturnOrder(){
    var channel = $("#select-channel option:selected").val();
    var location = $("#select-location option:selected").text();
    var erpChannelName = document.getElementById("select-erp-channel").value;
    if(channel == "" || channel == "Select Channel" || location == "" || location == "Select Location"){
		notifyWarn({"title": "Warning", "value": "Please Select Both"});
    }
    else{
        let queryParams = {
            "channelCode": channel,
            "locationCode": location,
            "channelName": erpChannelName
        };
        var url = getReturnsPostingUrl();
        doAjax(url, 'POST', queryParams, undefined, undefined, undefined, undefined)
    }
}

function fetchErpChannelData(){
     var erpChannelName = document.getElementById("select-erp-channel").value;
     getChannelList(erpChannelName);
     getLocationList(erpChannelName);
}

//INITIALIZATION CODE
function init(){
    $('#post-return-order').click(postReturnOrder);
    $('#fetch-erp-channel').click(fetchErpChannelData);
}

$(document).ready(init);
$(document).ready(getChannels);