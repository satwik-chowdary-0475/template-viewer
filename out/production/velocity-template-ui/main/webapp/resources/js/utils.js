let $snackElem, $notifyTitleElem, $notifyBodyElem, snackTimeoutRef, notifyTimeoutRef;
var shipmentItems = new Array();
function snackWait(msg) { openSnackbar(msg ? msg : "Requesting...", true); }

function snackSuccess(msg) { openSnackbar(msg ? msg : "Successful"); }

function snackError(msg) { openSnackbar(msg ? msg : "Error Occurred"); }

function openSnackbar(msgStr, persistMsg) {
    clearTimeout(snackTimeoutRef);
    clearTimeout(snackTimeoutRef);
    $snackElem = $(".snackbar");
    $snackElem.addClass("active").empty().html(msgStr);
    adjustSnackPosition();
    $(window).on('resize scroll', adjustSnackPosition);
    if(persistMsg) {
        $("<div/>", {"class": "snack-overlay"}).appendTo($("body"));
        setTimeout(() => { document.activeElement.blur(); });
        return;
    }
    $(".snack-overlay").remove();
    snackTimeoutRef = setTimeout(() => { $snackElem.removeClass("active").removeAttr('style'); }, 800);
}

function notifyWarn(opts) {
    let options = {
        "class": "bg-warning text-dark",
        "title": "WARNING",
        "value": ""
    },
    updatedOpts = {...{}, ...options, ...opts};
    updatedOpts['value'] = updatedOpts['value'].replace(/\r\n|\r|\n/g, "<br>");
    showDialog(updatedOpts, true);
}

function notifySuccess(opts) {
    let options = {
        "class": "bg-success text-light",
        "title": "SUCCESS",
        "value": ""
    },
    updatedOpts = {...{}, ...options, ...opts};
    updatedOpts['value'] = updatedOpts['value'].replace(/\r\n|\r|\n/g, "<br>");
    showDialog(updatedOpts);
}

function notifyError(opts) {
    let options = {
        "class": "bg-danger text-light",
        "title": "ERROR",
        "value": ""
    },
    updatedOpts = {...{}, ...options, ...opts};
    updatedOpts['value'] = updatedOpts['value'].replace(/\r\n|\r|\n/g, "<br>");
    showDialog(updatedOpts, true);
    
}

function notifyAcknowledge(opts) {
    let options = {
        "class": "bg-info text-light",
        "title": "NOTE",
        "value": ""
    },
    updatedOpts = {...{}, ...options, ...opts};
    updatedOpts['value'] = updatedOpts['value'].replace(/\r\n|\r|\n/g, "<br>");
    showDialog(updatedOpts);
}

function showDialog(optsObj, persistMsg) {
    clearTimeout(notifyTimeoutRef);
    clearTimeout(notifyTimeoutRef);
    let $notifyElem = $(".notify-dialog");
    $notifyTitleElem = $notifyElem.find("h5 span");
    $notifyBodyElem = $notifyElem.find("p");
    $notifyElem.removeClass("bg-success bg-danger bg-warning bg-primary bg-info bg-light bg-dark text-success text-danger text-warning text-primary text-info text-light text-dark").addClass("active " + optsObj['class']);
    $notifyTitleElem.empty().html("" + optsObj['title']);
    $notifyBodyElem.empty().html("" + optsObj['value']);
    adjustToastPosition();
    $(window).on('resize scroll', adjustToastPosition);
    if(persistMsg) { return; }
    notifyTimeoutRef = setTimeout(dismissDialog, 5000);
}

function dismissDialog() {
    clearTimeout(notifyTimeoutRef);
    clearTimeout(notifyTimeoutRef);
    let $notifyElem = $(".notify-dialog");
    $notifyTitleElem = $notifyElem.find("h5");
    $notifyBodyElem = $notifyElem.find("p");
    $notifyElem.removeClass("active");
}

function adjustSnackPosition() {
    if(!$snackElem.hasClass('active')) { return; }
    let isFooter, winH = $(window).height() - 20,
    elem = document.elementsFromPoint(0, winH);
    for(let obj of elem) { if(obj.tagName == "FOOTER") { isFooter = true; } }
    isFooter ? $snackElem.attr("style", "bottom: 4.5rem") : $snackElem.removeAttr('style');
}


