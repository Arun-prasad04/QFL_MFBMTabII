

function PostMethod(Api, Json, token, callback) {

    //LoaderShow();

    setTimeout(function () {

        $.ajax({

            type: "POST",

            contentType: "application/json; charset=utf-8",

            "headers": {

                "authorization": "Basic " + token

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

                //LoaderHide();

            },

            error: handleError

        });

    }, 10);

}

function PostMethodNoLoader(Api, Json, token, callback) {



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

            //  LoaderHide();

        },

        error: handleError

    });



}

function JsonPostMethod(Api, Json, token, callback) {

    LoaderShow();

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

                LoaderHide();

            },

            error: handleError

        });

    }, 10);



}

function GetMethod(Api, token, callback) {

    LoaderShow();

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

                LoaderHide();

            },

            error: handleError

        });

    }, 10);



}

function handleError(xhr, status, error) {

    LoaderHide();

    console.log(xhr.status);

    if (xhr.status == 401) {

        window.location.assign("../Home/LogOut")

    }

    console.log(status);

    console.log(error);

    return false;

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
//    console.log(xhr.status);
//    if (xhr.status == 401) {
//        window.location.assign("../Home/LogOut")
//    }
//    console.log(status);
//    console.log(error);
//    return false;
//}