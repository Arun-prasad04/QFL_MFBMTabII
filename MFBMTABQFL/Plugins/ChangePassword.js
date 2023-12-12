
var hashes;
$(document).ready(function () {
    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    $('#btcloses1').css('display', '');
    $("#txtoldpwd").val('');
    $("#txtnewpwd").val('');
    $("#txtconpwd").val('');
    $('#txtoldpwd').css('border', '1px solid #ccc');
    $('#txtnewpwd').css('border', '1px solid #ccc');
    $('#txtconpwd').css('border', '1px solid #ccc');
    $('#ChangePassword').modal('show');

    $('#txtnewpwd').keyup(function () {
        $('#result').html(checkStrength($('#txtnewpwd').val()))
       
    })

    function checkStrength(password) {
        var strength = 0
        if (password.length < 6) {
            $('#result').removeAttr("class")
            $('#result').addClass('short')
            $('#password-strength-status').removeAttr("class")
            $('#password-strength-status').addClass('progshort')
            if (hashes[1].split('=')[1] == "jp") {
                return '短すぎる'
            }
            else {
                return 'Too short'
            }
        }
        if (password.length > 7) strength += 1
        // If password contains both lower and uppercase characters, increase strength value.
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
        // If it has numbers and characters, increase strength value.
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
        // If it has one special character, increase strength value.
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        // If it has two special characters, increase strength value.
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        // Calculated strength value, we can return messages
        // If value is less than 2
        if (strength < 2) {

            $('#result').removeAttr("class")
            $('#result').addClass('weak')
            $('#password-strength-status').removeAttr("class")
            $('#password-strength-status').addClass('progweak')
            if (hashes[1].split('=')[1] == "jp") {
                return '弱い'
            }
            else {
                return 'Weak'
            }
        } else if (strength == 2) {

            $('#result').removeAttr("class")
            $('#result').addClass('good')
            $('#password-strength-status').removeAttr("class")
            $('#password-strength-status').addClass('proggood')
            if (hashes[1].split('=')[1] == "jp") {
                return '良い'
            }
            else {
                return 'Good'
            }
        } else {
            $('#result').removeAttr("class")
            $('#result').addClass('strong')
            $('#password-strength-status').removeAttr("class")
            $('#password-strength-status').addClass('progstrong')
            if (hashes[1].split('=')[1] == "jp") {
                return '強い'
            }
            else {
                return 'Strong'
            }
        }
    }


    $("#ChangePasswordForm").validationEngine('attach', {
        onValidationComplete: function (form, status) {
            if (status == true) {
              
                if ($("#result").text() == "Strong" || $("#result").text() == "強い") {
                    ChangePasswords();
                }
                else {
                    if (hashes[1].split('=')[1] == "jp") {
                        alert("新しいパスワードを強くする");
                    }
                    else {
                        alert("New Password To be Strong");
                    }
                    return false;
                }
            }
            else {
                if ($("#txtnewpwd").val() == $("#txtconpwd").val()) {
                    ChangePasswordsvalidation();
                    return false;
                }
                else {
                    if (hashes[1].split('=')[1] == "jp") {
                        alert("パスワード");
                    }
                    else {
                        alert("Password Mismatch");
                    }
                    return false;
                }
            }
        },
        prettySelect: false,
        usePrefix: '',
        showOneMessage: true
    });






});

function ChangePasswords() {
    var oldpwd = $('#txtoldpwd').val();
    var newpwd = $('#txtnewpwd').val();
    var Api = $('#hdnApi').val();
    var ApiFunc = Api + 'QFL.svc/GetChangePassword';
    var email = $('#hdnEmailId').val();

    var Input = '{"strUserName":"' + email + '","strOldPassword":"' + oldpwd + '","strNewPassword":"' + newpwd + '"}';

    PostMethod(ApiFunc, Input, '', function (data) {
        if (data['strStatus'] == "true") {
            $('#ChangePassword').modal('hide');
            $('#DynamicAlertModal').modal('show');
            if (hashes[1].split('=')[1] == "jp") {
                $('#hTitle3').text('パスワードは正常に変更されました');
            } else {
                $('#hTitle3').text('Password Changed Successfully');
            }
            window.location.href = "Logout";
        }
        else {
            $('#DynamicAlertModal').modal('show');
            if (hashes[1].split('=')[1] == "jp") {
                $('#hTitle3').text('古いパスワードが間違っています');
            } else {
                $('#hTitle3').text('Old Password is wrong');
            }
        }
    });
}