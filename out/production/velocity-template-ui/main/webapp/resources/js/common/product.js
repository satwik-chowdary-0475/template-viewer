function getProductUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/product";
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-product-modal').modal('toggle');
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#product-file');
	$file.val('');
	$('#product-file-name').html("Choose File");
}

function updateFileName(){
	var $file = $('#product-file');
	var fileName = $file.val();
	$('#product-file-name').html(fileName);
}

function getProductList(){
    var url = getProductUrl() + "/get-all";
	doAjax(url, 'GET', undefined, undefined, undefined, displayProductList, undefined )
}

function searchProduct(){
    if($('#search-product-form input[name=clientSkuId]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter clientSkuId"});
		return false;
	}
    let queryParams = {
            "clientSkuId": $('#search-product-form input[name=clientSkuId]').val()
        }
    var url = getProductUrl() + "/get";
    doAjax(url, 'GET', queryParams, undefined, undefined, displayProductList, undefined);
    $("#search-product-form")[0].reset();
    return false;
}

//UI DISPLAY METHODS
function displayProductList(data){
	var $thead = $('#product-table').find('thead');
	var $tbody = $('#product-table').find('tbody');
	$thead.empty();
	var row='<tr>'
	    	+ '<th scope="col" style="width: 10%;">Barcode</th>'
	    	+ '<th scope="col" style="width: 10%;">ChannelSerialNumber</th>'
	    	+ '<th scope="col" style="width: 10%;">ChannelSkuCode</th>'
            + '<th scope="col" style="width: 10%;">Name</th>'
            + '<th scope="col" style="width: 10%;">Brand</th>'
            + '<th scope="col" style="width: 7%;">Category</th>'
            + '<th scope="col" style="width: 5%;">Color</th>'
            + '<th scope="col" style="width: 5%;">HSN</th>'
            + '<th scope="col" style="width: 5%;">MRP</th>'
            + '<th scope="col" style="width: 5%;">Size</th>'
            + '<th scope="col" style="width: 5%;">Style</th>'
            + '<th scope="col" style="width: 8%;">Image Url</th>'
            + '<th scope="col" style="width: 5%;">Tax Rule</th>'
            + '<th scope="col" style="width: 5%;">Action</th>'
	    + '</tr>';
	$thead.append(row);
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		e.mrp = (Number(e.mrp)*100)/100;
		e.mrp = (e.mrp).toFixed(2)
		var buttonHtml = ' <button class="btn-sm btn btn-outline-primary" onclick="audit(\'product\',' + e.globalSkuId + ')">History</button>';
		var row = '<tr>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>' + e.channelSerialNo + '</td>'
		+ '<td>' + e.channelSkuCode + '</td>'
		+ '<td>'  + e.name + '</td>'
		+ '<td>'  + e.brand + '</td>'
		+ '<td>'  + e.category + '</td>'
		+ '<td>'  + e.color + '</td>'
		+ '<td>'  + e.hsn + '</td>'
		+ '<td>'  + e.mrp + '</td>'
		+ '<td>'  + e.size + '</td>'
		+ '<td>'  + e.styleCode + '</td>'
		+ '<td>'  + e.imageUrl + '</td>'
		+ '<td>'  + e.taxRule + '</td>'
		+ '<td>' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
}

function processData(){
	var file = $('#product-file')[0].files[0];
	if(file == undefined){
		notifyWarn({"title": "Warning", "value": "Please Select File"});
		return false;
	}
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	var json=[];
	var i = 0;
	for(var i in fileData){
	var row = fileData[i];
	json.push(row);
	}
	var Json = {}
	Json["list"] = json;
	console.log(Json);
	uploadFile(Json);
}

function uploadFile(json){
	//Make ajax call
	successFn = (response) => {
    		   	getProductList();
    			$('#upload-product-modal').modal('toggle');
    	   },
	errorFn = (response) => {
    	    document.getElementById("download-errors").disabled = false;
    	   	document.getElementById("download-errors").classList.add('btn-danger');
    		document.getElementById("download-errors").classList.remove('btn-outline-danger');
    	   	let errorList=JSON.parse(response.responseText)['message'];
    	   	if(errorList[0]=="[")
    	   	{
    	   		errorList = errorList.substring(1,errorList.length-1);
    	   		errorList = errorList.split(",");
    	   		console.log(errorList);
    		    var app={};
    		    for(var i=0;i<errorList.length;i++){
    		    	var error = errorList[i].split(":")
    		    	index = Number(error[1]);
    		    	var row = fileData[index];
    		    	i++;
    		    	error = errorList[i].split(":")
    		    	console.log(error);
    		    	error = error[1].substring(1,error[1].length-2);
    		    	row.error = error;
    		    	errorData.push(row);
    		    }
    		}
    	   	else{
    	   	 validationError(errorList,errorData);
    		}
    		updateUploadDialog();
    	    };
    var url = getProductUrl() + "/add";
    	console.log(json);
    doAjax( url, 'POST', undefined, json, undefined, successFn, undefined )
}

function showHistory(){
	$('#view-sku-history').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#refresh').click(getProductList);
	$('#upload-product').click(displayUploadData);
	$('#sku-history').click(showHistory);
	$('#process-data').click(processData);
    $('#search-product').click(searchProduct);
    showFileNameOnInput("product-file");
}

$(document).ready(init);
$(document).ready(getProductList);