function adjustToastPosition() {
    let $notifyElem = $(".notify-dialog");
    if(!$notifyElem.hasClass('active')) { return; }
    let isNavbar, winW = $(window).width() - 10,
    elem = document.elementsFromPoint(winW, 20);
    for(let obj of elem) { if(obj.tagName == "NAV") { isNavbar = true; } }
    isNavbar ? $notifyElem.removeAttr('style') : $notifyElem.attr("style", "top: 2rem");
}

function getHistoryUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/history";
}


function audit(endPoint, id){
 url = getHistoryUrl() + "/" + endPoint;
 let queryParams = {
    "id": id
    };
    doAjax(url, 'GET', queryParams, undefined, undefined, displayHistoryModal, undefined )
}

function displayHistoryModal(data){
    $('#audit-modal').modal('toggle');
	var $tbody = $('#audit-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var buttonHtml1 = '<button type="button" class="btn btn-outline-primary btn-sm btn-copy-password material-icons md-16" data-toggle="tooltip" title="" id= "request" data-original-title="Copy Request" onclick=copyToClipboard(\'' + e.request + '\')>file_copy</button>';
        var buttonHtml2 = '<button type="button" class="btn btn-outline-primary btn-sm btn-copy-password material-icons md-16" data-toggle="tooltip" title="" id= "request" data-original-title="Copy Response" onclick=copyToClipboard(\'' + e.response + '\')>file_copy</button>';
		var row = '<tr>'
		+ '<td>'  + e.objectType + '</td>'
		+ '<td>'  + e.action + '</td>'
		+ '<td>'  + e.actionTime + '</td>'
		+ '<td>'  + buttonHtml1 + '</td>'
		+ '<td>'  + buttonHtml2 + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
}
//shipment history
function getShipmentUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "api/shipment";
}

function shipmentHistory(asimOrderId){
 url = getShipmentUrl() + "/shipment-ids";
 let queryParams = {
    "asimOrderId": asimOrderId
    };
    doAjax(url, 'GET', queryParams, undefined, undefined, shipmentHistoryBuffer, undefined )
}
function returnIds(data){
    return data;
}
function shipmentHistoryBuffer(data){
    var counter = 0;

      function handleAsyncOperation() {
        counter++;
        if (counter === data.length) {
          displayShipmentHistoryModal(data);
        }
      }
    for(var i = 0; i < data.length; i++) {
      shipmentItemFromId(data[i], handleAsyncOperation);
    }
}

function shipmentItemFromCode(shipmentCode){
 url = getShipmentUrl() + "/shipment-items";
 let queryParams = {
    "shipmentCode": shipmentCode
    };
    doAjax(url, 'GET', queryParams, undefined, undefined, displayShipmentHistoryModal, undefined )
}

function displayShipmentHistoryModal(data){
    $('#shipmentHistory-modal').modal('toggle');
	var $tbody = $('#shipmentHistory-table').find('tbody');
	$tbody.empty();
    for(var y = 0 ; y < data.length ; y ++){
        var shipmentItem = data[y];
        var row1 = '<tr>' +
        + '<td style="width: 10%;">' + '</td>'
        + '<td>' + (y+1) + '</td>'
        + '<td>' + shipmentItem.clientSkuId + '</td>'
        + '<td>' + shipmentItem.packQuantity + '</td>'
        + '</tr>';
        $tbody.append(row1);
    }
}

function copyToClipboard(value) {
     let $temp = $("<input/>", {"type": "text", "value": value,"id": 'copyId'}).appendTo($("#audit-modal"));
      $('#copyId').select();
      document.execCommand("copy");
      $temp.remove();
}

function convertToLocationForm(json, channelName){
    var json2={
        "locationCode":json.location,
        "channelName":channelName,
        "address": {
            "name":json.name,
            "email":json.email,
            "phone":json.phone,
            "line1":json.line1,
            "line2":json.line2,
            "line3":json.line3,
            "city":json.city,
            "state":json.state,
            "country":json.country,
            "zip":json.zip,
        }
    }
    return json2;
}