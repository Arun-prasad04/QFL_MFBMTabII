var UserDetails;
var Api;
var Token;
var plantid;
var QgateId;
var ChecklistItemsAll;
var ModelNumber;
var Mode;
var CheckListItemStatus;
var VIN;
var blankChecklistItemId;
var QFLDefectPlaceItems = "";
var QFLCheckListItemId = "";
var QFLFeedbackSites = "";
var QFLFeedBackWorkflowId = "";
var VinIds;
var GateValid = "";
var GateName = "";
var CheckItemValue = "";
var filesdata = [];
var filedata = [];
var filecount = 0;
var fileid = 0;
var filesToUpload = [];
var Mfiles;
var En_Message;
var Jp_Message;

var IsSignature = "";
var disabled = "";
var signaturePath = "";
var OtherSite1 = "";
var OtherSite2 = "";
var OtherSite3 = "";
var OtherSite4 = "";
var OtherSite5 = "";
var OtherDamage = "";
var OtherDefectClass = "";
var QFLFeedbackSitesOther = "";
var StaticCheckListItemId = "";
var CheckListstatusItem = "";
var DefectStaticCheclist = "";
var DefectPlaceStaticItem = "";
var OtherMode = false;
var HandWrittenText = "";
var GetGateDetails = "";
var BindingBlankCheckItems = "";
var ClickNotOkItems = "";
var SelectedCheckListItemId = "";
var SelectedStaticCheckListItemId = "";
var OtherSiteCount = "";
var Reworkgateid
var ReExaminationgateid


$(document).ready(function () {


    $("#Completedbtn1").hide();
    $("#Completedbtn").hide();

    $("#liQFLFeedback").addClass("active");

    InitializeUrl();
    $("#webcameraPreviewdiv").hide();
    $('#txtVinQRNumber').keyup(function () {
        $(this).val($(this).val().toUpperCase());

        document.getElementById('txtVinQRNumber').addEventListener('input', function (e) {
            var target = e.target,
                position = target.selectionStart; // Capture initial position

            target.value = target.value.replace(/\s/g, '');  // This triggers the cursor to move.

            target.selectionEnd = position;    // Set the cursor back to the initial position.
        });

    });



    $('#feedback-search').on('click', function () {


        var textbox = document.getElementById("txtVinQRNumber");
        if (textbox.value.length >= 5) {
            showloader();
            if ($('#drpPlant').find(':selected').val() == 0) {

                hideloader();
                $('#DynamicAlertModal').modal('show');
                if (UserDetails.Language == "en") {
                    $('#hTitle3').text('Please select Plant to proceed');
                }
                else {
                    $('#hTitle3').text('続行するにはプラントを選択してください');
                }

            }
            else {


                GetLineIdDetails($('#drpPlant').find(':selected').val());

            }

        }
        else {

            if ($('#txtVinQRNumber').val() == '') {
                var validationsummary;
                validationsummary = validatefield($('#txtVinQRNumber'));
                return validationsummary;

            }
            else {
                showloader();
                hideloader();
                En_Message = 'Invalid VIN. Please check VIN again! ' + $('#txtVinQRNumber').val();
                Jp_Message = '無効なVIN。もう一度VINを確認してください ' + $('#txtVinQRNumber').val();

            }
            $('#DynamicAlertModal').modal('show');
            if (UserDetails.Language == "en") {
                $('#hTitle3').text(En_Message);
            }
            else {
                $('#hTitle3').text(Jp_Message);
            }

        }

    });

    $("#btnSearch").click(function () {

        AfterPopUpConfirmation();
    })

    $("#btnCancelSearch").click(function () {
        $("#Confirmationpopup").modal('hide');
    })

    $("#btnSearchDelete").click(function () {

        ActualComment();
    })
    $("#btndeleteconfirmation").click(function () {

        ActualMode = '';

    })

    $("#btnCancelSearchDelete").click(function () {
        $("#DeleteConfirmationpopup").modal('hide');
    })

    $("#btncancel").click(function () {
        $("#files1").val('');
        $("#AttachmentUpload").empty();
        filesToUpload = [];

    })




    $("#btnSearchVin").click(function () {
        showloader();
        Mode = "Y";
        GetCheckListItems(UserDetails.PlantId, QgateId, Mode)
    })
    $("#btnCancelSearchVin").click(function () {

        $("#ConfirmationpopupVin").modal('hide');
    })

    $("#btnSubmit").click(function () {
        QFLCheckListItemId = "";
        QFLDefectPlaceItems = "";

        for (var i = 1; i <= 43; i++) {

            var className = $("#QFLDefectPlace_" + i).attr('class');
            var DefectPlaceid = $("#QFLDefectPlace_" + i).val();
            var defectPlaceName = $("#QFLDefectPlace_" + i).text();
            if (className == "btn feedback-input-buttons btn-block feedback-input-buttons-click") {

                if (QFLDefectPlaceItems != "") {
                    QFLDefectPlaceItems = QFLDefectPlaceItems + ","
                }

                if (QFLCheckListItemId != "") {
                    QFLCheckListItemId = QFLCheckListItemId + ","
                }


                if (StaticCheckListItemId == "" || StaticCheckListItemId == "0") {
                    StaticCheckListItemId = DefectPlaceStaticItem;
                }

                QFLDefectPlaceItems = QFLDefectPlaceItems + defectPlaceName;


                QFLCheckListItemId = QFLCheckListItemId + DefectPlaceid;

                if (QFLCheckListItemId != "") {
                    $("#DefectValidation").hide();

                }
            }
        }






        $("#DefectValidation").text("");
        if (QFLCheckListItemId == "" && (StaticCheckListItemId == "" || StaticCheckListItemId == "0")) {
            $("#DefectValidation").show();

            if (UserDetails.Language == "en") {
                $("#DefectValidation").text("Please click the Button");
            }
            else {
                $("#DefectValidation").text("ボタンをクリックしてください");
            }
            return false;
        }




        var json = {
            "checklistitemid": QFLCheckListItemId,
            "defectplace": QFLDefectPlaceItems,
            "vinid": VinIds,
            "qgateid": QgateId,
            "staticchecklistitemid": StaticCheckListItemId
        };
        var Input = JSON.stringify(json);

        if (ClickNotOkItems == "NotOk") {
            var ApiFunc = Api + 'QFL.svc/GetDefectCheckListItemNotOk';
        }
        else {
            var ApiFunc = Api + 'QFL.svc/GetDefectCheckListItems';
        }
        PostMethod(ApiFunc, Input, Token, function (data) {

            QFLFeeedBackSitePopup(data);
        });
    })

    $("#btnSubmit1").click(function () {

        $("#DefectSiteValidation").text("");
        if (QFLCheckListItemId == "" && StaticCheckListItemId == "") {
            $("#DefectSiteValidation").show();
            if (UserDetails.Language == "en") {
                $("#DefectSiteValidation").text("Please click the Button");
            }
            else {
                $("#DefectSiteValidation").text("ボタンをクリックしてください");
            }
            return false;
        }
        SelectedCheckListItemId = QFLCheckListItemId;
        SelectedStaticCheckListItemId = StaticCheckListItemId;
        var Site = QFLFeedbackSites;
        if (Site == "Site 1") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "site1": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId

            };
        }

        else if (Site == "Site 2") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "site2": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId
            };
        }

        else if (Site == "Site 3") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "site3": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId
            };
        }

        else if (Site == "Site 4") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "site4": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId
            };
        }

        else if (Site == "Site 5") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "site5": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId
            };
        }

        else if (Site == "Damage") {
            var json = {
                "checklistitemid": QFLCheckListItemId,
                "damage": QFLDefectPlaceItems,
                "vinid": VinIds,
                "qgateid": QgateId,
                "staticchecklistitemid": StaticCheckListItemId
            };
        }

        var Input = JSON.stringify(json);

        var ApiFunc = Api + 'QFL.svc/GetDefectCheckListItems';
        PostMethod(ApiFunc, Input, Token, function (data) {
            if (data.listchecklistdefectitems.length <= 0) {
                return false;
            }
            if (data.qflselectedname == "DefectClass") {
                $("#myModal2").modal('hide');
                QFLFeeedBackDefectClassPopup(data)
            }
            else {
                QFLFeeedBackSitePopup(data);
            }
        });
    })

    $("#btnSubmit2").click(function () {

        $("#DefectClassValidation").text("");
        if (QFLCheckListItemId == "" && StaticCheckListItemId == "") {
            $("#DefectClassValidation").show();
            if (UserDetails.Language == "en") {
                $("#DefectClassValidation").text("Please click the Button");
            }
            else {
                $("#DefectClassValidation").text("ボタンをクリックしてください");
            }

            return false;
        }

        var json = {
            "checkitemstatus": 3,
            "qflfeedbackworkflowid": QFLFeedBackWorkflowId,
            "checklistitemid": QFLCheckListItemId,
            "gatename": GateName,
            "checkitemvalue": CheckItemValue,
            "userid": UserDetails.UserId,
            "staticchecklistitemid": StaticCheckListItemId

        };

        var Input = JSON.stringify(json);

        if (ClickNotOkItems == "NotOk") {
            var ApiFunc = Api + 'QFL.svc/UpdateCheckListItemsNotOk';
        }
        else {
            var ApiFunc = Api + 'QFL.svc/UpdateCheckListItemStatus';
        }

        //var ApiFunc = Api + 'QFL.svc/UpdateCheckListItemStatus';
        PostMethod(ApiFunc, Input, Token, function (data) {

            $("#myModal3").modal('hide');
            $("#DynamicAlertModal").modal('show');

            if (UserDetails.Language == "en") {
                $('#hTitle3').text('New defect added to the check item');
            }
            else {
                $('#hTitle3').text('チェック項目に新しい欠陥が追加されました');
            }
            GetCheckListItems(UserDetails.PlantId, QgateId, '')

        });
    });
    $('#bfile').click(function () {
        $("#files1").trigger("click");
    });


    if (window.File && window.FileList && window.FileReader) {
        $("#files1").on("change", function (e) {

            var files = $("#files1").get(0).files;
            //filedata = $("#files1").get(0).files;


            //CustomFileHandlingFunction(file);

            for (var i = 0; i < files.length; i++) {
                filesdata[filecount] = files[i];
                filecount++;

            }
            Mfiles = Mfiles + filedata;

            ///filedata = [];
            filename = [];
            var filesize = [];
            var content = [];
            var files;
            files = e.target.files,
                filesLength = files.length, loaded = 0;
            var filejson;
            var html = [];

            //LoaderShow();
            var i;
            for (i = 0; i < filesLength; i++) {
                var fileReader = new FileReader();
                var f;
                f = files[i];
                var fs = (f.size / 1024 / 1024).toFixed(2);
                var d = new Date();
                var getDateTime = (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '  ' +
                    d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());

                var deleteenable = 'none';
                var extt = f.name.replace(/^.*\./, '');
                var ext = extt.toLowerCase();


                if (ext == "xlsx" || ext == "pptx" || ext == "ppt" || ext == "xls" || ext == "csv" || ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "svg" || ext == "doc" || ext == "docx" || ext == "pdf" || ext == "mp4" || ext == "txt" || ext == "zip") {
                    //content.push('<span style="font-size: 12px; " id="' + fileid + '" class="trn label label-info ">' + f.name + ' <a onclick="deleteFile(\'' + fileid + '\',\'' + f.name + '\');" data-container="body" data-toggle="tooltip" data-placement="top" title="Delete"  type="button" class=" btn btn-danger rejectbtn btn-xs"><span class="glyphicon glyphicon-remove pull-right btn-group"></span></a></br></span>'); 
                    html += '<div class="col-md-6 mt-20" id="' + fileid + '" ><div class=" attachment-border"><div class="row"><div class="col-md-3 col-sm-3"><img alt="" class="img-responsive" src="../Images/' + CheckFileType(f.name) + '"> <p class="mbsize">'
                        + '<span> ' + fs.toString() + " MB" + '</span ></p >'
                        + '</div><div class="col-md-9 col-sm-9"><h4 class="overflow-attachment1"> ' + f.name + '</h4><p class="overflow-attachment2">' + UserDetails.UserName + ' </p>'
                        + '<label class="overflow-attachment3">' + getDateTime + '</label> <span class="pull-right btn-group"   onclick="deleteFile(\'' + fileid + '\',\'' + f.name + '\');"><i data-container="body" data-toggle="tooltip"  data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-trash"></span></i> </span>'
                        + '<span class="pull-right btn-group" onClick =""><i data-container="body"  disabled data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-save"></span></i> </span>'
                        + '</div></div></div></div>';
                    fileid++;
                    filename.push(f.name);
                    filesize.push(f.size);
                    fileReader.onload = (function (e) {
                        var file = e.target;
                        filedata.push(e.target.files);
                        loaded++;

                    });

                }
                else {


                    html += '<div class="col-md-6 mt-20" id="' + fileid + '" ><div class=" attachment-border"><div class="row"><div class="col-md-3 col-sm-3"><img alt="" class="img-responsive" src="../Images/' + CheckFileType(f.name) + '"> <p class="mbsize">'
                        + '<span> ' + fs.toString() + " MB" + '</span ></p >'
                        + '</div><div class="col-md-9 col-sm-9"><h4 class="overflow-attachment1"> ' + f.name + '</h4><p class="overflow-attachment2">' + UserDetails.UserName + ' </p>'
                        + '<label class="overflow-attachment3">' + getDateTime + '</label> <span class="pull-right btn-group"   onclick="deleteFile(\'' + fileid + '\',\'' + f.name + '\');"><i data-container="body" data-toggle="tooltip"  data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-trash"></span></i> </span>'
                        + '<span class="pull-right btn-group" onClick =""><i data-container="body"  disabled data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-save"></span></i> </span>'
                        + '</div></div></div></div>';
                    fileid++;
                    filename.push(f.name);
                    filesize.push(f.size);
                    fileReader.onload = (function (e) {
                        var file = e.target;
                        filedata.push(e.target.files);
                        loaded++;
                    });
                    //$('#hTitle3').empty();
                    //$('#DynamicAlertModal').modal('show');
                    //if (UserDetails.Language == 'en') {
                    //    $('#hTitle3').text('File Format Not Supported');

                    //}
                    //else {
                    //    $('#hTitle3').text('サポートされていないファイル形式');

                    //}





                }
            }
            //LoaderHide();

            $("#AttachmentUpload").append(html);
        });


    }
    else {
        $('#hTitle3').empty();
        $('#DynamicAlertModal').modal('show');
        $('#hTitle3').text('Your browser does not support to File API!..');

    }

    $("#Completedbtn").click(function () {


        var Signature;
        if (IsSignature == "Exists") {
            $("ExistingSignature").show();
            $("#Modelbody").removeClass("modal-bodySig1").addClass("modal-bodySig");

            var json = {
                "vinnumber": VIN,
                "gatename": GateName,
                "userid": UserDetails.UserId
            };
            var Input = JSON.stringify(json);

            var ApiFunc = Api + 'QFL.svc/GetSealGateDetails';
            PostMethod(ApiFunc, Input, Token, function (data) {

                if (data.listsealgate1 != null || data.listsealgate1 != "") {
                    if (GateName == "Rework" || GateName == "Re-Examination") {
                        Signature = data.listsealgate1;

                    }
                    else {
                        Signature = data.listsealgate1.filter(function (x) { return x.gateid == QgateId; });

                    }
                }
                //   $('#ExistingSignature').html('<img id="" src="../Signature/' + Signature[0].filename + '" width="300" />');

                $('#ExistingSignature').html('<img  id="" src="../Signature/' + Signature[0].filename + '" width="300" />');

            });


            if (UserDetails.Language == "en") {

                $('#SinganatureConfirmationMsg').text('Are you sure? Want to complete this VIN inspection in this Q-Gate?');
            }
            else {
                $('#SinganatureConfirmationMsg').text('本気ですか？このQ-GateでこのVIN検査を完了してみませんか？');

            }
            $('#SinganatureConfirmationpopup').modal('show');
        }

        else {
            $("#btnSinganature").trigger("click");
        }

    })



    $("#Completedbtn1").click(function () {

        //$('#ExistingSignature').hide();
        var Signature;

        if (IsSignature == "Exists") {
            $("#Modelbody").removeClass("modal-bodySig").addClass("modal-bodySig1");
            $('#ExistingSignature').html('<img id="" src="" />');

            $("ExistingSignature").hide();

            if (UserDetails.Language == "en") {

                $('#SinganatureConfirmationMsg').text('Are you sure? Want to cancel the completion of Inspection in the Q-Gate?');
            }
            else {
                $('#SinganatureConfirmationMsg').text('本気ですか？ Q-Gateでの検査完了をキャンセルしたいですか？');

            }
            $('#SinganatureConfirmationpopup').modal('show');
        }
        else {
            $("#btnSinganature").trigger("click");
        }

    })

    $("#btnSinganature").click(function () {
        $('#SinganatureConfirmationpopup').modal('hide');
        var Signature;
        if (IsSignature != "Exists") {
            $('#completed').modal('show');
        }
        else {
            var CompleteStatus = document.getElementById('Completedbtn').value;

            if (CompleteStatus == "Completed") {
                document.getElementById('Completedbtn1').value = "Revert Completion";

                document.getElementById('Completedbtn').value = "";

                $("#Completedbtn1").show();
                $("#Completedbtn").hide();
                document.getElementById("Qgateid_" + QgateId).style.backgroundColor = "darkgreen";

                if (GateName == "Rework") {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": false,
                        "vinnumber": VIN,
                        "isreworkcompleted": true,
                        "isreexaminationcompleted": false,
                        "gatename": GateName

                    };
                }
                else if (GateName == "Re-Examination") {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": false,
                        "vinnumber": VIN,
                        "isreworkcompleted": false,
                        "isreexaminationcompleted": true,
                        "gatename": GateName

                    };
                }
                else {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": true,
                        "vinnumber": null,
                        "isreworkcompleted": false,
                        "isreexaminationcompleted": false,
                        "gatename": GateName

                    };
                }

                var Input = JSON.stringify(json);
                var ApiFunc = Api + 'QFL.svc/InsertSignature';

                PostMethod(ApiFunc, Input, Token, function (data) {
                    GetCheckListItems(UserDetails.PlantId, QgateId, Mode);
                    // CompletedDetails();

                });

            }
            else {

                document.getElementById('Completedbtn1').value = "";

                document.getElementById('Completedbtn').value = "Completed";

                $("#Completedbtn1").hide();
                $("#Completedbtn").show();

                document.getElementById("Qgateid_" + QgateId).style.backgroundColor = "";


                if (GateName == "Rework") {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": false,
                        "vinnumber": VIN,
                        "isreworkcompleted": false,
                        "isreexaminationcompleted": false,
                        "gatename": GateName

                    };
                }
                else if (GateName == "Re-Examination") {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": false,
                        "vinnumber": VIN,
                        "isreworkcompleted": false,
                        "isreexaminationcompleted": false,
                        "gatename": GateName
                    };
                }
                else {
                    var json = {
                        "filename": "",
                        "vinid": VinIds,
                        "userid": UserDetails.UserId,
                        "iscompleted": false,
                        "vinnumber": null,
                        "isreworkcompleted": false,
                        "isreexaminationcompleted": false,
                        "gatename": GateName
                    };
                }

                var Input = JSON.stringify(json);
                var ApiFunc = Api + 'QFL.svc/InsertSignature';

                PostMethod(ApiFunc, Input, Token, function (data) {
                    GetCheckListItems(UserDetails.PlantId, QgateId, Mode);
                });

            }

        }


    })
})



