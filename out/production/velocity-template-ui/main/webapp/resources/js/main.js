let loggedInUser = {};
/**
 * Initial config load and method calls
 */
(() =>{
    initializeMain();
})();

/**
 * Method to initialize application
 */
async function initializeMain(){
    setSidebarLinkToggle();
    getLoggedInUserInfo();
}

/**
 * Method to get full url with context
 * @param {*} path 
 */
function getFullUrl(path){
	var context = $('meta[name=context]').attr('content');
	return context + path;
}

/**
 * Converting form data to JSON object
 * @param {*} formObj : form obj
 */
function serializeForm(formObj) {
    let returnObj = {},
    formArray = formObj.serializeArray();
    for(let obj of formArray) { if(obj['value'] && obj['value'] !== "null" && obj['value'] !== 'undefined') { returnObj[obj['name']] = obj['value']; } }
    return returnObj;
}

/**
 * Get url parameter
 * @param {*} sParam
 */
function getParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&');
    for(let obj of sURLVariables) {
        let sParameterName = obj.split('=');
        if(sParameterName[0] === sParam) { return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]); }
    }
}

/**
 * Get Date in format 'Month date, year'
 * @param {*} dateInMilliseconds 
 */
function getFormattedDate(dateInMilliseconds){
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let generatedDate = new Date(dateInMilliseconds);
    return `${monthNames[generatedDate.getMonth()]} ${generatedDate.getDate()}, ${generatedDate.getFullYear()}`;
}

function statusError(errorData){
        if( errorData.status == "403"){
            notifyError({"title": "Error", "value": "User not authenticated, redirecting to Login page"});
            setTimeout(3000);
            window.location = $("meta[name=loginUrl]").attr("content");
        }
        if(errorData.responseJSON && errorData.responseJSON.code =="AUTH_ERROR"){
            notifyError({"title": "Error", "value": "User not authenticated, redirecting to Login page"});
            setTimeout(3000);
            window.location = $("meta[name=loginUrl]").attr("content");
        }
        else{
            notifyError({"title": "Error", "value": "Error getting user Info, Please retry"});
            setTimeout(3000);
        }
}

/**
 * Method to get logged in user info
 */
function getLoggedInUserInfo(){
    let url = $("meta[name=sessionStatusUrl]").attr("content");
    successFn = (responseData) => {
        loggedInUser = responseData;
        $("#asim-logged-in-user").text(responseData.username);
    }
    doAjax(url, 'GET',undefined, undefined, undefined, successFn, statusError);
}


function showFileNameOnInput(){
    $('body').on('change', '.custom-file-input', function(ev) {
        let fileName = $(this).val();
        if(!fileName){
            fileName = 'Choose file';
        }
        $(this).next('.custom-file-label').text(fileName);
    });

}


function logout(){
    let url = $("meta[name=logoutUrl]").attr("content");
    let url1 = $("meta[name=sessionStatusUrl]").attr("content");
    successFn = (responseData) => {
            errorFn = (errorData) => {
                console.error("logout error", errorData);
            };
            doAjax(url, 'GET',undefined, undefined, undefined, undefined, errorFn);
            window.location = $("meta[name=loginUrl]").attr("content");
        };
    doAjax(url1, 'GET',undefined, undefined, undefined, successFn, statusError);
}
///**
// * Method to clear all document cookies (also cookies which have path parameters)
// */
//function clearAllCookies(){
//    const cookies = document.cookie.split("; ");
//    for (let i = 0; i < cookies.length; i++) {
//        const domains = window.location.hostname.split(".");
//        while (domains.length > 0) {
//            const cookieBase = encodeURIComponent(cookies[i].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + domains.join('.') + ' ;path=';
//            const paths = location.pathname.split('/');
//            document.cookie = cookieBase + '/';
//            while (paths.length > 0) {
//                document.cookie = cookieBase + paths.join('/');
//                paths.pop();
//            };
//            domains.shift();
//        }
//    }
//}


/**
 * Show current active link in sidebar
 */
function setSidebarLinkToggle(){
    $('.sectionMenu a').filter(function(){return this.href==location.href}).addClass('bg-light').siblings().removeClass('bg-light')
}


function readFileData(file, callback){
	var config = {
		header: true,
		delimiter: ",",
		skipEmptyLines: "greedy",
		complete: function(results) {
			callback(results);
	  	}
	}
	Papa.parse(file, config);
}

//HELPER METHOD
function toJson($form){
    var serialized = $form.serializeArray();
    var s = '';
    var data = {};
    for(s in serialized){
        data[serialized[s]['name']] = serialized[s]['value']
    }
    return data;
}

function AddControlMessage(id,msg){
    let prevMsg=$(id).next('control-messages');
    if(prevMsg.html()!=0)
        prevMsg.html("");
    prevMsg.append('<div class="position-absolute text-danger">'+msg+'</div>');
}

function addValidityClass(id,class1){
    $(id).removeClass('valid-state').removeClass('invalid-state');
    $(id).addClass(class1);
}

//function dismissDialog() {
//    $notifyElem = $(".toast");
//    clearTimeout(notifyTimeoutRef);
//    clearTimeout(notifyTimeoutRef);
//    $notifyElem.removeClass("active").removeAttr('style');
//}
