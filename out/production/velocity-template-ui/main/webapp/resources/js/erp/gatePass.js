let dataGlobal;

function getGatePassUrl() {
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    return baseUrl;
}

function gatePassHandover(gatePassCode) {
    var url = getGatePassUrl() + "/api/gate-pass/handover"
    let queryParams = {
            "gatePassCode": gatePassCode
    }
    doAjax(url, 'POST', queryParams, undefined, undefined, undefined, undefined)
}

function getGatePassDetails() {
    if($('#search-gate-pass input[name=gatePassId]').val().trim() == "") {
        notifyWarn({"title": "Warning", "value": "Please enter Gate Pass Id."});
		return false;
    }
    else{
        var url = getGatePassUrl() + "/api/gate-pass/get-details"
        let queryParams = {
                            "gatePassCode": $('#search-gate-pass input[name=gatePassId]').val()
            }
            $('#search-gate-pass')[0].reset();
            doAjax(url, 'GET', queryParams, undefined, undefined, displayGatePassList, undefined)
            return false
    }
}

function displayGatePassList(data){
    dataGlobal = data;
    var $thead = $('#gate-pass-table').find('thead');
    var $tbody = $('#gate-pass-table').find('tbody');
    $thead.empty();
    var row='<tr>'
            + '<th scope="col" style="width: 30%;">Gate Pass Code</th>'
            + '<th scope="col" style="width: 25%;">Channel Warehouse Code</th>'
            + '<th scope="col" style="width: 15%;">Status</th>'
            + '<th scope="col" style="width: 30%;">Action</th>'
            + '</tr>';
    $thead.append(row);
    $tbody.empty();

    for(var i in data){
        var buttonHtml = ' <button class="btn-sm btn btn-outline-primary text-nowrap" onclick="orderDetails('+i+')">Shipment Details</button>';
        var handoverButton = ' <button class="btn-sm btn btn-outline-primary ml-2" onclick="gatePassHandover(\'' + data[i].gatePassCode + '\')">Gate Pass Handover</button>';

        var row = '<tr>'
        + '<td>' + data[i].gatePassCode + '</td>'
        + '<td>' + data[i].channelWarehouseCode + '</td>'
        + '<td>' + data[i].gatePassStatus + '</td>'
        + '<td><div class="d-flex">' + buttonHtml + '  ' + ((data[i].gatePassStatus === 'OPEN') ? handoverButton : '') + '</div></td>'
        + '</tr>';
        $tbody.append(row);
        }
}

function orderDetails(dataRowNumber){
    $('#gate-pass-modal').modal('toggle');
     var $thead = $('#shipment-details-table').find('thead');
             var $tbody = $('#shipment-details-table').find('tbody');
             $thead.empty();
                 var row='<tr>'
                         + '<th scope="col" style="width: 50%;">Order Code</th>'
                         + '<th scope="col" style="width: 50%;">Shipment Code</th>'
                         + '</tr>';

             $thead.append(row);
             $tbody.empty();
             for(var i in dataGlobal[dataRowNumber].shipmentDetailForm){
                 var e = dataGlobal[dataRowNumber].shipmentDetailForm[i];
                 var row = '<tr>'
                 + '<td>' + e.orderCode + '</td>'
                 + '<td>' + e.shipmentCode + '</td>'
                 + '</tr>';
                 $tbody.append(row);
                 }
 }

function cancelOrder(passCode){
    var url = getGatePassUrl() + "/push/gate-pass/cancel"
    let queryParams = {
                                "gatePassCode": passCode
                }
    doAjax(url, 'PUT', queryParams, undefined, undefined, undefined, undefined)
}

function init(){
	$('#fetch-gate-pass').click(getGatePassDetails);
}



$(document).ready(init);