function deleteFile(fileidx, name) {

    var fileName = name;


    filesToUpload[fileidx] = fileName;
    $('#' + fileidx).remove();

    //$(this).parent().remove();


}





function ReloadUserDetails(newlanguage) {
    UserDetails.Language = newlanguage;
}

function InitializeUrl() {
    //LoaderShow();
    var ApiFunc = '../Home/PageLoadData/';
  
    JsonPostMethod(ApiFunc, '', '', function (data) {
        if (data != null && data != '') {
            //console.log(data)
            UserDetails = data;
            Api = UserDetails.Api;
            Token = UserDetails.Token;
            signaturePath = UserDetails.SiganturePath;
            GetDropdownlistDetails();
            if (UserDetails.RoleId == 6) {
                if (UserDetails.AccessDetails.length > 0) {

                    $("#liProgressMonitor").hide();
                    $("#liQFLFeedback").hide()
                    $("#menuExtras").hide();
                    $("#limenuReports").hide();
                    var GateAccessEnabled = UserDetails.AccessDetails.filter(function (x) { return x.AccessType != "page" });
                    var ProgressMonitorEnabled = UserDetails.AccessDetails.filter(function (x) { return x.AccessName == "Progress Monitor" });
                    var QGateMasterEnabled = UserDetails.AccessDetails.filter(function (x) { return x.AccessName == "Master Access" });
                    var ReportAccess = UserDetails.AccessDetails.filter(function (x) { return x.AccessName == "Report Access" });
                    if (GateAccessEnabled.length > 0) {
                        $("#liQFLFeedback").show();
                    }
                    else {
                        $("#liQFLFeedback").hide()
                    }
                    if (ProgressMonitorEnabled.length > 0) {
                        $("#liProgressMonitor").show();
                    }
                    else {
                        $("#liProgressMonitor").hide()
                    }
                    if (QGateMasterEnabled.length > 0) {
                        $("#menuExtras").show();
                    }
                    else {
                        $("#menuExtras").hide()
                    }

                    if (ReportAccess.length > 0) {
                        $("#limenuReports").show();
                    }
                    else {
                        $("#limenuReports").hide()
                    }
                }
            }
            else {
                $("#liProgressMonitor").show();
                $("#liQFLFeedback").show()
                $("#menuExtras").show();
                $("#limenuReports").show();
            }
        }
        else {
            //alert("Session Expired");
            window.location.href = "Login";
        }
    });
}

