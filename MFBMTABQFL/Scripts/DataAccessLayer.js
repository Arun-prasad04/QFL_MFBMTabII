
function PostMethod(Api, Json, token, callback) {

    showloader();

    setTimeout(function () {

        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            //"headers": {

            //    "Authorization": "Basic " + token

            //},

            url: Api,

            dataType: "json",

            data: Json,

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }
                hideloader();


            },

            error: handleError

        });

    }, 10);

}

function PostMethodForUpdate(Api, Json, token, callback) {



    setTimeout(function () {

        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            //"headers": {

            //    "Authorization": "Basic " + token

            //},

            url: Api,

            dataType: "json",

            data: Json,

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }
                hideloader();


            },

            error: handleError

        });

    }, 10);

}

function PostMethodNoLoader(Api, Json, token, callback) {

    showloader();
    setTimeout(function () {
        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            "headers": {

                "Authorization": "Basic " + token

            },

            url: Api,

            dataType: "json",

            data: Json,

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }

                hideloader();

            },

            error: handleError

        });
    }, 10);
}

function JsonPostMethod(Api, Json, token, callback) {

    showloader();

    setTimeout(function () {

        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            url: Api,

            dataType: "json",

            data: Json,

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }

                hideloader();

            },

            error: handleError

        });

    }, 10);



}

function JsonPostMethodNoLoader(Api, Json, token, callback) {


    setTimeout(function () {

        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            url: Api,

            dataType: "json",

            data: Json,

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }


            },

            error: handleError

        });

    }, 10);



}


function GetMethod(Api, token, callback) {

    showloader();

    setTimeout(function () {

        $.ajax({

            type: "GET",

            contentType: "application/json; charset=utf-8",

            "headers": {

                "Authorization": "Basic " + token

            },

            url: Api,

            dataType: "json",

            cache: false,

            async: false,

            crossDomain: true,

            success: function (data) {

                if (typeof callback == 'function') {

                    callback.call(this, data);

                }

                hideloader();

            },

            error: handleError

        });

    }, 10);



}

function handleError(xhr, status, error) {



    console.log(xhr.status);

    if (xhr.status == 401) {

        window.location.assign("../Home/LogOut")

    }
    hideloader();
    console.log(status);

    console.log(error);

    return false;

}

function FilePostMethod(Api, formData, token, callback) {
    showloader();
    setTimeout(function () {
        $.ajax({
            url: Api,
            type: 'POST',
            data: formData,
            //headers: {
            //    "Authorization": "Basic " + token
            //},
            contentType: false,
            processData: false,
            success: function (data) {
                if (typeof callback == 'function') {
                    callback.call(this, data);
                }
                hideloader();
            },
            error: handleError
        });
    }, 10);
}

function StandardFilePostMethod(Api, formData, token, callback) {
    showloader();
    setTimeout(function () {
        $.ajax({
            url: Api,
            type: 'POST',
            data: formData,
            //headers: {
            //    "Authorization": "Basic " + token
            //},
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            success: function (data) {
                if (typeof callback == 'function') {
                    callback.call(this, data);
                }
                hideloader();
            },
            error: handleError
        });
    }, 10);
}



//function PostMethod(Api, Json, token, callback) {
//    $.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        //"headers": {
//        //    "Authorization": token
//        //},
//        url: Api,
//        dataType: "json",
//        data: Json,
//        cache: false,
//        sync: true,
//        crossDomain: true,
//        success: function (data) {
//            if (typeof callback == 'function') {
//                callback.call(this, data);
//            }
//        },
//        error: handleError
//    });

//}

//function JsonPostMethod(Api, Json, token, callback) {
//    $.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: Api,
//        dataType: "json",
//        data: Json,
//        cache: false,
//        sync: true,
//        crossDomain: true,
//        success: function (data) {
//            if (typeof callback == 'function') {
//                callback.call(this, data);
//            }
//        },
//        error: handleError
//    });
//}

//function GetMethod(Api, token, callback) {

//    $.ajax({
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        //"headers": {
//        //    "Authorization": token
//        //},
//        url: Api,
//        dataType: "json",
//        cache: false,
//        sync: true,
//        crossDomain: true,
//        success: function (data) {
//            if (typeof callback == 'function') {
//                callback.call(this, data);
//            }
//        },
//        error: handleError
//    });


//}


//function handleError(xhr, status, error) {
//    LoaderHide();
//   // console.log(xhr.status);
//    if (xhr.status == 401) {
//        window.location.assign("../Home/LogOut")
//    }
//  //  console.log(status);
//  //  console.log(error);
//    return false;
//}