$(document).ready(function () {
   
    InitializeUrl();
    $("#ForgotPasswordForm").validationEngine('attach', {
        onValidationComplete: function (form, status) {
            if (status == true) {
                ForgotPassword();
            }
            else {
                ForgotPasswordvalidation();
                return false;
            }
        },
        prettySelect: false,
        usePrefix: '',
        showOneMessage: true
    });
});

var UserName;

var Api;

var UserDetails;

var Token;



function InitializeUrl() {
  
    var ApiFunc = 'Home/PageLoadData/';
    PostMethod(ApiFunc, '', '', function (data) {
        if (data != null && data != '') {
            UserDetails = data;
            UserName = data.UserName;
            Api = data.Api;
            Token = data.Token;
        }
        else {
            alert("Session Expired");
            window.location.href = "Login";
        }
    });
}

function ReqForgotPassword() {
    $('#txtEmailId').css('border', '1px solid #ccc');
    $('#txtEmailId').val('');
    $('#ForgotPassword').modal('show');
}

function ForgotPassword() {
    
    var password = eval($("#RandomPassword").html()) || ''
    var ApiFunc = Api + 'Login.svc/' + 'ResetPassword';
    var dataObject = JSON.stringify({
        "Email": $('#txtEmailId').val(),
        "RandomPassword": password
    });

    var Input = dataObject;

    PostMethod(ApiFunc, Input, '', function (data) {
        $('#ForgotPassword').modal('hide');
        $('#DynamicAlertModal').modal('show');
        if ($(".Languagepicker").find("option:selected").val() == "jp") {
            $('#hTitle3').text('新しいパスワードで電子メールが送信されました。メールを確認してください。');
        }
        else {
            $('#hTitle3').text('An email has been sent to you with a new password. Please check your email.');
        }
        
        $('#txtEmailId').val('')
    });
}