function GetDropdownlistDetails() {

    var json = {
        "userid": UserDetails.UserId,
        "roleid": UserDetails.RoleId
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'QFL.svc/DropDownlistDetails';
    PostMethod(ApiFunc, Input, Token, function (data) {
        $("#drpPlant").empty();
        drpPlant = data.Plant;
        var len = drpPlant.length;
        var optionhtml1 = '<option selected="selected"  value="0"> Select </option>';
        $("#drpPlant").append(optionhtml1);
        var optionhtml = "";

        $.each(drpPlant, function (i, item) {

            if (item.plantid == UserDetails.PlantId || len == 1) {
                optionhtml = '<option selected="selected"  value="' +
                    item.plantid + '">' + item.plantname + '</option>';
            }
            else {
                optionhtml = '<option value="' +
                    item.plantid + '">' + item.plantname + '</option>';
            }


            $("#drpPlant").append(optionhtml);
            $("#drpPlant").selectpicker('refresh');
        });

        if (len == 1) {
            $('#drpPlant').prop('disabled', true);
            var PlantId = $('#drpPlant').find(':selected').val();

            MaintainPlantId(PlantId);

        }

        $('#drpPlant').change(function () {
            var PlantId = parseInt(jQuery(this).val());

            MaintainPlantId(PlantId);
            //GetCheckListItems(PlantId, QgateId);
        });

        if (UserDetails.Language == "") { $('.Languagepicker').selectpicker('val', 'en'); Conversion($('.Languagepicker').val()); }
        else {
            $('.Languagepicker').selectpicker('val', UserDetails.Language);
            Conversion($('.Languagepicker').val());
        }

    });
}

function BindingQGateList(data) {

    GetGateDetails = "";
    $("#GateDetailList").empty();
    var content = [];
    GetGateDetails = data;
    var Qgate = data.gatelist;
    if (Qgate == null || Qgate == "") {
        alert("This VIN and Model contains no Qgate")
        return false;
    }
    var OrderNo = 1;
    var GateCount = Qgate.length;
    GateCount = GateCount - 7;

    $.each(Qgate, function (i, GateList) {

        if (OrderNo == 1) {
            content.push('<div class=\"multiple feedback-gate gate-btn gate-active\" value="' + GateList.gatename + '" id="Qgateid_' + GateList.qgateid + '" onclick="CheckListItem(' + GateList.qgateid + ' )">');
            QgateId = GateList.qgateid;
            GateName = GateList.gatename
        }
        else {
            //if (GateList.gatename == "Rework" || GateList.gatename == "Re-Examination" || GateList.gatename == "Seal")
            //    content.push('<div class=\"multiple feedback-gate gate-btn\">');
            //else
            content.push('<div class=\"multiple feedback-gate gate-btn\" value="' + GateList.gatename + '" id="Qgateid_' + GateList.qgateid + '" onclick="CheckListItem(' + GateList.qgateid + ')">');

        }

        content.push('<a  title="View" href="#" class=\"text-white\">');
        content.push('<span class="trn">' + GateList.gatename + '</span>');
        content.push('</a>');

        content.push('</div>');
        OrderNo = 2;

        if (GateList.gatename == "Rework") {
            Reworkgateid = GateList.qgateid;
        }
        if (GateList.gatename == "Re-Examination") {
            ReExaminationgateid = GateList.qgateid;
        }

    });


    $("#GateDetailList").append(content.join(''));

    $('#GateDetailList').translate({ lang: $('.Languagepicker').val(), t: dict });


    //SlickQgate(GateCount);




    $('.one-time').slick({
        infinite: false,
        slidesToShow: 7,
        slidesToScroll: 1,
        slickqgates: GateCount
    });



    //$('.one-time').slick({



    //    dots: false,
    //    infinite: true,
    //    speed: 300,
    //    slidesToShow: 5,
    //    touchMove: false,
    //slidesToScroll: 1,
    //arrows: true

    //});



}


function CheckListItem(QgateIds) {
    checkItemMenu = "";
    showloader();
    $("#Completedbtn1").hide();
    $("#Completedbtn").hide();

    QgateId = QgateIds;

    var ListGate = GetGateDetails.gatelist.filter(function (x) { return x.qgateid == QgateId; });
    var GName = ListGate[0].gatename;

    GateName = GName;
    if (GateName == "Rework" || GateName == "Re-Examination" || GateName == "Seal") {
        $("#Completedbtn").hide();
        $("#Completedbtn1").hide();
    }
    else {
        //$("#Completedbtn").show();
        //$("#Completedbtn1").show();

        $("#Completedbtn").hide();
        $("#Completedbtn1").hide();
    }

    if (GateName == "Seal") {
        GetSealGateItems();
        hideloader();
    }
    else {


        var className = $("#btntabtotal").attr('class');

        className = $("#btntabtotal").attr('class');
        if (className == "check-status feedback-check-item2 check-item-btn") {


            $("#btntabtotal").removeClass("check-status feedback-check-item2 check-item-btn").addClass("check-status feedback-check-item2 check-item-btn check-active");
            $("#btntabOk").removeClass("check-status feedback-check-item2 check-item-btn check-active").addClass("check-status feedback-check-item2 check-item-btn");
            $("#btntabNotOk").removeClass("check-status feedback-check-item2 check-item-btn check-active").addClass("check-status feedback-check-item2 check-item-btn");
            $("#btntabSkipped").removeClass("check-status feedback-check-item2 check-item-btn check-active").addClass("check-status feedback-check-item2 check-item-btn");
            $("#btntabPending").removeClass("check-status feedback-check-item2 check-item-btn check-active").addClass("check-status feedback-check-item2 check-item-btn");

            CheckListstatusItem = "Total";

        }

        GetCheckListItems(UserDetails.PlantId, QgateId);

    }


}

function GetLineIdDetails(PlantId) {
    var json = {
        "plantid": PlantId
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetGateDetails';
    PostMethod(ApiFunc, Input, Token, function (data) {
        LineDetails = data.linemasterdetails;
        count = data.linemasterdetails.length;
        var LineDdta
        isValid = false;
        $.each(LineDetails, function (i, Line) {
            position = Line.characterposition - 1;
            value = Line.charactervalue;
            var str = $('#txtVinQRNumber').val();
            var n = str.indexOf(value);
            if (position == n) {
                LineDdta = LineDetails.filter(function (x) { return x.charactervalue == value; });
                VIN = str.substring(0, position);
                ModelNumber = str.substring(position, str.length);
                var num = $.isNumeric(VIN)
                if (num) {
                    isValid = true;
                }
                else {
                    isValid = false;
                }
                $('#selectedvin').text(VIN);
                $('#selectedmodel').text(ModelNumber);
                $('#selectedline').text(LineDdta[0].linename);

            }
            else {

                if (value != "M" && value != "B" && isValid == false) {
                    LineDdta = LineDetails.filter(function (x) { return x.charactervalue == value; });
                    var str = $('#txtVinQRNumber').val();

                    var n = str.indexOf("C");
                    VIN = str.substring(0, 6);
                    ModelNumber = str.substring(6, str.length);
                    isValid = true;
                    $('#selectedvin').text(VIN);
                    $('#selectedmodel').text(ModelNumber);
                    $('#selectedline').text(LineDdta[0].linename);
                }
            }
        });
        if (!isValid) {
            $('#DynamicAlertModal').modal('show');
            if (UserDetails.Language == "en") {
                hideloader();
                $('#hTitle3').text('Invalid VIN. Please check VIN again....! ' + $('#txtVinQRNumber').val());
            }
            else {
                $('#hTitle3').text('無効なVIN。もう一度VINを確認してください ...! ' + $('#txtVinQRNumber').val());
            }
        }
        else if (isValid) {


            var json = {
                "lineid": LineDdta[0].lineid,
            };
            var Input = JSON.stringify(json);

            var ApiFunc = Api + 'QFL.svc/GetGateListDetails';
            PostMethod(ApiFunc, Input, Token, function (data) {
                // alert(GateValid)

                //BindingQGateList(data)
                BindGateDetails = data;
            })
            AfterPopUpConfirmation();
            //$("#Confirmationpopup").modal('show');

            if (UserDetails.Language == "en") {
                $('#ConfirmationMessage').text('Are you want to Search the VIN No :' + $('#txtVinQRNumber').val() + ' ?');
            }

            else {
                $('#ConfirmationMessage').text('VIN番号を検索しますか');
            }


            var json = {
                "vinnumber": VIN,
                "gatename": null,
                "userid": UserDetails.UserId
            };
            var Input = JSON.stringify(json);

            var ApiFunc = Api + 'QFL.svc/GetSealGateDetails';
            PostMethod(ApiFunc, Input, Token, function (data) {
                var CompletedGate = data.listsealgate;
                $.each(CompletedGate, function (i, CompletedGates) {
                    document.getElementById("Qgateid_" + CompletedGates.gateid).style.backgroundColor = "darkgreen";
                });

            });


        }
    });
}
function AfterPopUpConfirmation() {
    var json = {
        "vinnumber": VIN,
        "modelnumber": ModelNumber
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'Master.svc/CheckVaildVin';
    PostMethod(ApiFunc, Input, Token, function (data) {
        $("#Confirmationpopup").modal('hide');
        if (data.result == "SAME_VEHICLE_TYPE") {
            BindingQGateList(BindGateDetails);
            GateValid = "Ok";
            $("#SelectedItems").show();
            $('#feedback-search-content').hide();
            $('#feedback-details').css('visibility', 'visible');
            GetCheckListItems(UserDetails.PlantId, QgateId);
        }
        else if (data.result == "DIFFERENT_VEHICLE_TYPE") {
            hideloader();
            $("#GateDetailList").empty();
            $("#DynamicAlertModal").modal('show');
            if (UserDetails.Language == "en") {
                $('#hTitle3').text('This VIN has been already with different vehicle type/Model.Please Check the VIN again..' + $('#txtVinQRNumber').val());
            }
            else {
                $('#hTitle3').text('このVINはすでに別の車両タイプ / モデルになっています。もう一度VINを確認してください');
            }
        }
        else if (data.result == "NEWVIN") {
            GateValid = "Ok";
            BindingQGateList(BindGateDetails);
            $("#SelectedItems").show();
            //$("#DynamicAlertModal").modal('show');
            if (UserDetails.Language == "en") {
                $('#hTitle3').text('This VIN has been NEWVIN.. ' + $('#txtVinQRNumber').val());

                $('#feedback-search-content').hide();
                $("#webcameraPreviewdiv").hide();
                $('#feedback-details').css('visibility', 'visible');

                GetCheckListItems(UserDetails.PlantId, QgateId);
            }
            else {
                $('#hTitle3').text('VIN番号を検索しますか');
                $('#feedback-search-content').hide();
                $("#webcameraPreviewdiv").hide();
                $('#feedback-details').css('visibility', 'visible');

                GetCheckListItems(UserDetails.PlantId, QgateId);
            }
        }
        else if (data.result == "INVAILDMODEL") {
            $("#GateDetailList").empty();
            hideloader();
            $("#DynamicAlertModal").modal('show');
            if (UserDetails.Language == "en") {
                $('#hTitle3').text('Specified Model is not available in masters. Please check.' + $('#txtVinQRNumber').val());
                //$('#feedback-search-content').hide();
                $("#webcameraPreviewdiv").hide();

                //GetCheckListItems(UserDetails.PlantId, QgateId);
            }
            else {
                $('#hTitle3').text('指定されたモデルはマスターでは使用できません。チェックしてください.' + $('#txtVinQRNumber').val());
            }
        }
    });
}



function BindingCheckListItems(data, CheckListstatus) {
    if (CheckListstatus == undefined) {
        $("#spOkCount").text(0);
        $("#spNotOkCount").text(0);
        $("#spSkippedCount").text(0);
        $("#spPendingCount").text(0);
        $("#spTotalCount").text(0);

    }



    $("#sealgateheader").hide();
    $("#BindingSealGate").empty();
    //$("#tblQFLFeedback_paginate").empty();

    $("#checklistitemstatusid").show();
    $("#maingateheader").show();
    disabled = "";
    ChecklistItemsAll = "";
    var CheckListItems = "";
    var checkListStatus = "";
    IsSignature = data.issignature;
    if (data.result == "Not Exists") {
        disabled = "disabled";
        data = "";
    }
    BindingBlankCheckItems = data.blankcheckitems;
    CheckListstatus = CheckListstatusItem;
    var content = [];
    $("#BindingCheckListItems").empty();
    ChecklistItemsAll = data;
    var CheckListItems = data.listofchecklistitems;
    var checkListStatus = data.checkListStatus
    var Okcnt = 0;
    var Skipcnt = 0;
    var NotOkcnt = 0;

    if (data != "") {
        ChecklistItemsAll = data;
        CheckListItems = data.listofchecklistitems;
        checkListStatus = data.checkliststatus;

    }
    if (data == "") {
        $('#tblQFLFeedback').css('dispaly', '');
        $('#tblQFLFeedback').dataTable().fnClearTable();
        $('#vinCompletetxt').text("");
        return false;
    }


    if (GateName == "Rework") {
        if (data.isreworkcompleted == true) {

            $("#Completedbtn1").val("Revert Completion");
            $("#Completedbtn").val("");
            $("#Completedbtn1").show();
            $('#VINCompletionDetails').show();
            $("#Completedbtn").hide();
            disabled = "disabled";
        }

        else {
            $("#Completedbtn").val("Completed");
            $("#Completedbtn1").val("");
            $("#Completedbtn").show();
            $("#Completedbtn1").hide();
            $('#VINCompletionDetails').hide();
        }
    }
    else if (GateName == "Re-Examination") {
        if (data.isreexaminationcompleted == true) {

            $("#Completedbtn1").val("Revert Completion");
            $("#Completedbtn").val("");
            $("#Completedbtn1").show();
            $('#VINCompletionDetails').show();
            $("#Completedbtn").hide();
            disabled = "disabled";
        }

        else {
            $("#Completedbtn").val("Completed");
            $("#Completedbtn1").val("");
            $("#Completedbtn").show();
            $("#Completedbtn1").hide();
            $('#VINCompletionDetails').hide();
        }
    }
    else {
        if (data.iscompleted == true) {

            $("#Completedbtn1").val("Revert Completion");
            $("#Completedbtn").val("");
            $("#Completedbtn1").show();
            $('#VINCompletionDetails').show();
            $("#Completedbtn").hide();
            disabled = "disabled";
        }

        else {
            $("#Completedbtn").val("Completed");
            $("#Completedbtn1").val("");
            $("#Completedbtn").show();
            $("#Completedbtn1").hide();
            $('#VINCompletionDetails').hide();
        }
    }




    if (GateName == "Seal") {
        $("#Completedbtn").hide();
        $("#Completedbtn1").hide();
    }



    //var spTotalCount = CheckListItems.length;
    var spOkCount = CheckListItems.filter(function (x) { return x.checklistitemname == "Ok"; });
    var spNotOkCount = CheckListItems.filter(function (x) { return x.checklistitemname == "NotOk"; });
    var spSkippedCount = CheckListItems.filter(function (x) { return x.checklistitemname == "Skip"; });
    var spPendingCount = CheckListItems.filter(function (x) { return x.checklistitemname == "Pending"; });

    //if (GateName == "Rework") {
    //    if (spOkCount != "") {
    //        spPendingCount = spOkCount;
    //        spOkCount = "";
    //    }
    //    else if (spNotOkCount != "") {
    //        spPendingCount = spNotOkCount;
    //        spNotOkCount = "";
    //    }
    //    spSkippedCount = ""; 

    //}

    //if (GateName == "Re-Examination") {
    //    if (spOkCount != "") {
    //        spPendingCount = spOkCount;
    //        spOkCount = "";
    //    }
    //    else if (spNotOkCount != "") {
    //        spPendingCount = spNotOkCount;
    //        spNotOkCount = "";
    //    }
    //    spSkippedCount = "";

    //}

    if (CheckListstatus == "Ok") {
        CheckListItems = spOkCount;
    }
    else if (CheckListstatus == "Pending") {
        CheckListItems = spPendingCount;
    }
    else if (CheckListstatus == "NotOk") {
        CheckListItems = spNotOkCount
    }

    else if (CheckListstatus == "Skipped") {
        CheckListItems = spSkippedCount;
    }

    var spOkCount = checkListStatus.filter(function (x) { return x.checkliststatus == "Ok"; });
    var spNotOkCount = checkListStatus.filter(function (x) { return x.checkliststatus == "NotOk"; });
    var spSkippedCount = checkListStatus.filter(function (x) { return x.checkliststatus == "Skip"; });
    var spPendingCount = checkListStatus.filter(function (x) { return x.checkliststatus == "Pending"; });

    var Sptotal = 0;

    $("#spOkCount").text(0);
    $("#spNotOkCount").text(0);
    $("#spSkippedCount").text(0);
    $("#spPendingCount").text(0);
    $("#spTotalCount").text(0);

    if (spOkCount.length > 0) {
        $("#spOkCount").text(spOkCount[0].count);
        Sptotal = spOkCount[0].count;
        Okcnt = spOkCount[0].count;
    }
    if (spNotOkCount.length > 0) {
        $("#spNotOkCount").text(spNotOkCount[0].count);
        Sptotal = Sptotal + spNotOkCount[0].count;
        NotOkcnt = spNotOkCount[0].count;
    }
    if (spSkippedCount.length > 0) {
        $("#spSkippedCount").text(spSkippedCount[0].count);
        Sptotal = Sptotal + spSkippedCount[0].count;
        Skipcnt = spSkippedCount[0].count;
    }
    if (spPendingCount.length > 0) {
        $("#spPendingCount").text(spPendingCount[0].count);
        Sptotal = Sptotal + spPendingCount[0].count;
    }
    if (Sptotal > 0) {
        $("#spTotalCount").text(Sptotal);

    }
    $('#Completedbtn').prop('disabled', true);
    if (Sptotal > 0) {


        var OkSkipNotOkcount = Okcnt + Skipcnt + NotOkcnt;

        if (GateName == "Rework" || GateName == "Re-Examination") {
            if (OkSkipNotOkcount == Sptotal) {
                $('#Completedbtn').prop('disabled', false);
            }
        }
        else {
            if (OkSkipNotOkcount == Sptotal) {
                $('#Completedbtn').prop('disabled', false);
            }

        }

    }



    //CheckListItems = CheckListItems.filter(function (x) { return x.qgateid == QgateId; });


    if (CheckListItems != null || CheckListItems != "") {
        var Sno;
        $('#tblQFLFeedback').css('dispaly', '');
        $('#tblQFLFeedback').dataTable().fnClearTable();

        Bindingtable(CheckListItems, data.iscompleted, data);
    }

}

function Bindingtable(data, iscompleted, datas) {



    $('#tblQFLFeedback').DataTable({
        data: data,
        "columns": [
            { "data": "inspectionitem" },
            { "data": "checkitems" },
            { "data": "specification" },
            { "data": "standard" },
            { "data": "actualid" },
            { "data": "checklistitemname" },
            { "data": "checklistitemname" }
        ], "bSort": false, "bDestroy": true, "bLengthChange": false, "pageLength": 100, "dom": 'lrtip', "bSortCellsTop": true, "bFilter": true, "aaSorting": [],
        "deferRender": true,
        "drawCallback": function (settings) {
            // alert(UserDetails.Language)
            $('.Languagepicker').selectpicker('val', UserDetails.Language);
            $('#tblQFLFeedback_info,#tblQFLFeedback').translate({ lang: $('.Languagepicker').val(), t: dict });
            $('#tblQFLFeedback_paginate').translate({ lang: $('.Languagepicker').val(), t: dict });
            $('#strecord').translate({ lang: $('.Languagepicker').val(), t: dict });
            if (data.length <= 0) {
                $('#BindingCheckListItems').empty();
                $('#BindingCheckListItems').append('<span class="" id="" style="padding-left: 594px";> No Checkitems found </span>');

            }


        },
        "createdRow": function (row, data, index) {

            VinIds = data.vinid;

            if (UserDetails.RoleId == 6) {


                var Linename = $("#selectedline").text();

                var Line = UserDetails.AccessDetails.filter(function (x) { return x.AccessType == Linename });
                var GateAccess = Line.filter(function (x) { return x.AccessName.replace('-' + Linename, '') == GateName.replace('Re-Examination', 'ReExamination') });

            }

            var CheckItemdisabled = "";

            var disabledStandard = "";
            var disabledStandardicon = "";
            if (GateName != "Rework" && GateName != "Re-Examination")
                if (data.iscompleted) {
                    disabled = "disabled";
                }

            var standard = datas.standardmasteritems.filter(function (x) { return x.standardname.toLowerCase() == data.standard.toLowerCase(); });


            if (standard.length > 0) {
                if (standard[0].standardfilename == "") {
                    disabledStandardicon = "";
                    disabledStandard = "disabled";
                }


            }
            else {
                disabledStandardicon = "";
                disabledStandard = "disabled";
            }

            if (UserDetails.RoleId == 6) {
                if (GateAccess.length > 0) {

                }
                else {
                    disabled = "disabled";
                    disabledStandard = "disabled";
                    CheckItemdisabled = "disabled";
                    $('#Completedbtn').prop('disabled', true);
                    $('#Completedbtn1').prop('disabled', true);
                }
            }


            var NotOkCount = data.givennotokcount;
            if (NotOkCount == 0) {
                NotOkCount = "";
            }

            var okcheckcount = data.okcheckcount;
            if (okcheckcount == 0) {
                okcheckcount = "";
            }
            var checkItem = "";
            if (data.checkitems == "") {
                checkItem = "";
            }
            else {
                checkItem = "blank";
            }



            $('td', row).eq(0).attr({ 'title': data.inspectionitem, "data-label": "PartName", "data-toggle": "tooltip", "data-placement": "top" });

            if (data.checkitems == "") {
                $('td:eq(1)', row).append('<button type="button" class="btn btn-success btn-xs ' + CheckItemdisabled + '" ' + CheckItemdisabled + ' data-toggle="modal" onclick="AddBlankChecklistItem(' + data.checklistitemid + ',' + data.statichecklistitemid + ')" data-target="#checkitem"><span class="trn">Add New</span></button>')

            }

            else {
                $('td', row).eq(1).attr({ 'title': data.checkitems, "data-label": "CheckItem", "data-toggle": "tooltip", "data-placement": "top" });

            }
            $('td', row).eq(2).attr({ 'title': data.specification, "data-label": "Spec", "data-toggle": "tooltip", "data-placement": "top" });


            var standard = [];
            var jsonComments = [];
            var content = [];
            var Empty = [];

            standard.push('<span>');

            standard.push('<a href="#" onclick=btnstandard("' + data.standard + '") class="btn btn-save ' + disabledStandard + '"  data-toggle="tooltip" title="standard"  aria-hidden="true">');
            if (disabledStandardicon == "") {

                standard.push('<i class="far fa-circle"></i>');
            }
            else {
                standard.push('<i class="fas fa-book"></i>');
            }

            standard.push('</a></span>');

            $('td', row).eq(3).empty().append(standard.join(''));
            if (data.actualid != 0) {
                jsonComments.push('<span><a href="#" onclick=btncomments("' + data.checklistitemid + '","' + data.actualid + '","' + data.statichecklistitemid + '","' + disabled + '") class="' + disabled + '"  data-toggle="tooltip" title="comment"   aria-hidden="true" id="btnCommentSave" style=""><i class="fas fa-comments text-gray"></i></a></span>');
                //jsonComments.push('<td class="feebback-pending-td text-right" id="btnbtnOk">');

            }
            else {
                jsonComments.push('<span><a href="#" onclick=btncomments("' + data.checklistitemid + '","' + data.actualid + '","' + data.statichecklistitemid + '","' + disabled + '") class="btn btn-save CommentEvent ' + disabled + '" data-toggle="tooltip" title="comment"   aria-hidden="true" id="btnCommentSave" style=""><i class="fas fa-comments "></i></a></span>');
                //jsonComments.push('<td class="feebback-pending-td text-right" id="btnbtnOk">');

            }

            $('td', row).eq(4).empty().append(jsonComments.join(''));

            content.push('<div class="row">');
            if (data.checkitems == "") {
                // content.push('<span class="feebback-pending-buttons" id="">');
                // content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + data.checkitems + '") class="btn btn-save ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                // content.push('<i  style="background-color:lightskyblue" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check" ToolTipService.ShowOnDisabled="True"></i>');
                // content.push('</a>');
                //// content.push('</span>');
                // content.push('<span class="feedback-button-number"></span>');
                // content.push('</span>');


                content.push('<div class="col-sm-3  p-lr-5">');
                content.push('<span class="feebback-pending-buttons" id="">');
                content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + checkItem + '",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-OkCheckItems ' + CheckItemdisabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                content.push('<i  id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id=""> </span></i>');
                content.push('</a>');

                content.push('</span>');
                // content.push('<span class="feedback-button-number" id=""> </span>');
                content.push('</div>');



                content.push('<div class="col-sm-3  p-lr-5">');
                content.push('<span class="feebback-pending-buttons" style="color:red">');
                content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + checkItem + '",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-NotOkCheckItems ' + CheckItemdisabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                content.push('<i id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="">' + NotOkCount + '</span></i>');
                content.push('</a>');
                content.push('</span>');
                // content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                content.push('</div>');


                //    content.push('<span class="feebback-pending-buttons">');
                //    content.push('<a href="#" id="CheckItemsSkip' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Skip" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + data.checkitems + '") class="btn btn-skip ' + disabled + ' " ToolTipService.ShowOnDisabled="True" data-toggle="tooltip" title="Skip" aria-hidden="true">');
                //    content.push('<i style="background-color:lightgray" id="CheckItemsSkips' + data.qflfeedbackworkflowid + '" class="fas fa-share"></i>');
                //    content.push('</a>');
                //    content.push('</span>');


                content.push('<div class="col-sm-3  p-lr-5">');
                content.push('<span class="feebback-pending-buttons">');
                content.push('<a href="#" id="CheckItemsSkip' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Skip" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + checkItem + '",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-skipCheckItems ' + CheckItemdisabled + ' " ToolTipService.ShowOnDisabled="True" data-toggle="tooltip" title="Skip" aria-hidden="true">');
                content.push('<i id="CheckItemsSkips' + data.qflfeedbackworkflowid + '" class="fas fa-share"><span class="feedback-button-number" id=""></span></i>');
                content.push('</a>');
                content.push('</span>');
                //content.push('<span class="feedback-button-number" id=""></span>');
                content.push('</div>');

            }
            else {


                if (GateName == "Rework") {
                    //  ---------------------------------Ok Items --------------------------

                    if (data.checklistitemstatusid == 3 || data.checklistitemstatusid == 6) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');
                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-save ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i  id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '"></span></i>');
                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id=""></span>');
                        content.push('</div>');

                    }
                    else if (okcheckcount != "") {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');

                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-saveCheck ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i style="color:green" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '">' + okcheckcount + '</span></i>');

                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">' + okcheckcount + '</span>');
                        content.push('</div>');
                    }
                    //  --------------------------------- Ok Items --------------------------

                    //  ---------------------------------Not Ok Items --------------------------
                    if (data.checklistitemstatusid == 3) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-close ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        // content.push('<span style="color:red;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">'+NotOkCount+'</span>');
                        content.push('</div>');
                    }

                    else if (data.notokcheckcount == 0) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '"  class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        //content.push('<span style="color:red;margin-left: -16px;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">'+NotOkCount+'</span>');
                        content.push('</div>');
                    }

                    else if (data.checklistitemstatusid == 6) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItemsNotOk("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        // content.push('<span style="color:red;margin-left: -16px;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                        content.push('</div>');
                    }
                    //  ---------------------------------Not Ok Items --------------------------




                }

                else if (GateName == "Re-Examination") {
                    //  --------------------------------- Ok Items --------------------------

                    if (data.checklistitemstatusid == 5) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');
                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-save ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i  id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '"></span></i>');
                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id=""></span>');
                        content.push('</div>');
                    }
                    else if (data.checklistitemstatusid == 7) {
                        content.push('<div class="col-sm-3 feedback-actitionon p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');

                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-saveCheck ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i style="color:green" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '">' + okcheckcount + '</span></i>');

                        content.push('</a>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">'+okcheckcount+'</span>');
                        content.push('</div>');
                    }

                    //else if (okcheckcount != "") {
                    //    content.push('<span class="feebback-pending-buttons" id="">');
                    //    content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '") class="btn-saveCheck' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                    //    content.push('<i style="color:green" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled" ToolTipService.ShowOnDisabled="True"></i>');
                    //    content.push('</a>');
                    //    content.push(' ' + okcheckcount + '</span>');

                    //}
                    //  --------------------------------- Ok Items --------------------------

                    //  ---------------------------------Not Ok Items --------------------------


                    if (data.checklistitemstatusid == 5 || data.checklistitemstatusid == 7) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-close ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                        content.push('</div>');
                    }
                    //  ---------------------------------Not Ok Items --------------------------

                }

                else {

                    if (data.checklistitemstatusid == 2) {

                        //  --------------------------------- Ok Items --------------------------


                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');

                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-saveCheck ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i style="color:green" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '">' + okcheckcount + '</span></i>');

                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="OkCheckItemCount">' + okcheckcount + '</span>');
                        content.push('</div>');


                        //content.push('' + okcheckcount + '</span>');
                    }
                    else if (data.checklistitemstatusid == 7) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');
                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '"  class="btn-saveCheck' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');

                        content.push('<i style="color:orange" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '">' + okcheckcount + '</span></i>');

                        content.push('</a>');
                        //content.push('<span class="feedback-button-number" id="OkCheckItemCount">' + okcheckcount + '</span>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">' + okcheckcount + '</span>');
                        content.push('</div>');
                    }

                    else if (okcheckcount != "") {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');

                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-saveCheck ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i style="color:green" id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check disabled feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '">' + okcheckcount + '</span></i>');
                        content.push('</a>');
                        //content.push('<span class="feedback-button-number" id="OkCheckItemCount">' + okcheckcount + '</span>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">' + okcheckcount + '</span>');
                        content.push('</div>');

                    }

                    else {

                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" id="">');
                        content.push('<a href="#"  id="CheckItemsOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Ok" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-save ' + disabled + '"  data-toggle="tooltip" title="Ok" aria-hidden="true">');
                        content.push('<i  id="CheckItemsOks' + data.qflfeedbackworkflowid + '" class="fas fa-check feedback-icon-whitespace" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="OkCheckItemCount' + data.qflfeedbackworkflowid + '"></span></i>');
                        content.push('</a>');
                        // content.push('<span class="feedback-button-number" id=""> </span>');
                        content.push('</span>');

                        //content.push('<span class="feedback-button-number" id=""></span>');
                        content.push('</div>');
                    }
                    //  --------------------------------- Ok Items --------------------------
                    //  ---------------------------------Not Ok Items --------------------------


                    if (data.notokcheckcount == 0) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '"  onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        //content.push('<span style="color:red;margin-left: -16px;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                        content.push('</div>');
                    }
                    else if (data.checklistitemstatusid == 3) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red" >');

                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItemsNotOk("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        // content.push('<span style="color:red;margin-left: -16px;">' + NotOkCount +'</span>');

                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                        content.push('</div>');

                    }

                    else if (data.checklistitemstatusid == 6 || data.checklistitemstatusid == 5) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItemsNotOk("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        //content.push('<span style="color:red;margin-left: -16px;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span>');
                        content.push('</div>');
                    }
                    else {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons" style="color:red">');
                        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-close ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
                        content.push('<i id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id="NotOkCount' + data.qflfeedbackworkflowid + '"">' + NotOkCount + '</span></i>');
                        content.push('</a>');
                        //content.push('<span style="color:red;">' + NotOkCount +'</span>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id="">' + NotOkCount + '</span > ');
                        content.push('</div>');
                    }
                    //  ---------------------------------Not Ok Items --------------------------
                    //  ---------------------------------Skip  Items --------------------------

                    if (data.checklistitemstatusid == 4) {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons">');
                        content.push('<a href="#" id="CheckItemsSkip' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Skip" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-skipCheck ' + disabled + ' " data-toggle="tooltip" title="Skip" aria-hidden="true">');
                        content.push('<i style="color:gray" id="CheckItemsSkips' + data.qflfeedbackworkflowid + '" class="fas fa-share" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id=""></span></i>');
                        content.push('</a>');
                        content.push('</span>');
                        //content.push('<span class="feedback-button-number" id=""></span>');
                        content.push('</div>');

                    }
                    else {
                        content.push('<div class="col-sm-3  p-lr-5">');
                        content.push('<span class="feebback-pending-buttons">');
                        content.push('<a href="#" id="CheckItemsSkip' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Skip" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","blank",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn btn-skip ' + disabled + ' " ToolTipService.ShowOnDisabled="True" data-toggle="tooltip" title="Skip" aria-hidden="true">');
                        content.push('<i id="CheckItemsSkips' + data.qflfeedbackworkflowid + '" class="fas fa-share"><span class="feedback-button-number" id=""></span></i>');
                        content.push('</a>');
                        content.push('</span>');
                        // content.push('<span class="feedback-button-number" id=""></span>');
                        content.push('</div>');

                    }
                    //  ---------------------------------Skip Items --------------------------


                }
            }



            //content.push('<span class="feebback-pending-buttons">');
            //        content.push('<a href="#"  id="CheckItemsNotOk' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItemsNotOk("' + "NotOk" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '") class="btn btn-closeCheck ' + disabled + '" data-toggle="tooltip" title="Not OK" aria-hidden="true">');
            //        content.push('<i style="color:red" id="CheckItemsNotOks' + data.qflfeedbackworkflowid + '" class="fas fa-times" ToolTipService.ShowOnDisabled="True"></i>');
            //        content.push('</a>');
            //        content.push('</span>');



            //content.push('<i class="fas fa-refresh"  id="CheckItemsReset' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Reset" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + data.checkitems + '") style="font-size:25px;color:red"></i>');
            content.push('<div class="col-sm-3  p-lr-5">');
            content.push('<span class="feebback-pending-buttons" style="color:red">');
            // content.push('<span id="CheckItemLoader" style="display:none"><i class="fa fa-spinner fa-spin"></i></span>');
            content.push('<a href="#"  id="CheckItemsReset' + data.qflfeedbackworkflowid + '" onclick=btntbnCheckItems("' + "Reset" + '","' + data.qflfeedbackworkflowid + '","' + data.checklistitemid + '","' + data.vinid + '","' + data.statichecklistitemid + '","' + checkItem + '",' + data.individualitemcount + ',' + data.givennotokcount + ',' + data.okcheckcount + ',' + data.notokcheckcount + ') class="btn-reset btn ' + disabled + '" data-toggle="tooltip" title="Reset" aria-hidden="true">');

            content.push('<i id="CheckItemsResets' + data.qflfeedbackworkflowid + '" class="fas fa-refresh" ToolTipService.ShowOnDisabled="True"><span class="feedback-button-number" id=""></span></i>');
            content.push('</a>');
            content.push('</span>');
            //content.push('<span class="feedback-button-number" id=""></span>');
            content.push('</div>');
            content.push('</div>');

            $('td', row).eq(5).empty().append(content.join(''));

            $('td', row).eq(6).empty().append('<span></span>');


            //$("#BindingCheckListItems").append(content.join(''));
        }
    })

    //myTable.rows.add(CheckListItems.length);
    //myTable.draw();


    //$("#BindingCheckListItems").append(content.join(''));
    //var tab = $('#BindingCheckListItems').innerHTML();

}


