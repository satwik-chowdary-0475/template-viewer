/**
 * This file with have methods to interact with the server via REST calls
 */

/**
 * Common handler to make ajax request
 * @param {*} url : REST API url
 * @param {*} method : request method
 * @param {*} queryParam : query params to be passed if any
 * @param {*} data : data to be passed
 * @param {*} requestDataType : data type (pass 'File' when handling files else keep empty/undefined/null)
 * @param {*} successFn : Function to be called on success
 * @param {*} errorFn : Function to be called on error
 */
function doAjax(url, method, queryParam, data, requestDataType, successFn, errorFn) {
    let ajaxOptions = {
        url: (queryParam) ? url + '?' + $.param(queryParam) :url,
        type: method,
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (responseData) => {
            snackSuccess();
            dismissDialog();
            if(successFn) successFn.call(successFn, responseData);
        },
        error: (errorResponse) => handleAjaxError(errorFn, errorResponse),
    };
    if(data) ajaxOptions['data'] = JSON.stringify(data);
    if(requestDataType==='File'){
        ajaxOptions['contentType'] = false;
        ajaxOptions['processData'] = false;
        ajaxOptions['data'] = data;
    }
    snackWait();
    $.ajax(ajaxOptions);
}

/**
 * Method to handle error received in ajax REST call
 * @param {*} errorFn : specific function to be called on error
 * @param {*} errorResponse : error response received from ajax REST call
 */
function handleAjaxError(errorFn, errorResponse){
    snackError();
    dismissDialog();
    if(errorFn) errorFn.call(errorFn,errorResponse);
    displayError(errorResponse);
}

/**
 * Method to create proper error message and display them
 * @param {*} errorResponse : error response received from ajax REST call
 */
function displayError(errorResponse){
    let notifyOptions;
    $.getJSON( "../../resources/json/http-error-response.json", (errorMessages) => {
        if(errorResponse.status > 499){
            console.error("\n\n error response = ", errorResponse.responseText);
        }
        if(errorResponse.status === 0){
            notifyError({"title": "Error", "value": errorMessages[errorResponse.status]});
            return;
        }
        try {
            let responseObj = JSON.parse(errorResponse.responseText);
            if(!responseObj['message']) {
                notifyError({"title": `${errorResponse.status} Error`, "value": errorMessages[errorResponse.status]});
                return;
            }
            notifyOptions = {"title": `${responseObj['code']}`, "value": `${responseObj['message']}`};
            if(responseObj['errors']) {
                for (let errorObj of responseObj['errors']) { 
                    notifyOptions['value'] += ` ${errorObj.field} ${errorObj.message}`;
                } 
            }
            notifyError(notifyOptions);
            return;
        } catch (error) {
            notifyError({"title": "Error", "value": errorMessages[errorResponse.status]});
        }
    });
}