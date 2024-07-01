let Attributes={},

function getConfigUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	console.log(baseUrl);
	return baseUrl + "api/channel";
}

function deleteAttr(key){
	delete Attributes[key]
	$('.'+key).tooltip('hide');
	makeUserAttrTable();
}

function makeUserAttrTable(){
	let $tbody =$('#user-attribute').find('tbody');
	$("#user-attribute > tbody").find("tr:not(:first)").remove();
	let row=''
	for(key in Attributes){
		row="<tr>"+
		"<td class='pl-2'>"+key+"</td>"+
		"<td class='pl-2'>"+Attributes[key]+"</td>"+
		'<td class="pl-3"><span class="'+key+' mdi mdi-delete pointer text-danger btn-sm" data-toggle="tooltip" data-placement="right" title="Delete" onclick="deleteAttr(\'' + key+ '\')" ></span></td>'+
		"</tr>";
		$tbody.append(row);
	}
	$('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })
}

function addKey(){
	if(!validateKeyValue())
		return;
	dismissDialog();
	let key = $('#attr-credential-key').val()
	let value = $('#attr-credential-value').val();
	Attributes[key.trim()]=value.trim();
	makeUserAttrTable();
	$('#attr-credential-key').val("")
	$('#attr-credential-key').removeClass('invalid-state').removeClass('valid-state');
	$('#attr-credential-value').val("");
	$('#attr-credential-value').removeClass('invalid-state').removeClass('valid-state');
}

function validateKeyValue(){
	let validated=true;
	let key = $('#attr-credential-key').val()
	let value = $('#attr-credential-value').val();
	if(!key ||key.trim().length==0){
		notifyWarn({"title": "Warning", "value": "Credential key is required."});
		validated= false;
	}

	if(!value ||value.trim().length==0){
		notifyWarn({"title": "Warning", "value": "Credential value is required."});
		validated= false;
	}

	if(Object.keys(Attributes).includes(key.trim())){
		notifyWarn({"title": "Warning", "value": "Credential Key is already present."});
		validated= false;
	}

	return validated;
}

function openAddChannelModal(){
	$('#add-channel-modal').modal('toggle');
}

function addChannel(){
if($('#channel-form input[name=channelName]').val().trim() == ""){
		notifyWarn({"title": "Warning", "value": "Please enter channel name."});
		return false;
	}
	$('#add-channel-modal').modal('toggle');
	var $form = $("#channel-form");
	var json = toJson($form);
	delete json['role'];
    	delete json['attr-credential-key']
    	delete json['attr-credential-value']
    	json['credentialMap']=Attributes;
    	console.log(json);
    	var url = getConfigUrl();
	doAjax(url, 'POST', null, json, undefined, undefined, undefined)
}

//INITIALIZATION CODE
function init(){
    getChannelList();
    $('#add-key').click(addKey);
	$('#add-new-channel').click(openAddChannelModal);
	$('#create-channel').click(addChannel);
}

$(document).ready(init);