function btnstandard(standardName) {
    var invaild;
    var url;
    var guid = 0;
    var file = '';
    if (standardName == "" || standardName == null) {
        $('#DynamicAlertModal').modal('show');
        if (UserDetails.Language == "en") {
            $('#hTitle3').text('None of files available for this StandardMaster !..');
        }
        else {
            $('#hTitle3').text('このStandardMasterで使用できるファイルはありません');
        }
        return false;
    }
    else {
        event.stopPropagation();
        var json = {
            "plantid": $('#drpPlant').find(':selected').val(),
            "standardid": 0,
            "standardname": standardName
        };
        var Input = JSON.stringify(json);
        var ApiFunc = Api + 'Master.svc/DownloaadStandardMasterDetails';
        PostMethod(ApiFunc, Input, Token, function (data) {

            // BindingData(data);

            guid = data.fileguid;
            file = data.filename;

            if ((guid != 0 && guid != null) && (file != 0 && file != null)) {
                invaild = true;
                url = "../Home/RedirectStandardMasterFile?StandardMasterfilename=" + guid + "&filename=" + file;
                //alert(url);
                //event.stopPropagation();
                window.open(url, "_blank");

                //win.focus();
            }
            else {
                invaild = false;
                if (invaild == false) {
                    $('#DynamicAlertModal').modal('show');
                    if (UserDetails.Language == "en") {
                        $('#hTitle3').text('None of files available for this StandardMaster !..');
                    }
                    else {
                        $('#hTitle3').text('このStandardMasterで使用できるファイルはありません');
                    }

                }
            }

            //window.open("../Home/DownLoadStandardMasterFile?StandardMasterfilename=" + data.fileguid + "&filename=" + data.filename, data.filename, 'width=400, height=400');
            //Window.location.href = "../Home/DownLoadStandardMasterFile?StandardMasterfilename=" + data.fileguid + "&filename=" + data.filename;
            //var win = window.open(url, '_blank');
            //win.focus();
            //return false;
            //637958MP38FMK10
        });
        //alert(guid);




    }

    guid = '';
    file = '';
}
var statichecklistitemids = 0

function AddBlankChecklistItem(id, statichecklistitemid) {
    $("#blankcheckitem").css("border-color", "");

    $('#blankcheckitem').val('');
    $("#blankcheckitem").hide();
    $("#bindingemptycheckitems").show();

    blankChecklistItemId = id;
    statichecklistitemids = statichecklistitemid;

    var content = [];
    var EmptyCheckItems = ChecklistItemsAll.listofchecklistitems;
    var EmptyCheckItemsSpec
    EmptyCheckItemsSpec = EmptyCheckItems.filter(function (x) { return x.checklistitemid == id; });
    var inspection = "";
    if (EmptyCheckItemsSpec.length > 0) {
        inspection = EmptyCheckItemsSpec[0].inspectionitem;
    }

    var GetEmptyCheckItems = BindingBlankCheckItems.filter(function (x) { return x.inspectionitem == inspection; });


    var CheckValue = 0;
    if (GetEmptyCheckItems.length > 0) {


        for (var i = 0; i <= GetEmptyCheckItems.length; i++) {
            if (GetEmptyCheckItems[0].spec != "") {
                CheckValue = i + 1;

            }
        }
    }

    if (CheckValue == 0) {

        $("#blankcheckitem").show();
        $("#bindingemptycheckitems").hide();
    }
    $("#bindingemptycheckitems").empty();

    BlankSepc = "";
    $.each(GetEmptyCheckItems, function (i, EmptyCheckItems) {

        content.push('<div>');
        content.push('<label class="radio-inline">');
        content.push('<input type="radio" onchange=EmptyCheckItemonChange("' + EmptyCheckItems.spec + '",' + EmptyCheckItems.checklistitemid + ') name="optradio">' + EmptyCheckItems.spec);
        content.push('</label>');
        content.push('</div>');
    });

    $("#bindingemptycheckitems").append(content.join(''));

}
var BlankSepc = "";
function EmptyCheckItemonChange(Spec, checklistitemid) {
    BlankSepc = Spec;
}

function SaveBlankChecklistItem() {

    if (BlankSepc == "" && $('#blankcheckitem').val() == "") {
        $("#blankcheckitem").css("border-color", "red");
        return false;
    }

    if (BlankSepc == "") {
        var json = {
            "checkitems": $('#blankcheckitem').val(),
            "checklistitemid": blankChecklistItemId,
            "staticchecklistItemId": statichecklistitemids,

            "vinid": VinIds,
            "qgateid": QgateId
        };
    }
    else {
        var json = {
            "checkitems": BlankSepc,
            "checklistitemid": blankChecklistItemId,
            "staticchecklistItemId": 0,

            "vinid": VinIds,
            "qgateid": QgateId
        };
    }


    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/UpdateBlankCheckItem';
    PostMethod(ApiFunc, Input, Token, function (data) {
        if (data != null) {
            if (data.result == "False") {
                $("#DynamicAlertModal").modal('show');

                if (UserDetails.Language == "en") {
                    $('#hTitle3').text('Checklist Item update failed, please contact your administrator..');

                }
                else {
                    $('#hTitle3').text('チェックリストアイテムが失敗しました。管理者に連絡してください。');
                }
            }
            else {
                $("#checkitem").modal('hide')
                GetCheckListItems(UserDetails.PlantId, QgateId, "")
            }
        }
    });
}

