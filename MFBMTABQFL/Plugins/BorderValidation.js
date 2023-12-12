
function ChangePasswordsvalidation() {
    if ($('#txtoldpwd').val() == null || $('#txtoldpwd').val() == '') {
        $('#txtoldpwd').css('border', '1px solid red');
    }
    else {
        $('#txtoldpwd').css('border', '1px solid #ccc');
    }

    if ($('#txtnewpwd').val() == null || $('#txtnewpwd').val() == '') {
        $('#txtnewpwd').css('border', '1px solid red');
    }
    else {
        $('#txtnewpwd').css('border', '1px solid #ccc');
    }

    if ($('#txtconpwd').val() == null || $('#txtconpwd').val() == '') {
        $('#txtconpwd').css('border', '1px solid red');
    }
    else {
        $('#txtconpwd').css('border', '1px solid #ccc');
    }
}


function ForgotPasswordvalidation() {
    if ($('#txtEmailId').val() == null || $('#txtEmailId').val() == '') {
        $('#txtEmailId').css('border', '1px solid red');
    }
    else {
        $('#txtEmailId').css('border', '1px solid #ccc');
    }
}