function getMagicUrlConfigUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/magic/channel-url";
}

function getConfigUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/channel";
}

function getChannelList(){
  var url = getConfigUrl() + "/marketplace";
  doAjax(url, 'GET', undefined, undefined, undefined, createChannelData, undefined )
}

function createChannelData(data)
{
  fillChannelDrop($('#select-channel'), data);
}

function fillChannelDrop(selectbody, data){
    if(data.length == 0){
    	notifyWarn({"title": "Warning", "value": "Please Configure MarketPlace Channels first"});
        return;
    }
    var $selectbody = selectbody;
    $selectbody.empty();
    var row = "<option selected hidden disabled>Select MARKETPLACE Channel</option>"
    $selectbody.append(row);
    for(var i in data){
    var e = data[i]
    row='<option value="' + e.channelName.toUpperCase() + '">' + e.channelName.toUpperCase() + '</option>';
    $selectbody.append(row);
    }
}

function getChannelList2(){
  var url = getConfigUrl() + "/marketplace";
  doAjax(url, 'GET', undefined, undefined, undefined, createAliasData, undefined )
}

function createAliasData(data)
{
  fillAliasDrop($('#select-alias'), data);
}

function fillAliasDrop(selectbody, data){
    if(data.length == 0){
    	notifyWarn({"title": "Warning", "value": "Please Configure MarketPlace Channels first"});
        return;
    }
  var $selectbody = selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled>Select MARKETPLACE Channel</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option value="' + e.channelName.toUpperCase() + '">' + e.channelName.toUpperCase() + '</option>';
    $selectbody.append(row);
  }
}

function searchUrls() {
    var channelAlias = $("#select-channel option:selected").val();
    if(channelAlias == "" || channelAlias == "Select MARKETPLACE Channel"){
    		notifyWarn({"title": "Warning", "value": "Please Select Channel"});
    		return;
    }
    var url = getMagicUrlConfigUrl() ;
    let queryParams = {
                "channelAlias": channelAlias,
                "channelType": "MARKETPLACE"
            };
    doAjax(url, 'GET', queryParams, undefined, undefined, createUrlTable, undefined )
}

function createUrlTable(data) {
    var $thead = $('#magic-url-table').find('thead');
    var $tbody = $('#magic-url-table').find('tbody');
    $thead.empty();
    var row='<tr>'
            + '<th scope="col" style="width: 40%;">URL Name</th>'
            + '<th scope="col" style="width: 50%;">URL</th>'
            + '<th scope="col" style="width: 10%;">Action</th>'
            + '</tr>';
    $thead.append(row);
    $tbody.empty();
    for(var i in data.urlList){
        var e = data.urlList[i];
  var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="addUrl(\'' + data.channelAlias + '\',\'' + e.urlConstants + '\',\'' + e.url + '\', \'update\')">Update</button>';        var row = '<tr>'
        + '<td>' + e.urlConstants + '</td>'
        + '<td>' + e.url + '</td>'
        + '<td>' + buttonHtml + '</td>'
        + '</tr>';
        $tbody.append(row);
    }
}

function openAddModal() {
    $("#url-form")[0].reset();
    addUrl($("#select-channel option:selected").val(), undefined, undefined, "add");
}

function addUrl(alias, constant, channelUrl, action) {
	$('#url-modal').modal('toggle');
    $('#url-form input[name=url]').val("");
    if(action == "update"){
        $("#select-url-constant option[value='" + constant + "']").prop('selected', true);
        $('#select-url-constant').prop('disabled', true);
        $("#select-alias  option[value='" + alias + "']").prop('selected', true);
        $('#select-alias').prop('disabled', true);
        $('#url-form input[name=url]').val(channelUrl);
        $('#url-form input[name=action]').val(action);
    }
    if(action == "add"){
       $("#select-url-constant option[value='Select URL Name']").prop('selected', true);
       $("#select-alias  option[value='" + alias + "']").prop('selected', true);
       $('#select-url-constant').prop('disabled', false);
       $('#select-alias').prop('disabled', false);
       $('#url-form input[name=action]').val(action);
    }
}

function createConstants(data)
{
  fillConstantDrop($('#select-url-constant'), data);
}

function fillConstantDrop(selectbody, data){
  var $selectbody = selectbody;
  $selectbody.empty();
  var row = "<option selected hidden disabled value='Select URL Name' >Select URL Name</option>"
  $selectbody.append(row);
  for(var i in data){
    var e = data[i]
    row='<option value="' + e + '">' + e + '</option>';
    $selectbody.append(row);
  }
}

function submit() {
    var channelAlias = $("#select-alias option:selected").val();
    var constant = $("#select-url-constant option:selected").val();
    var url = $('#url-form input[name=url]').val();
    if(channelAlias == "" || channelAlias == "Select MARKETPLACE Channel" || constant == "" || constant == "Select URL Name" || url == "") {
        notifyWarn({"title": "Warning", "value": "All three fields are mandatory"});
        return;
    }
    $('#url-modal').modal('toggle');
    var url = getMagicUrlConfigUrl() ;
    var action = $('#url-form input[name=action]').val();
    var $form = $("#url-form");
    var json = toJson($form);
    json["urlConstants"] = constant;
    let queryParams = {
                "channelAlias": channelAlias,
                "channelType": "MARKETPLACE"
            };
    if(action == "update")
        doAjax(url, 'PUT', queryParams, json, undefined, searchUrls, undefined )
    else
        doAjax(url, 'POST', queryParams, json, undefined, searchUrls, undefined )
}

function getConstants(){
var url = getMagicUrlConfigUrl() + "/constants/marketplace";
    doAjax(url, 'GET', undefined, undefined, undefined, createConstants, undefined );
}

//INITIALIZATION CODE
function init() {
    $('#search-url').click(searchUrls);
    $('#add-url-modal').click(openAddModal);
    $('#submit').click(submit);
}

$(document).ready(init);
$(document).ready(getChannelList);
$(document).ready(getChannelList2());
$(document).ready(getConstants);