function GetCheckListItems(PlantId, QgateId, Mode) {

    var json = {
        "plantid": PlantId,
        "modelnumber": ModelNumber,
        "qgateid": QgateId,
        "userid": UserDetails.UserId,
        "vinmodel": VIN,
        "mode": Mode
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetCheckListItems';
    PostMethod(ApiFunc, Input, Token, function (data) {

        $('#Completedbtn').prop('disabled', true);
        if (data.result == "Not Exists") {
            data.listofchecklistitems = "";

        }
        if (data.isreworkcompleted) {

            document.getElementById("Qgateid_" + Reworkgateid).style.backgroundColor = "darkgreen";

        }
        if (data.isreexaminationcompleted) {
            document.getElementById("Qgateid_" + ReExaminationgateid).style.backgroundColor = "darkgreen";

        }

        ConfirmationCheckItems(data);
        BindingCheckListItems(data, CheckListItemStatus);
        hideloader();
        if (data.iscompleted) {
            CompletedDetails(data);
        }
        if (GateName == "Rework") {

            if (data.isreworkcompleted) {

                CompletedDetails(data);
            }
        }
        else if (GateName == "Re-Examination") {

            if (data.isreexaminationcompleted) {
                CompletedDetails(data);
            }
        }

    });
    Mode = "";
}
function CompletedDetails() {

    var json = {
        "vinnumber": VIN,
        "gatename": GateName,
        "userid": UserDetails.UserId
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'QFL.svc/GetSealGateDetails';
    PostMethod(ApiFunc, Input, Token, function (data) {



        if (GateName == "Rework") {
            var Signature = data.listsealgate;


            if (Signature.length > 0) {
                if (Signature[0].isreworkcompleted) {
                    $('#VINCompletionDetails').show();
                    $('#vinCompletetxt').text('Completed on ' + Signature[0].reworkcompleteddate + ' JST' + ' by ' + Signature[0].completedname);

                    $('#vinCompletetxt').show();
                }
            }
        }
        else if (GateName == "Re-Examination") {
            var Signature = data.listsealgate;

            if (Signature.length > 0) {
                if (Signature[0].isreexaminationcompleted) {
                    $('#VINCompletionDetails').show();
                    $('#vinCompletetxt').text('Completed on ' + Signature[0].reexaminationcompleteddate + ' JST' + ' by ' + Signature[0].completedname);

                    $('#vinCompletetxt').show();
                }
            }
        }
        else {
            var Signature = data.listsealgate1.filter(function (x) { return x.gateid == QgateId; });

            if (Signature.length > 0) {
                if (Signature[0].iscompleted) {
                    $('#VINCompletionDetails').show();
                    $('#vinCompletetxt').text('Completed on ' + Signature[0].completeddate + ' JST' + ' by ' + Signature[0].completedname);

                    $('#vinCompletetxt').show();
                }
            }
        }




    });
}



function GetSealGateItems() {
    var json = {
        "vinnumber": VIN,
        "gatename": GateName,
        "userid": UserDetails.UserId
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'QFL.svc/GetSealGateDetails';
    PostMethod(ApiFunc, Input, Token, function (data) {

        if (data.listsealgate != null || data.listsealgate != "") {

            BindingSealGate(data);
        }


        else {

            $("#Qgateid_" + QgateId).attr("disabled", true);

        }

    });

}

function BindingSealGate(data) {
    $("#BindingCheckListItems").empty();
    $("#maingateheader").hide();
    $("#sealgateheader").show();
    $("#checklistitemstatusid").hide();

    $("#tblQFLFeedback_wrapper").hide();



    var content = [];
    var SealGateItems = "";
    $("#BindingSealGate").empty();
    SealGateItems = data.listsealgate;
    var Image = "";

    var BingSealGateDetails = "";

    $.each(SealGateItems, function (i, SealGateItems) {
        //Image = "18_04_2020_154110.png";
        BingSealGateDetails = "";
        BingSealGateDetails = '<tr class="trtblSchedule odd" role="row">';
        BingSealGateDetails = BingSealGateDetails + '<td>' + SealGateItems.sno + '</td>';
        BingSealGateDetails = BingSealGateDetails + '<td>' + SealGateItems.gatename + '</td>';
        BingSealGateDetails = BingSealGateDetails + '<td> ' + SealGateItems.completedname + '</td>';
        BingSealGateDetails = BingSealGateDetails + '<td>' + SealGateItems.completeddate + '</td>';
        BingSealGateDetails = BingSealGateDetails + '<td id="SealGate' + SealGateItems.sno + '" value="' + SealGateItems.filename + '"  onclick=DownloadSignature("' + SealGateItems.filename + '")></td>';
        BingSealGateDetails = BingSealGateDetails + '</tr>';

        $("#BindingSealGate").append(BingSealGateDetails);
        $('#SealGate' + SealGateItems.sno).prepend('<img style="height:100px" id="" src="../Signature/' + SealGateItems.filename + '" />')
    });

    //$("#BindingSealGate").append(content.join(''));


}

function DownloadSignature(SignatureFilename) {

    //window.location.href = "../Home/DownLoadCheckListFile?checklistfilename=" + data.checklistfilename;

    window.location.href = "../Home/DownLoadSignatureFile?SignatureFilename=" + SignatureFilename;
    //var ApiFunc = "../Home/DownLoadSignature?SignatureFilename=" + SignatureFilename;

    //JsonPostMethod(ApiFunc, '', '', function (data) {
    //    if (data != null && data != '') {
    //        window.location.href = "../Home/DownLoadSignatureFile?SignatureFilename=" + SignatureFilename;
    //    }
    //    else {

    //    }
    //});
}



function ConfirmationCheckItems(data) {

    $("#Completedbtn1").hide();
    $("#Completedbtn").hide();

    if (data.result == "No CheckListItems") {
        $("#DynamicAlertModal").modal('show');

        if (UserDetails.Language == "en") {
            $('#hTitle3').text('No Checkitems found');

        }
        else {
            $('#hTitle3').text('チェックアイテムが見つかりません');
        }
    }
    else if (data.result == "Not Exists") {
        if (data.vinexists == "VinNotExists") {

            $("#ConfirmationpopupVin").modal('show');
            if (UserDetails.Language == "en") {
                //$('#ConfirmationMessageVin').text('Are you want to submit the VIN No : ' + $('#txtVinQRNumber').val() + ' ?');
                $('#ConfirmationMessageVin').html('Are you sure? Want to submit the VIN :  ' + $('#txtVinQRNumber').val() + ' ? ');


            }
            else {
                //$('#ConfirmationMessageVin').text('VINを送信しますか : ' + $('#txtVinQRNumber').val() + ' ?');
                $('#ConfirmationMessageVin').html('本気ですか？ VINを送信したい：' + $('#txtVinQRNumber').val() + ' ? ');

            }
        }
        else {
            Mode = "Y";
            GetCheckListItems(UserDetails.PlantId, QgateId, Mode);
        }

    }
    else if (data.result == "Inserted") {
        $("#ConfirmationpopupVin").modal('hide');
    }

}

function btntbnCheckItems(CheckItems, QFLFeedbackWorkflowId, checklistitemid, VinId, staticchecklistitemid, CheckListItem, individualitemcount, NotOkCount, okcheckcount, notokcheckcount) {

    ClickNotOkItems = "";
    if (CheckListItem == "") {


        $("#DynamicAlertModal").modal('show');
        if (UserDetails.Language == "en") {
            //$('#ConfirmationMessageVin').text('Are you want to submit the VIN No : ' + $('#txtVinQRNumber').val() + ' ?');
            $('#hTitle3').html('Please enter CheckItem characters / symbols appears');


        }
        else {
            //$('#ConfirmationMessageVin').text('VINを送信しますか : ' + $('#txtVinQRNumber').val() + ' ?');
            $('#hTitle3').html('文字・記号を入力してください');

        }
        return false;
    }



    var CheckItemstatus = 0;
    StaticCheckListItemId = "";
    StaticCheckListItemId = staticchecklistitemid;
    DefectStaticCheclist = QFLFeedbackWorkflowId;

    //$("#spOkCount").text(0);
    //$("#spNotOkCount").text(0);
    //$("#spSkippedCount").text(0);
    //$("#spPendingCount").text(0);


    var Ok = "";
    var NotOk = "";
    var Skip = "";



    if ((GateName == "Rework" || GateName == "Re-Examination") && (CheckItems != "NotOk")) {



        var classNameOk = $('#CheckItemsOk' + QFLFeedbackWorkflowId).attr('class');
        if (classNameOk == undefined) {
            classNameOk = ""
        }


        if (classNameOk.trim() == "btn-saveCheck" && CheckItems == "Ok") {
            return false;
        }


        if (checkItemMenu == "") {

            if (CheckItems == "Reset") {


                var classNameOk = $('#CheckItemsOk' + QFLFeedbackWorkflowId).attr('class');
                var classNameNotOk = $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).attr('class');
                var classNameSkip = $('#CheckItemsSkip' + QFLFeedbackWorkflowId).attr('class');

                if (classNameOk.trim() == "btn-saveCheck" || classNameNotOk.trim() == "btn btn-closeCheck") {
                    $('#CheckItemsResets' + QFLFeedbackWorkflowId).removeClass("fas fa-refresh").addClass("fas fa-spinner fa-spin");


                    var intOk
                    var intskip
                    var Ok = $("#spOkCount").text();

                    var Pending = $("#spPendingCount").text();
                    if (Ok > individualitemcount) {
                        intOk = Ok - individualitemcount;
                    }
                    else {
                        intOk = individualitemcount - Ok;
                    }

                    var Skip = $("#spSkippedCount").text();
                    if (Skip > individualitemcount) {
                        intskip = Skip - individualitemcount;
                    }
                    else {
                        intskip = individualitemcount - Skip;
                    }

                    if (classNameOk.trim() == "btn-saveCheck") {


                        $("#spOkCount").text(intOk);

                    }

                    $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text("");
                    $("#NotOkCount" + QFLFeedbackWorkflowId).text("");

                    $("#spPendingCount").text(parseInt(Pending) + individualitemcount);

                    $('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
                    $('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck ").addClass("btn btn-save ");

                    $('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                    $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");


                    $('#CheckItemsResets' + QFLFeedbackWorkflowId).removeClass("fas fa-spinner fa-spin").addClass("fas fa-refresh");

                }
            }
            else {

                $('#CheckItemsOks' + QFLFeedbackWorkflowId).removeClass("fas fa-check").addClass("fas fa-spinner fa-spin");


                var intPending
                Ok = $("#spOkCount").text();
                var Pending = $("#spPendingCount").text();
                var intOk = parseInt(Ok)

                $("#spOkCount").text(intOk + individualitemcount);

                if (Pending > individualitemcount) {
                    intPending = Pending - individualitemcount;
                }
                else {
                    intPending = individualitemcount - Pending;
                }
                if (GateName == "Rework" && CheckItems == "Ok") {
                    $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text("");
                    $("#NotOkCount" + QFLFeedbackWorkflowId).text("");
                }
                $("#spPendingCount").text(parseInt(intPending));






                if (GateName == "Re-Examination") {

                    $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text(individualitemcount);

                    $('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "green");
                    $('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn btn-save").addClass("btn-saveCheck ");

                    $('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                    $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");

                }
                $('#CheckItemsOks' + QFLFeedbackWorkflowId).removeClass("fas fa-spinner fa-spin").addClass("fas fa-check");

            }

            UpdateCheckListItems(CheckItemstatus, QFLFeedbackWorkflowId, checklistitemid, CheckItems, GateName);

            var Pending = $("#spPendingCount").text();
            if (Pending == 0) {
                $('#Completedbtn').prop('disabled', false);
            }
            else {
                $('#Completedbtn').prop('disabled', true);
            }

            return false;
        }

    }


    if (CheckItems == "Reset") {
        if (checkItemMenu == "") {

            var classNameOk = $('#CheckItemsOk' + QFLFeedbackWorkflowId).attr('class');
            var classNameNotOk = $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).attr('class');
            var classNameSkip = $('#CheckItemsSkip' + QFLFeedbackWorkflowId).attr('class');
            if (classNameOk == undefined) {
                classNameOk = "";
            }
            if (classNameNotOk == undefined) {
                classNameNotOk = "";
            }
            if (classNameSkip == undefined) {
                classNameSkip = "";
            }

            if (classNameOk.trim() == "btn-saveCheck" || classNameSkip.trim() == "btn-skipCheck" || classNameNotOk.trim() == "btn btn-closeCheck") {

                var intOk
                var intskip
                var Ok = $("#spOkCount").text();

                var Pending = $("#spPendingCount").text();
                if (Ok > individualitemcount) {
                    intOk = Ok - individualitemcount;
                }
                else {
                    intOk = individualitemcount - Ok;
                }

                var Skip = $("#spSkippedCount").text();
                if (Skip > individualitemcount) {
                    intskip = Skip - individualitemcount;
                }
                else {
                    intskip = individualitemcount - Skip;
                }

                if (classNameOk.trim() == "btn-saveCheck") {

                    if (classNameNotOk.trim() == "btn btn-closeCheck") {
                        intOk = parseInt(Ok) + parseInt(NotOkCount)
                        $("#spOkCount").text(parseInt(intOk) - individualitemcount);


                    }
                    else {
                        $("#spOkCount").text(intOk);
                    }

                }
                if (classNameSkip.trim() == "btn-skipCheck") {
                    $("#spSkippedCount").text(intskip);
                }
                if (classNameNotOk.trim() == "btn btn-closeCheck") {
                    var NotOk = $("#spNotOkCount").text();
                    $("#spNotOkCount").text(parseInt(NotOk) - NotOkCount);
                }

                $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text("");
                $("#NotOkCount" + QFLFeedbackWorkflowId).text("");

                $("#spPendingCount").text(parseInt(Pending) + individualitemcount);




                var className = $('#CheckItemsResets' + QFLFeedbackWorkflowId).attr('class');
                $('#CheckItemsResets' + QFLFeedbackWorkflowId).removeClass("fas fa-refresh").addClass("fas fa-spinner fa-spin");

                $('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck ").addClass("btn btn-save ");

                $('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");

                $('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn-skipCheck").addClass("btn btn-skip");

                $('#CheckItemsResets' + QFLFeedbackWorkflowId).removeClass("fas fa-spinner fa-spin").addClass("fas fa-refresh");

            }
            else {
                return false;
            }
        }
        else {
            var className = $('#CheckItemsResets' + QFLFeedbackWorkflowId).attr('class');
            $('#CheckItemsResets' + QFLFeedbackWorkflowId).removeClass("fas fa-refresh").addClass("fas fa-spinner fa-spin");

        }

        //$('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
        //$('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck").addClass("btn btn-save");

        //$('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
        //$('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");

        //$('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "white");
        //$('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn-skipCheck").addClass("btn btn-skip");
    }



    else if (CheckItems == "Ok") {

        var className = $('#CheckItemsOk' + QFLFeedbackWorkflowId).attr('class');
        if (className == "btn-saveCheck " || className == "btn-saveCheck disabled") {

            return false;
        }
        if (checkItemMenu == "") {
            $('#CheckItemsOks' + QFLFeedbackWorkflowId).removeClass("fas fa-check").addClass("fas fa-spinner fa-spin");

            if (CheckListItemStatus == undefined || CheckListItemStatus == "Pending" || CheckListItemStatus == "Total") {
                var intPending
                Ok = $("#spOkCount").text();
                var Pending = $("#spPendingCount").text();
                var intOk = parseInt(Ok)

                $("#spOkCount").text(intOk + individualitemcount);

                if (Pending > individualitemcount) {
                    intPending = Pending - individualitemcount;
                }
                else {
                    intPending = individualitemcount - Pending;
                }

                var intskip;

                var Skip = $("#spSkippedCount").text();
                if (Skip != "0") {
                    if (Skip > individualitemcount) {
                        intskip = Skip - individualitemcount;
                    }
                    else {
                        intskip = individualitemcount - Skip;
                    }

                }




                var classNameSkip = $('#CheckItemsSkip' + QFLFeedbackWorkflowId).attr('class');
                if (classNameSkip.trim() == "btn btn-skip") {

                    $("#spPendingCount").text(parseInt(intPending));

                }
                if (classNameSkip.trim() == "btn-skipCheck") {
                    $("#spSkippedCount").text(intskip);
                }
                $("#NotOkCount" + QFLFeedbackWorkflowId).text("");
                $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text(individualitemcount);

                $('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "green");
                $('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn btn-save").addClass("btn-saveCheck ");

                $('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn-skipCheck").addClass("btn btn-skip");

                $('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");


                $('#CheckItemsOks' + QFLFeedbackWorkflowId).removeClass("fas fa-spinner fa-spin").addClass("fas fa-check");

                //$('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                //$('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");

                //$('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "white");
                //$('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn-skipCheck").addClass("btn btn-skip");


            }
            else {
                //$('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "green");
                //$('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn btn-save").addClass("btn-saveCheck");

            }
            CheckItemstatus = 2;
        }
        else {
            $('#CheckItemsOks' + QFLFeedbackWorkflowId).removeClass("fas fa-check").addClass("fas fa-spinner fa-spin");

        }
    }


    else if (CheckItems == "NotOk") {

        var classNameNotOk = $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).attr('class');
        if (classNameNotOk.trim() == "btn btn-close") {
            VinIds = VinId
            BindingPlaceClass(checklistitemid, VinId);
        }
        else {
            return false;
        }


        if (CheckListItemStatus == undefined || CheckListItemStatus == "Pending" || CheckListItemStatus == "Total") {
            //$('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
            //$('#CheckItemsOk' + QFLFeedbackWorkflowId).css("background:none");
            //$('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck").addClass("btn btn-save");

            //$('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "red");
            //$('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn btn-close").addClass("btn-closeCheck");

            //$('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "white");
            //$('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn-skipCheck").addClass("btn btn-skip");


        }

        else {

            //$('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "red");
            //$('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn btn-close").addClass("btn-closeCheck");

        }


        CheckItemstatus = 3;
    }
    else if (CheckItems == "Skip") {

        var className = $('#CheckItemsSkip' + QFLFeedbackWorkflowId).attr('class');
        if (className.trim() == "btn-skipCheck" || className.trim() == "btn-skipCheck  disabled") {

            return false;
        }

        if (checkItemMenu == "") {
            $('#CheckItemsSkips' + QFLFeedbackWorkflowId).removeClass("fas fa-share").addClass("fas fa-spinner fa-spin");


            if (CheckListItemStatus == undefined || CheckListItemStatus == "Pending" || CheckListItemStatus == "Total") {

                var intPending;
                var intOk;
                var Ok = $("#spOkCount").text();
                var Skip = $("#spSkippedCount").text();
                var Pending = $("#spPendingCount").text();
                var intSkip = parseInt(Skip)

                $("#spSkippedCount").text(intSkip + individualitemcount);

                if (Pending > individualitemcount) {
                    intPending = Pending - individualitemcount;
                }
                else {
                    intPending = individualitemcount - Pending;
                }

                var classNameOk = $('#CheckItemsOk' + QFLFeedbackWorkflowId).attr('class');
                var classNameNotOk = $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).attr('class');

                if (classNameOk.trim() == "btn btn-save") {
                    $("#spPendingCount").text(parseInt(intPending));
                }

                var NotOk = $("#spNotOkCount").text();
                if (Ok != "0") {
                    if (Ok > individualitemcount) {
                        intOk = parseInt(Ok) - individualitemcount;
                    }
                    else {
                        intOk = individualitemcount - parseInt(Ok);
                    }


                }
                if (classNameOk.trim() == "btn-saveCheck") {
                    if (classNameNotOk.trim() == "btn btn-closeCheck") {
                        intOk = parseInt(Ok) + parseInt(NotOk)
                        $("#spOkCount").text(parseInt(intOk) - individualitemcount);
                        $("#spNotOkCount").text(parseInt(NotOk) - NotOkCount);

                    }
                    else {
                        $("#spOkCount").text(intOk);
                    }

                }


                $("#OkCheckItemCount" + QFLFeedbackWorkflowId).text("");
                $("#NotOkCount" + QFLFeedbackWorkflowId).text("");

                $('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "gray");
                $('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn btn-skip").addClass("btn-skipCheck");


                $('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck").addClass("btn btn-save");

                $('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");

                $('#CheckItemsSkips' + QFLFeedbackWorkflowId).removeClass("fas fa-spinner fa-spin").addClass("fas fa-share");



                //$("#OkCheckItemCount").text("");
                //$('#CheckItemsOks' + QFLFeedbackWorkflowId).css("color", "white");
                //$('#CheckItemsOk' + QFLFeedbackWorkflowId).removeClass("btn-saveCheck").addClass("btn btn-save");



                //$('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "gray");
                //$('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn btn-skip").addClass("btn-skipCheck");



                //$('#CheckItemsNotOks' + QFLFeedbackWorkflowId).css("color", "white");
                //$('#CheckItemsNotOk' + QFLFeedbackWorkflowId).removeClass("btn-closeCheck").addClass("btn btn-close");
            }
            else {


                //$('#CheckItemsSkips' + QFLFeedbackWorkflowId).css("color", "gray");
                //$('#CheckItemsSkip' + QFLFeedbackWorkflowId).removeClass("btn btn-skip").addClass("btn-skipCheck");


            }


            CheckItemstatus = 4;
        }
        else {
            $('#CheckItemsSkips' + QFLFeedbackWorkflowId).removeClass("fas fa-share").addClass("fas fa-spinner fa-spin");

        }
    }
    if (CheckItems != "NotOk") {
        CheckItemValue = CheckItems;

        UpdateCheckListItems(CheckItemstatus, QFLFeedbackWorkflowId, checklistitemid, CheckItemValue, GateName);
    }
    var Pending = $("#spPendingCount").text();
    if (Pending == 0) {
        $('#Completedbtn').prop('disabled', false);
    }
    else {
        $('#Completedbtn').prop('disabled', true);
    }
}
function UpdateCheckListItems(CheckItemstatus, QFLFeedbackWorkflowId, checklistitemid, CheckItemValue, GateName) {
    var json = {
        "checkitemstatus": CheckItemstatus,
        "qflfeedbackworkflowid": QFLFeedbackWorkflowId,
        "checklistitemid": checklistitemid,
        "gatename": GateName,
        "checkitemvalue": CheckItemValue,
        "userid": UserDetails.UserId,
        "staticchecklistitemid": StaticCheckListItemId
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/UpdateCheckListItemStatus';
    PostMethodForUpdate(ApiFunc, Input, Token, function (data) {
        if (checkItemMenu == "MenuItems" || GateName == "Rework") {
            GetCheckListItems(UserDetails.PlantId, QgateId, '')

        }


    })
}


var checkItemMenu = "";
function CheckListitemsStatus(CheckItemStatus) {
    CheckListstatusItem = CheckItemStatus;
    if (CheckItemStatus == "Total") {
        checkItemMenu = "";
    }
    else {

        checkItemMenu = "MenuItems";
    }

    showloader();

    var json = {
        "plantid": UserDetails.PlantId,
        "modelnumber": ModelNumber,
        "qgateid": QgateId,
        "userid": UserDetails.UserId,
        "vinmodel": VIN,
        "mode": Mode
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetCheckListItems';
    PostMethod(ApiFunc, Input, Token, function (data) {

        BindingCheckListItems(data, CheckListstatusItem)
        hideloader();
    });



}

function BindingPlaceClass(checklistitemid, VinId) {

    var json = {
        "checklistitemid": checklistitemid,
        "vinid": VinId,
        "qgateid": QgateId,
        "staticchecklistitemid": StaticCheckListItemId

    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetDefectCheckListItems';
    PostMethod(ApiFunc, Input, Token, function (data) {

        var Defect = data.listchecklistdefectitems.length;

        if (Defect == 0) {
            $("#DynamicAlertModal").modal('show');

            if (UserDetails.Language == "en") {
                $('#hTitle3').text('No Defect Place available for selected Item. Please add Defect place in masters / Contact Admin.');
            }

            else {
                $('#hTitle3').text('選択したアイテムに使用できる欠陥場所はありません。マスターに不具合箇所を追加してください/管理者に連絡してください。');
            }
            return false;
        }
        else {
            BindingDefectPlacePopup(data)
        }

    })


}

function BindingDefectPlacePopup(data) {
    $("#DefectValidation").text("");

    QFLDefectPlaceItems = "";
    QFLCheckListItemId = "";
    DefectPlaceStaticItem = StaticCheckListItemId;
    StaticCheckListItemId = "";
    SelectedCheckListItemId = "";
    SelectedStaticCheckListItemId = "";

    var content = [];

    var CheckItemDefectClass = data.listchecklistdefectitems;
    //var CheckItemDefectClasslen = CheckItemDefectClass.length;
    if (UserDetails.Language == "en") {
        $('#btnSubmit').val('Submit');
    }
    else {
        $('#btnSubmit').val('参加する');
    }

    $("#myModal").modal('show');
    var count = 1;
    var a = 0;
    var i;

    for (var x = 1; x <= 43; x++) {
        $("#QFLDefectPlace_" + x).html('&nbsp;');

        $("#QFLDefectPlace_" + x).removeClass("btn feedback-input-buttons btn-block feedback-input-buttons-click").addClass("btn feedback-input-buttons btn-block");
        $("#QFLDefectPlace_" + x).val("");
        $("#QFLDefectPlace_" + x).attr("disabled", false);

    }

    $.each(CheckItemDefectClass, function (i, ListCheckItemDefectClass) {
        //a = i + 1;
        $("#QFLDefectPlace_" + ListCheckItemDefectClass.positionnumber).text(ListCheckItemDefectClass.defectplace)
        $("#QFLDefectPlace_" + ListCheckItemDefectClass.positionnumber).val(ListCheckItemDefectClass.checklistitemid)

        //  $("#QFLDefectPlace_" + ListCheckItemDefectClass.positionnumber).attr('name', ListCheckItemDefectClass.defectplace);


        if (ListCheckItemDefectClass.defectplace == "") {
            $("#QFLDefectPlace_" + a).html('&nbsp;');

        }



    });
    //if (a != 0) {
    //    count = a + 1;

    //}
    //else {
    //    count=1
    //}
    var DefectPlace = "";
    for (i = 1; i <= 43; i++) {

        DefectPlace = document.getElementById("QFLDefectPlace_" + i).innerHTML;
        //DefectPlace = $("#QFLDefectPlace_" + i).text();


        if (DefectPlace == "&nbsp;") {

            $("#QFLDefectPlace_" + i).attr("disabled", true);
        }


    }
}




function QFLDefectPlaceClick(DefectPlaceidValue) {

    var className = $("#" + DefectPlaceidValue).attr('class');

    var DefectPlaceid = $("#" + DefectPlaceidValue).val();
    var defectPlaceName = $("#" + DefectPlaceidValue).text();
    if (className == "btn feedback-input-buttons btn-block") {


        if (QFLDefectPlaceItems != "") {
            QFLDefectPlaceItems = QFLDefectPlaceItems + ","
        }

        if (QFLCheckListItemId != "") {
            QFLCheckListItemId = QFLCheckListItemId + ","
        }


        if (StaticCheckListItemId == "" || StaticCheckListItemId == "0") {
            StaticCheckListItemId = DefectPlaceStaticItem;
        }

        QFLDefectPlaceItems = QFLDefectPlaceItems + defectPlaceName;
        QFLCheckListItemId = QFLCheckListItemId + DefectPlaceid;

        if (QFLCheckListItemId != "") {
            $("#DefectValidation").hide();

        }
    }
    if (className == "btn feedback-input-buttons btn-block feedback-input-buttons-click") {

        var DefectPlaceid = $("#" + DefectPlaceidValue).val();
        var defectPlaceName = $("#" + DefectPlaceidValue).text();

        QFLCheckListItemId = QFLCheckListItemId.replace(DefectPlaceid + ",", "");
        QFLDefectPlaceItems = QFLDefectPlaceItems.replace(defectPlaceName + ",", "")

        QFLCheckListItemId = QFLCheckListItemId.replace(DefectPlaceid, "");
        QFLDefectPlaceItems = QFLDefectPlaceItems.replace(defectPlaceName, "")
        StaticCheckListItemId = StaticCheckListItemId.replace(StaticCheckListItemId, "")
    }

}

function QFLFeeedBackSitePopup(data) {

    $("#DefectSiteValidation").text("");
    QFLDefectPlaceItems = "";
    QFLCheckListItemId = "";
    StaticCheckListItemId = "";
    $("#QFLFeedBackSite").empty();
    var content = [];
    var QFLFeedBackSite = data.listchecklistdefectitems

    QFLFeedbackSitesOther = data.qflselectedname;
    if (QFLFeedBackSite.length <= 0) {
        return false;
    }
    QFLFeedbackSites = data.qflselectedname
    if (QFLFeedbackSites == "Site 1") {
        if (UserDetails.Language == "en") {
            $('#btnSubmit1').val('Submit');

        }
        else {
            $('#btnSubmit1').val('参加する');
        }
        $("#myModal2").modal('show');
        $("#myModal").modal('hide');

    }
    $("#PopupTitle").text(data.qflselectedname);
    var buttoncount = 1;
    var Buttonid = 1;

    var QFLFeedBackSiteLenght = QFLFeedBackSite.length;
    var QFLFeedBackSiteLoopCount = 1;
    var SelectedValue = "";

    $.each(data.listdefectselectedvalue, function (i, listdefectselectedvalue) {
        if (SelectedValue != "") {
            SelectedValue = SelectedValue + ", "
        }
        SelectedValue = SelectedValue + listdefectselectedvalue.selectedvalue;
    });


    if (QFLFeedBackSite.length > 0) {
        content.push('<div><span><label class="f-16">' + SelectedValue + '</label></span> </div>');
        content.push('<div class="row mt-10">');


        $.each(QFLFeedBackSite, function (i, QFLFeedBackSite) {

            if (buttoncount > 3) {
                content.push('</div> <div class="row mt-10">');

                buttoncount = 1;
            }


            if (QFLFeedbackSites == "Site 1") {
                $('#PopupTitle').val('Site 1');
                if (QFLFeedBackSite.site1 != "") {



                    content.push('<div class="col-sm-4">');
                    $('#PopupTitle').val('Site 1');
                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Site 1");
                    }
                    else {

                        $("#PopupTitle").text("敷地 1");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.site1 + '</button>');
                    content.push('</div>');

                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;

                }
            }
            else if (QFLFeedbackSites == "Site 2") {
                $('#PopupTitle').val('Site 2');
                if (QFLFeedBackSite.site2 != "") {

                    content.push('<div class="col-sm-4">');
                    //$('#PopupTitle').val('Site 2');
                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Site 2");
                    }
                    else {

                        $("#PopupTitle").text("敷地 2");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.site2 + '</button>');
                    content.push('</div>');
                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;
                }
            }

            else if (QFLFeedbackSites == "Site 3") {
                $('#PopupTitle').val('Site 3');

                if (QFLFeedBackSite.site3 != "") {



                    content.push('<div class="col-sm-4">');
                    //$('#PopupTitle').val('Site 3');
                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Site 3");
                    }
                    else {

                        $("#PopupTitle").text("敷地 3");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.site3 + '</button>');
                    content.push('</div>');
                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;
                }
            }
            else if (QFLFeedbackSites == "Site 4") {
                $('#PopupTitle').val('Site 4');
                if (QFLFeedBackSite.site4 != "") {

                    content.push('<div class="col-sm-4">');
                    //$('#PopupTitle').val('Site 4');
                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Site 4");
                    }
                    else {

                        $("#PopupTitle").text("敷地 4");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.site4 + '</button>');
                    content.push('</div>');
                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;
                }
            }
            else if (QFLFeedbackSites == "Site 5") {

                $('#PopupTitle').val('Site 5');
                if (QFLFeedBackSite.site5 != "") {


                    content.push('<div class="col-sm-4">');

                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Site 5");
                    }
                    else {

                        $("#PopupTitle").text("敷地 5");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.site5 + '</button>');
                    content.push('</div>');
                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;
                }
            }
            else if (QFLFeedbackSites == "Damage") {

                $('#PopupTitle').val('Damage');
                if (QFLFeedBackSite.damage != "") {


                    content.push('<div class="col-sm-4">');

                    if (UserDetails.Language == "en") {
                        $("#PopupTitle").text("Damage");
                    }
                    else {

                        $("#PopupTitle").text("ダメージ");


                    }
                    content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + QFLFeedBackSite.damage + '</button>');
                    content.push('</div>');

                    buttoncount++;
                }
                else {
                    content.push('<div class="col-sm-4">');
                    content.push('<button type="button" style="background-color:#385b79;color: white;" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons"> N/A </button>');
                    content.push('</div>');
                    buttoncount++;
                }
            }
            //content.push('</div>');
            //buttoncount++;
            Buttonid++;
            QFLFeedBackSiteLoopCount++
        });

        //content.push('<input type="submit" value="Others" id="btnOtherSite" text="' + data.qflselectedname + '"  style="margin-left:72px" class="btn btn-success"  onclick=SiteOthers1() />')


    }



    var disable = "";
    var othersitecount = data.getothersiterowcount

    if (othersitecount.length > 0) {
        if (othersitecount.length > 1) {
            disable = "disabled";
        }
    }

    if (buttoncount > 3) {
        content.push('</div> <div class="row mt-10">');

    }
    content.push('<div class="col-sm-4">');
    //content.push('<button type="button" id="QFLFeedbackSite_' + Buttonid + '" value="' + QFLFeedBackSite.checklistitemid + '" onclick=QFLFeedbackSite("QFLFeedbackSite_' + Buttonid + '","' + QFLFeedBackSite.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons">' + "Others" + '</button>');

    if (UserDetails.Language == "en") {
        content.push('<input style="background-color:#676a6c;color: white;" type="submit" value="Others" id="btnOtherSite" text="" class="btn btn-block feedback-modal-buttons" ' + disable + ' onclick=SiteOthers1() />');

    }
    else {
        content.push('<input style="background-color:#676a6c;color: white;" type="submit" value="その他" id="btnOtherSite" text="" class="btn btn-block feedback-modal-buttons" ' + disable + ' onclick=SiteOthers1() />');
    }


    content.push('</div>');
    content.push('</div>');

    // content.push('<input type="submit" value="Others" id="btnOtherSite" class="btn btn-success" />')
    //console.log(content.join(''));
    $("#QFLFeedBackSite").append(content.join(''));
    $("#btnOtherSite").text(QFLFeedbackSitesOther);

}

function SiteOthers1() {
    //QFLFeedbackSitesOther = "Site 1";
    OtherMode = false;
    var Site = $("#PopupTitle").val();

    OtherSite1 = "";
    OtherSite2 = "";
    OtherSite3 = "";
    OtherSite4 = "";
    OtherSite5 = "";
    OtherDamage = "";


    document.getElementById("txtOthervalue").value = "";
    $("#Modetxt").text("Text Mode");
    QFLFeedbackSitesOther = Site;
    $("#myModal2").modal('hide');
    $("#OtherDefectValidation").text("");
    $("#OtherDefectValidation").hide();

    if (QFLFeedbackSitesOther == "Site 1") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 1");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 1");


        }
    }


    if (QFLFeedbackSitesOther == "Site 2") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 2");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 2");


        }
    }

    if (QFLFeedbackSitesOther == "Site 3") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 3");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 3");


        }
    }

    if (QFLFeedbackSitesOther == "Site 4") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 4");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 4");


        }
    }

    if (QFLFeedbackSitesOther == "Site 5") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 5");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 5");


        }
    }

    if (QFLFeedbackSitesOther == "Damage") {

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Damage");
        }
        else {

            $("#OtherDefectPopUpTitle").text("ダメージ");


        }
    }


    //$("#OtherDefectPopUpTitle").text(QFLFeedbackSitesOther);

    if (UserDetails.Language == "en") {
        $('#btnSubmitOtherSite').val('Submit');
    }
    else {
        $('#btnSubmitOtherSite').val('参加する');
    }
    $("#OtherDefectPopUp").modal('show');

    $("#SignatureHide").hide();
    $("#txtOthervalue").show();
    $("#btnOtherClearid").hide();
    $("#someSwitchOptionPrimary").prop('checked', false);



    var canvas = document.getElementById("newSignature1");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}



