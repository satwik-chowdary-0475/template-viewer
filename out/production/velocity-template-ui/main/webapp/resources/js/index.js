
function getSessionStatus(){
    let url = $("meta[name=sessionStatusUrl]").attr("content");
    successFn = (responseData) => {
       window.location = $("meta[name=homeUrl]").attr("content");
    },
    errorFn = (errorData) => {
    };
    doAjax(url, 'GET',undefined, undefined, undefined, successFn, errorFn);
}

function init(){
    getSessionStatus();
}

$(document).ready(init);