function btnOtherCancelSite() {
    document.getElementById("txtOthervalue").value = "";
    $("#OtherDefectPopUp").modal('hide');

    if (UserDetails.Language == "en") {
        $('#btnSubmit1').val('Submit');
    }
    else {
        $('#btnSubmit1').val('参加する');
    }
    $("#myModal2").modal('show');
}




function QFLFeedbackSite(QFLFeedbackSiteId, staticchecklistitemid) {


    var className = $("#" + QFLFeedbackSiteId).attr('class');
    if (className == "btn btn-block feedback-modal-buttons") {
        $("#" + QFLFeedbackSiteId).removeClass("btn btn-block feedback-modal-buttons").addClass("btn btn-block feedback-modal-buttons feedback-modal-buttons-click");

    }
    else {
        $("#" + QFLFeedbackSiteId).removeClass("btn btn-block feedback-modal-buttons feedback-modal-buttons-click").addClass("btn btn-block feedback-modal-buttons");

    }

    var checkListItemId = $("#" + QFLFeedbackSiteId).val();
    var QFLFeebdbackSite = $("#" + QFLFeedbackSiteId).text();


    if (className == "btn btn-block feedback-modal-buttons") {

        if (QFLDefectPlaceItems != "") {
            QFLDefectPlaceItems = QFLDefectPlaceItems + ","
        }

        if (QFLCheckListItemId != "") {
            QFLCheckListItemId = QFLCheckListItemId + ","
        }

        if (StaticCheckListItemId != "") {
            StaticCheckListItemId = StaticCheckListItemId + ","
        }

        QFLDefectPlaceItems = QFLDefectPlaceItems + QFLFeebdbackSite;
        QFLCheckListItemId = QFLCheckListItemId + checkListItemId;
        StaticCheckListItemId = StaticCheckListItemId + staticchecklistitemid;

        if (QFLCheckListItemId != "" || StaticCheckListItemId != "") {
            $("#DefectSiteValidation").hide();
        }
    }
    if (className == "btn btn-block feedback-modal-buttons feedback-modal-buttons-click") {
        var checkListItemId = $("#" + QFLFeedbackSiteId).val();
        var QFLFeebdbackSite = $("#" + QFLFeedbackSiteId).text();


        QFLCheckListItemId = QFLCheckListItemId.replace("," + checkListItemId, "");
        QFLDefectPlaceItems = QFLDefectPlaceItems.replace("," + QFLFeebdbackSite, "")
        StaticCheckListItemId = StaticCheckListItemId.replace("," + staticchecklistitemid, "");

        QFLCheckListItemId = QFLCheckListItemId.replace(checkListItemId, "");
        QFLDefectPlaceItems = QFLDefectPlaceItems.replace(QFLFeebdbackSite, "")
        StaticCheckListItemId = StaticCheckListItemId.replace(staticchecklistitemid, "");

    }


}

function QFLFeeedBackDefectClassPopup(data) {
    if (UserDetails.Language == "en") {
        $('#btnSubmit2').val('Submit');
    }
    else {
        $('#btnSubmit2').val('参加する');
    }

    $("#myModal3").modal('show');

    $("#DefectClassValidation").text("");
    $("#QFLFeedBackDefectClass").empty();
    QFLDefectPlaceItems = "";
    QFLCheckListItemId = "";
    QFLFeedBackWorkflowId = "";
    StaticCheckListItemId = "";


    var content = [];
    var QFLFeedBackDefectclass = data.listchecklistdefectitems

    var buttoncount = 1;
    var Buttonid = 1;
    var SelectedValue = "";

    $.each(data.listdefectselectedvalue, function (i, listdefectselectedvalue) {
        if (SelectedValue != "") {
            SelectedValue = SelectedValue + ", "
        }
        SelectedValue = SelectedValue + listdefectselectedvalue.selectedvalue;
    });

    if (QFLFeedBackDefectclass.length > 0) {
        content.push('<div><span><label class="f-16">' + SelectedValue + '</label></span> </div>');

        //content.push('<h2 class="text-center" id="popupDefectclass">Defect Class</h2>');
        content.push('<div class="row">');

        $.each(QFLFeedBackDefectclass, function (i, QFLFeedBackDefectclass) {


            if (buttoncount > 2) {
                content.push('</div> <div class="row mt-10">');

                buttoncount = 1;
            }
            content.push('<div class="col-sm-6">');
            content.push('<button type="button" id="QFLFeedbackDefectClass_' + Buttonid + '" value="' + QFLFeedBackDefectclass.checklistitemid + '" onclick=QFLFeedbackDefectClass("QFLFeedbackDefectClass_' + Buttonid + '","' + QFLFeedBackDefectclass.qflfeedbackworkflowid + '","' + QFLFeedBackDefectclass.staticchecklistitemid + '") class="btn btn-block feedback-modal-buttons2">' + QFLFeedBackDefectclass.defectclass + '</button>');
            content.push('</div>');


            buttoncount++;
            Buttonid++;



        });

        //content.push('</div>');
    }
    $("#QFLFeedBackDefectClass").append(content.join(''));



}


function QFLFeedbackDefectClass(QFLFeedbackDefectClassid, qflfeedbackworkflowid, staticchecklistitemid) {

    CheckItemValue = "NotOk";
    var className = $("#" + QFLFeedbackDefectClassid).attr('class');
    if (className == "btn btn-block feedback-modal-buttons2") {
        $("#" + QFLFeedbackDefectClassid).removeClass("btn btn-block feedback-modal-buttons2").addClass("btn btn-block feedback-modal-buttons2 feedback-modal-buttons-click");

    }
    else {
        $("#" + QFLFeedbackDefectClassid).removeClass("btn btn-block feedback-modal-buttons2 feedback-modal-buttons-click").addClass("btn btn-block feedback-modal-buttons2");

    }

    var checkListItemId = $("#" + QFLFeedbackDefectClassid).val();
    var QFLFeebdbackDefectPlace = $("#" + QFLFeedbackDefectClassid).text();


    if (className == "btn btn-block feedback-modal-buttons2") {

        if (QFLDefectPlaceItems != "") {
            QFLDefectPlaceItems = QFLDefectPlaceItems + ","
        }

        if (QFLCheckListItemId != "") {
            QFLCheckListItemId = QFLCheckListItemId + ","
        }

        if (QFLFeedBackWorkflowId != "") {
            QFLFeedBackWorkflowId = QFLFeedBackWorkflowId + ","
        }

        if (StaticCheckListItemId != "") {
            StaticCheckListItemId = StaticCheckListItemId + ","
        }


        QFLDefectPlaceItems = QFLDefectPlaceItems + QFLFeebdbackDefectPlace;
        QFLCheckListItemId = QFLCheckListItemId + checkListItemId;
        QFLFeedBackWorkflowId = QFLFeedBackWorkflowId + qflfeedbackworkflowid;
        StaticCheckListItemId = StaticCheckListItemId + staticchecklistitemid;

        if (QFLCheckListItemId != "" || StaticCheckListItemId != "") {
            $("#DefectClassValidation").hide();

        }
    }
    if (className == "btn btn-block feedback-modal-buttons2 feedback-modal-buttons-click") {
        var checkListItemId = $("#" + QFLFeedbackDefectClassid).val();
        var QFLFeebdbackDefectPlace = $("#" + QFLFeedbackDefectClassid).text();


        QFLCheckListItemId = QFLCheckListItemId.replace("," + checkListItemId, "");

        QFLDefectPlaceItems = QFLDefectPlaceItems.replace("," + QFLFeebdbackDefectPlace, "")

        QFLFeedBackWorkflowId = QFLFeedBackWorkflowId.replace("," + qflfeedbackworkflowid, "")

        StaticCheckListItemId = StaticCheckListItemId.replace("," + staticchecklistitemid, "")

        QFLCheckListItemId = QFLCheckListItemId.replace(checkListItemId, "");
        QFLDefectPlaceItems = QFLDefectPlaceItems.replace(QFLFeebdbackDefectPlace, "")
        QFLFeedBackWorkflowId = QFLFeedBackWorkflowId.replace(qflfeedbackworkflowid, "")
        StaticCheckListItemId = StaticCheckListItemId.replace(staticchecklistitemid, "")



    }

}



var checkItemID;
var ActualMode;
var ActualcommentsID;
var ActualStaticCheckListItemId;
var ExistGuid;
var ActualFD;
var filelistcount = 0;





function btncomments(checklistitemid, actualid, statichecklistitemid, disabled) {

    if (disabled == "disabled") {
        return false;
    }

    $("#ActualCommentTableId").hide();
    $("#actualcommentsid").hide();

    filesdata = [];
    filesToUpload = [];

    filecount = 0;
    fileid = 0;

    ExistGuid = 0;
    ActualcommentsID = 0;
    $('#actualvalue').val('');
    $('#responsible').val('');
    $('#damagecode').val('');
    $('#textareacomments').val('');

    $('#FileName').empty();


    $("#files1").val('');
    // $("#AttachmentUpload").append(html);
    $("#AttachmentUpload").empty();

    if (UserDetails.Language == "en") {
        $('#btnSubmitActual').val('Submit');

    }
    else {
        $('#btnSubmitActual').val('参加する');

    }




    if (actualid != 0) {
        if (UserDetails.Language == "en") {
            $('#btnSubmitActual').val('Update');

        }
        else {
            $('#btnSubmitActual').val('更新');

        }
        var dataObject = JSON.stringify({
            "actualid": actualid,

        });

        var ApiFunc = Api + 'QFL.svc/' + 'GetActualCommentDetails';

        var Input = dataObject;

        PostMethod(ApiFunc, Input, Token, function (data) {


            if (data.actualid != 0) {
                $('#actualvalue').val(data.actualvalue);
                $('#responsible').val(data.responsible);
                $('#damagecode').val(data.damagecode);
                $('#textareacomments').val(data.comments);
                ActualMode = 'U';
                ActualcommentsID = actualid;
                ExistGuid = data.foldername;

                var html = [];
                var standmasterdetails = data.ActualComments;

                //content.push('<div class\="col-md-12\">');
                //content.push('<table class=\"table table-bordered text-center\">');
                $.each(standmasterdetails, function (i, StandMaster) {
                    ++filelistcount;
                    ActualFD = 1;
                    var Sno = i + 1;
                    var fsize = (StandMaster.filesize / 1024).toFixed(2);

                    html += '<div class="col-md-6 mt-20"><div class=" attachment-border"> <div class="row"><div class="col-md-3 col-sm-3"><img alt="" class="img-responsive" src="../Images/' + CheckFileType(StandMaster.filename) + '"> <p class="mbsize">'
                        + '<span> ' + fsize.toString() + " MB" + '</span ></p >'
                        + '</div><div class="col-md-9 col-sm-9"><h4 class="overflow-attachment1"> ' + StandMaster.filename + '</h4><p class="overflow-attachment2">' + data.username + ' </p>'
                        + '<label class="overflow-attachment3">' + StandMaster.createddate + '</label> <span class="pull-right btn-group"    onClick = "DeleteActualCommentsFiles(\'' + StandMaster.fileid + '\', \'' + StandMaster.filename + '\')"><i data-container="body" data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-trash"></span></i> </span>'
                        + '<span class="pull-right btn-group" onClick ="DownloadCommentFiles(\'' + data.foldername + '\', \'' + StandMaster.filename + '\')"><i data-container="body" data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-save"></span></i> </span>'
                        + '</div></div></div></div>';

                    //html += '<div class="col-md-6 mt-20" id="' + fileid + '" ><div class=" attachment-border"><a onclick="deleteFile(\'' + fileid + '\',\'' + f.name + '\');" data-container="body" data-toggle="tooltip" data-placement="top" title="Delete"  type="button" class="pull-right btn btn-danger rejectbtn btn-xs mt-n5"><span class="glyphicon glyphicon-remove pull-left btn-group"></span></a> <div class="row"><div class="col-md-3 col-sm-3"><img alt="" class="img-responsive" src="../Images/' + CheckFileType(f.name) + '"> <p class="mbsize">'
                    //    + '<span> ' + fs.toString() + " MB" + '</span ></p >'
                    //    + '</div><div class="col-md-9 col-sm-9"><h4 class="overflow-attachment1"> ' + f.name + '</h4><p class="overflow-attachment2">' + UserDetails.UserName + ' </p>'
                    //    + '<label class="overflow-attachment3">' + getDateTime + '</label> <span class="pull-right btn-group" style="display:' + deleteenable + '"   onClick = ""><i data-container="body" data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-trash"></span></i> </span>'
                    //    + '<span class="pull-right btn-group" onClick =""><i data-container="body" data-toggle="tooltip" data-placement="top" title="" type="button" class="btn btn-success btn-xs mr-5" data-original-title="Download"><span class="glyphicon glyphicon-save"></span></i> </span>'
                    //    + '</div></div></div></div>';
                    //content.push('<tr>');
                    //content.push('<td width="35%">' + Sno + '</td>');
                    //content.push('<td width="35%">' + StandMaster.filename + '</td>');
                    //content.push('<td width="30%">');
                    //content.push('<i onClick ="DownloadCommentFiles(\'' + data.foldername + '\', \'' + StandMaster.filename + '\')" class=\"fa fa-download icondownload\" aria-hidden="true" title=""></i>');

                    //content.push('<i class="fa fa-trash icondelete" aria-hidden="true" title="" data-toggle="modal" data-target="#delete"  onClick ="DeleteActualCommentsFiles(\'' + StandMaster.fileid + '\', \'' + StandMaster.filename + '\')"></i>');
                    //content.push('</td>');
                    //content.push('</tr>');

                });

                //content.push('</tbody>');
                //content.push('</table>');
                //content.push('</div>');
                //content.push('</div>');

                // $("#Standmaster").append(content.join(''));
                $("#AttachmentUpload").append(html);
                if (standmasterdetails.length > 0) {
                    $("#ActualCommentTableId").show();
                    $("#actualcommentsid").show();

                }
                else {
                    $("#ActualCommentTableId").hide();
                    $("#actualcommentsid").hide();
                }
            }
        });
    }
    checkItemID = '';
    $("#files1").empty();
    DeleteID = 0;
    DeleteFilename = '';
    $('#comments').modal('show');


    checkItemID = checklistitemid;
    ActualStaticCheckListItemId = statichecklistitemid;



}
var DeleteFilename;
var DeleteID;
function DeleteActualCommentsFiles(DeleteFileID, Filename) {
    ActualMode = "D";

    if (UserDetails.RoleId != 6) {
        if ((($('#actualvalue').val() == "") && ($('#responsible').val() == "")) && (($('#damagecode').val() == '') && ($('#textareacomments').val() == '')) && (filelistcount == 1)) {


            ActualMode = "FD";
        }
        else {
            ActualMode = "D";
        }

        $("#DeleteConfirmationpopup").modal('show');
        //$("#comments").modal('show');
        if (UserDetails.Language == "en") {
            $('#DeleteConfirmationMessage').text('Are you sure? Want to delete this Actuals/Comments?');
        }
        else {
            $('#DeleteConfirmationMessage').text('本気ですか？この実績/コメントを削除しますか？');
        }
        DeleteID = DeleteFileID;
        DeleteFilename = Filename;
    }


}
function DownloadCommentFiles(DwdGUID, DwdFileName) {
    if (DwdFileName == "") {


        $('#DynamicAlertModal').modal('show');
        if (UserDetails.Language == "en") {
            $('#hTitle3').text('StandMaster Template File is Not Available..!');
        }
        else {
            $('#hTitle3').text('このStandardMasterで使用できるファイルはありません');
        }


        return false;
    }
    else {

        window.location.href = "../Home/DownLoadCommentsFile?StandardMasterfilename=" + DwdGUID + "&filename=" + DwdFileName;
    }

}



function ActualComment() {

    fileid = 0;
    filecount = 0;
    var files = $("#files1").get(0).files;
    var filescount;


    for (var i = 0; i < files.length; i++) {
        var filedetails = files[i];

        if (filedetails.name != filesToUpload[i]) {
            filescount = 1;
        }

    }

    if ((($('#actualvalue').val() == "") && ($('#responsible').val() == "")) && (($('#damagecode').val() == '') && ($('#textareacomments').val() == '')) && (filescount != 1 && ActualMode != 'D') && (ActualMode != 'U' && ActualMode != 'FD')) {
        //ActualMode = '';

        $('#comments').modal('hide');

        $('#DynamicAlertModal').modal('show');
        if (UserDetails.Language == "en") {
            $('#hTitle3').text('Actuals/Comments added!..');
        }
        else {
            $('#hTitle3').text('追加された実績 / コメント');
        }

    }
    else {
        showloader();


        var id = 0;
        if (ActualMode != 'D' && ActualMode != 'FD') {
            if (ExistGuid == 0) {

                ActualMode = 'I';
            }
            else {
                ActualMode = 'U';

            }
        }
        if ((($('#actualvalue').val() == "") && ($('#responsible').val() == "")) && (($('#damagecode').val() == '') && ($('#textareacomments').val() == '')) && (filescount != 1 && ActualFD != 1)) {
            //alert(ActualMode);
            ActualMode = 'FD';


        }


        var fd = new FormData();
        //var files = $("#files1").get(0).files;
        //var files =  input.files[0];


        for (var i = 0; i < filesdata.length; i++) {

            var filedetailss = filesdata[i];

            //alert(filedetailss.name);
            if (filedetailss.name != filesToUpload[i]) {
                fd.append("fileInput", filesdata[i]);
                if (ExistGuid == 0) {
                    id = guid();
                }
            }




        }
        //fd.append("fileInput", filesdata);
        fd.append("token", Token);
        fd.append("fileguid", id == 0 ? ExistGuid : id);
        fd.append("actualid", ActualcommentsID);
        fd.append("checklistitemid", checkItemID);
        fd.append("actualvalue", $('#actualvalue').val());
        fd.append("responsible", $('#responsible').val());
        fd.append("damagecode", $('#damagecode').val());
        fd.append("comments", $('#textareacomments').val());
        fd.append("userid", UserDetails.UserId);
        fd.append("mode", ActualMode);
        fd.append("fileid", DeleteID);
        fd.append("deletefilename", DeleteFilename);
        fd.append("VinIds", VinIds);
        fd.append("StaticCheckListItemId", ActualStaticCheckListItemId);

        //var ApiFunc =

        var ApiFunc = '../Home/Actualcomment/';

        //var Input = dataObject;

        FilePostMethod(ApiFunc, fd, null, function (data) {
            filesToUpload = [];
            fileid = 0;
            filecount = 0;
            hideloader();
            $('#DeleteConfirmationpopup').modal('hide');
            if (data == "Inserted") {
                $('#comments').modal('hide');

                $('#DynamicAlertModal').modal('show');
                if (UserDetails.Language == "en") {
                    $('#hTitle3').text('Actuals/Comments added');
                }
                else {
                    $('#hTitle3').text('追加された実績 / コメント');
                }
                ActualMode = '';
                ActualcommentsID = '';
                ExistGuid = 0;
            }



            else if (data == "Deleted") {

                // $('#comments').modal('hide');


                $('#DynamicAlertModal').modal('show');
                if (UserDetails.Language == "en") {
                    $('#hTitle3').text('Actuals/Comments deleted');
                }
                else {
                    $('#hTitle3').text('実績/コメントを削除しました');
                }
                //alert(checkItemID);
                //alert(ActualcommentsID);
                btncomments(checkItemID, ActualcommentsID, StaticCheckListItemId);

                //ActualMode = '';
                //ActualcommentsID = '';
                //ExistGuid = 0;
            }
            else if (data == "Updated") {

                $('#comments').modal('hide');
                $('#DynamicAlertModal').modal('show');

                if (ActualMode == 'FD') {
                    if (UserDetails.Language == "en") {
                        $('#hTitle3').text('Actuals/Comments deleted');
                    }
                    else {
                        $('#hTitle3').text('実績/コメントを削除しました');
                    }
                }
                else {
                    if (UserDetails.Language == "en") {
                        $('#hTitle3').text('Actuals/Comments updated');
                    }
                    else {
                        $('#hTitle3').text('実績/コメントを更新しました');
                    }
                }
                ActualMode = '';
                ActualcommentsID = '';
                ExistGuid = 0;
            }
            ActualFD = 0;
            filelistcount = 0;
            GetCheckListItems(UserDetails.PlantId, QgateId, '')

        });



    }


}


function signatureSave() {


    const blanks = isCanvasBlank(document.getElementById('newSignature'));

    var canvas1 = document.getElementById("newSignature");// save canvas image as data url (png format by default)
    var dataURL1 = canvas1.toDataURL("image/png");
    var image1 = dataURL1.replace('data:image/png;base64,', '');
    var blank;
    var Imglenght = image1.length;
    if (Imglenght == 1180 || Imglenght == 5812) {

        blank = true;
    }
    else {
        blank = false;
    }

    $("#Signaturevalidation").removeAttr("color");

    if (blank == false) {

        var canvas = document.getElementById("newSignature");// save canvas image as data url (png format by default)
        var dataURL = canvas.toDataURL("image/png");
        var image = dataURL.replace('data:image/png;base64,', '');

        var json = {
            "imagedata": image
        };
        var Input = JSON.stringify(json);

        var ApiFunc = '../Home/SignatureSave/';
        JsonPostMethod(ApiFunc, Input, '', function (data) {

            if (data != null && data != '') {
                var json = {
                    "filename": data,
                    "vinid": VinIds,
                    "userid": UserDetails.UserId,
                    "iscompleted": true
                };
                var Input = JSON.stringify(json);
                var ApiFunc = Api + 'QFL.svc/InsertSignature';

                PostMethod(ApiFunc, Input, Token, function (data) {
                    if (data.result == "Inserted") {

                        $("#completed").modal('hide');
                        $("#DynamicAlertModal").modal('show');
                        document.getElementById("Signaturevalidation").style.color = "green"
                        if (UserDetails.Language == "en") {
                            $('#hTitle3').text('Signature saved');
                        }
                        else {
                            $('#hTitle3').text('署名が保存されました');
                        }
                        document.getElementById("Qgateid_" + QgateId).style.backgroundColor = "darkgreen";
                        GetCheckListItems(UserDetails.PlantId, QgateId, Mode);
                    }
                });
            }
        });
    }

    else {
        document.getElementById("Signaturevalidation").style.color = "red";
        if (UserDetails.Language == "en") {
            $("#Signaturevalidation").text('The signature is blank. Draw a signature');
        }
        else {
            $("#Signaturevalidation").text('署名が空白です。署名を描いてください');
        }

        //return false;
    }


};
function signatureClear() {
    var canvas = document.getElementById("newSignature");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("#Signaturevalidation").text("")
}

$(document).ready(function () {
    var canvas = document.getElementById("newSignature");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("#Signaturevalidation").text("")

    var canvas = document.getElementById("newSignature1");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("#Signaturevalidation").text("")

});

function isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    //return !pixelBuffer.some(color => color !== 0);
}

function btnOtherSlide() {

    var Mode = $("#someSwitchOptionPrimary").prop('checked');

    if (Mode == true) {
        OtherMode = true

        $("#txtOthervalue").hide();
        $("#SignatureHide").show();
        $("#btnOtherClearid").show();

        $("#Modetxt").text("Hand Written Mode");
    }
    else {
        OtherMode = false
        $("#btnOtherClearid").hide();
        $("#SignatureHide").hide();
        $("#txtOthervalue").show();
        $("#Modetxt").text("Text Mode");
    }

}

function btnOtherClear() {
    var canvas = document.getElementById("newSignature1");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("#Signaturevalidation").text("")
}


function btnOtherSiteSave() {
    $("#OtherDefectValidation").text("");
    $("#OtherDefectValidation").hide();



    if (OtherMode == true) {

        var canvas1 = document.getElementById("newSignature1");// save canvas image as data url (png format by default)
        //canvas1.width = 450;
        //canvas1.height = 259;

        var dataURL1 = canvas1.toDataURL("image/png");
        var image1 = dataURL1.replace('data:image/png;base64,', '');
        var blank;
        var Imglenght = image1.length;

        if (Imglenght == 4572 || Imglenght == 960) {


            $("#OtherDefectValidation").show();
            $("#OtherDefectValidation").text("Please Fill the " + QFLFeedbackSitesOther + " value");
            return false;


            blank = true;
        }
        else {
            blank = false;
        }

        $("#Signaturevalidation").removeAttr("color");

        if (blank == false) {
            showloader();
            HandWrittenText = "";
            var canvas = document.getElementById("newSignature1");// save canvas image as data url (png format by default)
            var dataURL = canvas.toDataURL("image/png");
            var image = dataURL.replace('data:image/png;base64,', '');

            var json = {
                "imagedata": image
            };
            var Input = JSON.stringify(json);

            var ApiFunc = '../Home/SignatureSave/';
            JsonPostMethod(ApiFunc, Input, '', function (data) {

                if (data != null && data != '') {
                    var json = {
                        "Filename": data
                    };
                    var Input = JSON.stringify(json);

                    var ApiFunc = '../Home/CheckSignature/';
                    JsonPostMethod(ApiFunc, Input, '', function (data) {
                        if (data != null && data != '') {
                            HandWrittenText = data;
                            hideloader();
                            $('#CheckSignatureConfirmationpopup').modal('show');

                            if (UserDetails.Language == "en") {

                                $('#CheckSignatureConfirmationMsg').text('Are you sure? Please confirm your inputs.  ' + data + ' ?');
                            }
                            else {
                                $('#CheckSignatureConfirmationMsg').text('本気ですか？入力を確認してください' + data + ' ？');

                            }


                        }
                    });
                }
            });


        }
    }

    else {


        var Txtvalidation = document.getElementById("txtOthervalue").value;

        if (Txtvalidation == "") {
            $("#OtherDefectValidation").show();
            $("#OtherDefectValidation").text("Please Fill the " + QFLFeedbackSitesOther + " value");
            return false;
        }

        var Site = QFLFeedbackSitesOther;
        if (QFLFeedbackSitesOther == "Site 1") {

            OtherSite1 = Txtvalidation;

            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("Site 2");
            }
            else {

                $("#OtherDefectPopUpTitle").text("敷地 2");


            }

            Site = "Site 2";

        }
        else if (QFLFeedbackSitesOther == "Site 2") {

            OtherSite2 = Txtvalidation;
            Site = "Site 3";


            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("Site 3");
            }
            else {

                $("#OtherDefectPopUpTitle").text("敷地 3");


            }

        }
        else if (QFLFeedbackSitesOther == "Site 3") {
            OtherSite3 = Txtvalidation;
            Site = "Site 4";

            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("Site 4");
            }
            else {

                $("#OtherDefectPopUpTitle").text("敷地 4");


            }

        }
        else if (QFLFeedbackSitesOther == "Site 4") {
            OtherSite4 = Txtvalidation;
            Site = "Site 5";

            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("Site 5");
            }
            else {

                $("#OtherDefectPopUpTitle").text("敷地 5");


            }

        }
        else if (QFLFeedbackSitesOther == "Site 5") {
            OtherSite5 = Txtvalidation;
            Site = "Damage";

            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("Damage");
            }
            else {

                $("#OtherDefectPopUpTitle").text("ダメージ");
            }

        }
        else if (QFLFeedbackSitesOther == "Damage") {
            OtherDamage = Txtvalidation;
            Site = "DefectClass";

            if (UserDetails.Language == "en") {
                $("#OtherDefectPopUpTitle").text("DefectClass");
            }
            else {

                $("#OtherDefectPopUpTitle").text("欠陥クラス");


            }

        }
        else if (QFLFeedbackSitesOther == "DefectClass") {
            OtherDefectClass = Txtvalidation;



        }

        if (QFLFeedbackSitesOther == "DefectClass") {

            var json = {
                "vinid": VinIds,
                "qflworkflowid": DefectStaticCheclist,
                "site1": OtherSite1,
                "site2": OtherSite2,
                "site3": OtherSite3,
                "site4": OtherSite4,
                "site5": OtherSite5,
                "damage": OtherDamage,
                "defectclass": OtherDefectClass,
                "userid": UserDetails.UserId,
                "gateid": QgateId,
                "selectedchecklistitemid": SelectedCheckListItemId,
                "selectedstaticchecklistitemid": SelectedStaticCheckListItemId
            };
            var Input = JSON.stringify(json);
            var ApiFunc = Api + 'QFL.svc/InsertStaticCheckItems';
            PostMethod(ApiFunc, Input, Token, function (data) {

                $("#OtherDefectPopUp").modal('hide');
                $("#DynamicAlertModal").modal('show');

                if (UserDetails.Language == "en") {
                    $('#hTitle3').text('New defect added to the check item.');
                }
                else {
                    $('#hTitle3').text('チェック項目に新しい欠陥が追加されました');
                }
                GetCheckListItems(UserDetails.PlantId, QgateId, '')

            });
            document.getElementById("txtOthervalue").value = "";
        }
        else {
            //$("#OtherDefectPopUpTitle").text(Site);
            QFLFeedbackSitesOther = Site;
            document.getElementById("txtOthervalue").value = "";
        }

    }


}

function CheckSinganatureYes() {


    $('#CheckSignatureConfirmationpopup').modal('hide');
    var Site = QFLFeedbackSitesOther;


    if (QFLFeedbackSitesOther == "Site 1") {

        OtherSite1 = HandWrittenText;

        Site = "Site 2";

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 2");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 2");


        }


    }
    else if (QFLFeedbackSitesOther == "Site 2") {

        OtherSite2 = HandWrittenText;
        Site = "Site 3";

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 3");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 3");


        }

    }
    else if (QFLFeedbackSitesOther == "Site 3") {
        OtherSite3 = HandWrittenText;
        Site = "Site 4";

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 4");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 4");


        }

    }
    else if (QFLFeedbackSitesOther == "Site 4") {
        OtherSite4 = HandWrittenText;
        Site = "Site 5";

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Site 5");
        }
        else {

            $("#OtherDefectPopUpTitle").text("敷地 5");


        }

    }
    else if (QFLFeedbackSitesOther == "Site 5") {
        OtherSite5 = HandWrittenText;
        Site = "Damage";

        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("Damage");
        }
        else {

            $("#OtherDefectPopUpTitle").text("ダメージ");

        }

    }
    else if (QFLFeedbackSitesOther == "Damage") {
        OtherDamage = HandWrittenText;
        Site = "DefectClass";
        if (UserDetails.Language == "en") {
            $("#OtherDefectPopUpTitle").text("DefectClass");
        }
        else {

            $("#OtherDefectPopUpTitle").text("欠陥クラス");
        }


    }
    else if (QFLFeedbackSitesOther == "DefectClass") {
        OtherDefectClass = HandWrittenText;

    }

    if (QFLFeedbackSitesOther == "DefectClass") {

        var json = {
            "vinid": VinIds,
            "qflworkflowid": DefectStaticCheclist,
            "site1": OtherSite1,
            "site2": OtherSite2,
            "site3": OtherSite3,
            "site4": OtherSite4,
            "site5": OtherSite5,
            "damage": OtherDamage,
            "defectclass": OtherDefectClass,
            "userid": UserDetails.UserId,
            "gateid": QgateId,
            "selectedchecklistitemid": SelectedCheckListItemId,
            "selectedstaticchecklistitemid": SelectedStaticCheckListItemId
        };
        var Input = JSON.stringify(json);
        var ApiFunc = Api + 'QFL.svc/InsertStaticCheckItems';
        PostMethod(ApiFunc, Input, Token, function (data) {

            $("#OtherDefectPopUp").modal('hide');
            $("#DynamicAlertModal").modal('show');

            if (UserDetails.Language == "en") {
                $('#hTitle3').text('New defect added to the check item.');
            }
            else {
                $('#hTitle3').text('チェック項目に新しい欠陥が追加されました');
            }
            GetCheckListItems(UserDetails.PlantId, QgateId, '')

        });
        var canvas = document.getElementById("newSignature1");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        $("#Signaturevalidation").text("")
    }
    else {
        //$("#OtherDefectPopUpTitle").text(Site);
        QFLFeedbackSitesOther = Site;
        var canvas = document.getElementById("newSignature1");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        $("#Signaturevalidation").text("")

    }

}

function btntbnCheckItemsNotOk(CheckItems, QFLFeedbackWorkflowId, checklistitemid, VinId, staticchecklistitemid, CheckListItem, individualitemcount, givennotokcount, okcheckcount) {
    var classNameNotOk = $('#CheckItemsNotOk' + QFLFeedbackWorkflowId).attr('class');
    if (classNameNotOk.trim() == "btn btn-close") {
        ClickNotOkItems = ""
        BindingPlaceClass(checklistitemid, VinId)
    }
    else {
        ClickNotOkItems = "NotOk";

        StaticCheckListItemId = "";
        StaticCheckListItemId = staticchecklistitemid;
        DefectStaticCheclist = QFLFeedbackWorkflowId;

        if (CheckItems == "NotOk") {
            VinIds = VinId
            BindingPlaceClassNotOk(checklistitemid, VinId);
            CheckItemstatus = 3;
        }
    }


}

function BindingPlaceClassNotOk(checklistitemid, VinId) {

    var json = {
        "checklistitemid": checklistitemid,
        "vinid": VinId,
        "qgateid": QgateId,
        "staticchecklistitemid": StaticCheckListItemId

    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetDefectCheckListItemNotOk';
    PostMethod(ApiFunc, Input, Token, function (data) {

        var Defect = data.listchecklistdefectitems.length;

        if (Defect == 0) {
            $("#DynamicAlertModal").modal('show');

            if (UserDetails.Language == "en") {
                $('#hTitle3').text('No Defect Place available for selected Item. Please add Defect place in masters / Contact Admin.');
            }

            else {
                $('#hTitle3').text('選択したアイテムに使用できる欠陥場所はありません。マスターに不具合箇所を追加してください/管理者に連絡してください.');
            }
            return false;
        }
        else {
            BindingDefectPlacePopup(data)
        }

    })


}




