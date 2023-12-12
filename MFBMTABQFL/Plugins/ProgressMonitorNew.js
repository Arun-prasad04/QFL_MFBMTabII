var UserDetails;
var Api;
var Token;
var plantid;
var VinNumber;
var VehicleName;
var ModelName;
var ProgressData;

$(document).ready(function () {
    $("#liProgressMonitor").addClass("active");
    InitializeUrl();
    $('.selectpicker').selectpicker();
    $('.glyphicon-ok').hide();
    showloader();
    $('#startDate').datetimepicker({
        autoclose: true, pickTime: false, minView: 2, format: "dd/mm/yyyy"
       

    }).datetimepicker('update', new Date()).on('changeDate',
        function (selected) {
          
            var minDate = new Date(selected.date.valueOf());
            $("#endDate").datetimepicker('setStartDate', minDate);
        })


    $("#endDate").datetimepicker({
        autoclose: true,
        pickTime: false,
        minView: 2,
        format: "dd/mm/yyyy"
    });
    $(".datepicker").datetimepicker({
        autoclose: true,
        pickTime: false,
        minView: 2,
        format: "dd/mm/yyyy"
    });
    $('#startDate').val('');
    $("#startDate").datetimepicker('setEndDate', new Date());
    $("#endDate").datetimepicker('setEndDate', new Date());

    //--------------- ProgressMonitor VINHistory Details Below Add Jak 21-04-2020---------

 
    //--------------------------END -------------------------------------------------

 
    $('#accordions').on('click', 'tbody tr > td', function () {

        $(this).closest('tr').find('.checkdisabled').prop('disabled', !this.checked);



        var Class = $(this).attr("class")

        if (Class == "checkdisabled") {
            return false;
        }

        $('.Vinnumberclr').css('display', 'none');
        $('.Vehicleclr').css('display', 'none');
        $('.Modalclr').css('display', 'none');
        $('.PartNameclr').css('display', 'none');
        $('.Defectclr').css('display', 'none');

        Class = Class.split(" ")[0];
        selectedClass = Class;

        var VIN_Id = $(this).closest('tr').find('.Vinnumber').text();

        VinNumber = VIN_Id.trim();
        partName = $(this).closest('tr').find('.PartName').text();
        Defect = $(this).closest('tr').find('.Defect').text();
        QFLWorkFeedBackworkflowId = $(this).closest('tr').find('.QFLFeedbackWorkflowIdtxt').text();
        VinIds = $(this).closest('tr').find('.VinIdtxt').text();



        if (Class == "Dynamicvalue") {

            if (column == "") {

                OpenDynamicColumntext();
            }
        }
        else {


            if (AfterSelectedColour == "") {
                $('#colorid_' + selectedClass + "_" + QFLWorkFeedBackworkflowId).show();

            }



        }
        AfterSelectedColour = "";

        column = "";
    });



});
var partName = "";
var Defect = "";
var QFLWorkFeedBackworkflowId = 0
var VinNumber = "";
var selectedClass = "";


function InitializeUrl() {
    //LoaderShow();
    var ApiFunc = '../Home/PageLoadData/';
    JsonPostMethod(ApiFunc, '', '', function (data) {
        if (data != null && data != '') {
            UserDetails = data;
            Api = UserDetails.Api;
            Token = UserDetails.Token;
			 ProgressMonitorFromandEndDate();
            GetDropdownlistDetails();
            showloader();
            if (UserDetails.RoleId == 6) {
                if (UserDetails.AccessDetails.length > 0) {

                    $("#liProgressMonitor").hide();
                    $("#liQFLFeedback").hide()
                    $("#menuExtras").hide();
                    $("#limenuReports").hide();
                    //var GateAccessEnabled = UserDetails.AccessDetails.filter(function (x) { return x.AccessType != "page" });
                    var GateAccessEnabled = UserDetails.AccessDetails.filter(function (x) { return x.AccessName == "QFL Feedback" });
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
            alert("Session Expired");
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
        showloader();
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

            ProgressMonitor(PlantId);
            MaintainPlantId(PlantId);
        }

        if (UserDetails.PlantId != 0) {
            ProgressMonitor(UserDetails.PlantId);
        }


        $('#drpPlant').change(function () {
            var PlantId = parseInt(jQuery(this).val());

            ProgressMonitor(PlantId);
            MaintainPlantId(PlantId);
        });


    });
    showloader();
    $('.Languagepicker').selectpicker('val', UserDetails.Language);
    Conversion($('.Languagepicker').val());
}

function Serach() {
    var PlantId = $('#drpPlant').val();
    ProgressMonitor(PlantId);
}
var ListofDynamicColumn = "";
var ListofProgressDefectItems = "";
var DynamicValueDetails = "";

var collapse = "";

function DateConvert(date) {
    var datearray = date.split("/");

    return (datearray[1] + '/' + datearray[0] + '/' + datearray[2]);
}
function ProgressMonitor(plantid) {

    var startdate = $('#startDate').val();
    var endDate = $('#endDate').val();





    var from = new Date(DateConvert(startdate));
    var To = new Date(DateConvert(endDate));
    const diffTime = Math.abs(To - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var Current = 365;

    var datearrayFrom = startdate.split("/");
    var datearrayFrom = datearrayFrom[2];
    var datearrayTo = endDate.split("/");
    var datearrayTo = datearrayTo[2];
    var datearrayCurrent = new Date().getFullYear();


    //if (datearrayTo == datearrayCurrent) {


    //    if (Current < diffDays) {
    //        // alert(diffDays)
    //        $('#accordions').empty();
    //        if (UserDetails.Language == "en") {
    //            $('#AlertTitle').text("Please select date range witin 1 year");

    //        }
    //        else {
    //            $('#AlertTitle').text("1年以内の日付範囲を選択してください");

    //        }
    //        $('#AlertModal').modal('show');

    //        return false;
    //    }
    //}
    //else if (datearrayFrom != datearrayTo) {

    //    $('#accordions').empty();
    //    if (UserDetails.Language == "en") {
    //        $('#AlertTitle').text("For Historical data retrival, Please select From date and To date from same year");

    //    }
    //    else {
    //        $('#AlertTitle').text("履歴データの取得については、[開始日]と[同じ年の終了日]を選択してください");

    //    }
    //    $('#AlertModal').modal('show');

    //    return false;
    //}






    showloader();
   
    var json = {
        "plantid": plantid,
        "vinfrom": $('#vinfrom').val(),
        "vinto": $('#vinto').val() == '' ? $('#vinfrom').val() : $('#vinto').val(),
        "fromdate": $('#startDate').val(),
        "todate": $('#endDate').val() == '' ? $('#startDate').val() : $('#endDate').val()
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'Monitor.svc/GetProgressMonitorNewDataForTablet';
    PostMethod(ApiFunc, Input, Token, function (data) {
        showloader();
        collapse = "panel-collapse collapse";

        glbLineid = 0;
        // $('#sorttable').dataTable().fnDestroy();

        DynamicFileName1 = "";
        DynamicFileName2 = "";
        DynamicFileName3 = "";
        DynamicFileName4 = "";
        DynamicFileName5 = "";
        DynamicFileName6 = "";
        DynamicFileName7 = "";
        DynamicFileName8 = "";
        DynamicFileName9 = "";
        DynamicFileName10 = "";

        BindData(data);
        var Line = data.listlinedetails;


        var DynamicColumn = "";
        var DynamicColumns = [];
        DynamicColumn = data.listsProgressMonitorNewForDynamicColumn;
        ListofDynamicColumn = DynamicColumn;
        var FilterItems = ["ddlVin", "ddlvehicle", "ddlmodel", "ddlpartname", "ddldefect", "ddlStatus", "ddlComments", "ddlPhoto"];

        if (DynamicColumn != null && DynamicColumn != "") {
            if (DynamicColumn.length > 0) {
                for (var i = 0; i < DynamicColumn.length; i++) {
                    if (DynamicColumn[i].DynamicColumnName != "") {
                        FilterItems.push("ddl" + DynamicColumn[i].DynamicColumnName);
                        DynamicddlComlumn.push(DynamicColumn[i].DynamicColumnName);

                    }
                }

            }
        }
        if (DynamicColumn.length > 0) {
            DynamicFileName1 = "ddl" + DynamicColumn[0].DynamicColumnName;
        }
        if (DynamicColumn.length > 1) {
            DynamicFileName2 = "ddl" + DynamicColumn[1].DynamicColumnName;
        }
        if (DynamicColumn.length > 2) {
            DynamicFileName3 = "ddl" + DynamicColumn[2].DynamicColumnName;
        }


        if (DynamicColumn.length > 3) {
            DynamicFileName4 = "ddl" + DynamicColumn[3].DynamicColumnName;
        }
        if (DynamicColumn.length > 4) {
            DynamicFileName5 = "ddl" + DynamicColumn[4].DynamicColumnName;
        }
        if (DynamicColumn.length > 5) {
            DynamicFileName6 = "ddl" + DynamicColumn[5].DynamicColumnName;
        }
        if (DynamicColumn.length > 6) {
            DynamicFileName7 = "ddl" + DynamicColumn[6].DynamicColumnName;
        }
        if (DynamicColumn.length > 7) {
            DynamicFileName8 = "ddl" + DynamicColumn[7].DynamicColumnName;
        }
        if (DynamicColumn.length > 8) {
            DynamicFileName9 = "ddl" + DynamicColumn[8].DynamicColumnName;
        }
        if (DynamicColumn.length > 9) {
            DynamicFileName10 = "ddl" + DynamicColumn[9].DynamicColumnName;

        }



        if (Line.length > 0) {

            for (var i = 0; i < Line.length; i++) {
                var filter = ".filter" + i;


                $("#sorttable" + i).DataTable({

                    /*  "order": [[3, "desc"]],*/
                    "bPaginate": false,
                    initComplete: function () {
                        this.api().columns().every(function () {
                            var column = this;
                            var columnIndex = this.index()

                            var select = "";

                            var FilterName = FilterItems[columnIndex];

                            if (FilterName == "ddlComments" || FilterName == "ddlPhoto") {


                                select = $('<select id="' + FilterName + i + '"   multiple="multiple" class=" tableheadinput form-control input-sm"></select>')

                                    .appendTo($(filter + " th:eq(" + columnIndex + ")").empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });



                                select.append('<option value="Yes">Yes</option>')
                                select.append('<option value="No">No</option>')


                            }

                            else if (FilterName == "ddlStatus") {


                                select = $('<select id="' + FilterName + i + '"   multiple="multiple" class="ddlStatusClass tableheadinput form-control input-sm"></select>')

                                    .appendTo($(filter + " th:eq(" + columnIndex + ")").empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });



                                select.append('<option value="ReExam">ReExam</option>')
                                select.append('<option value="Not OK">Not Ok</option>')






                            }
                            else if (FilterName == "ddlVin" || FilterName == "ddlvehicle" || FilterName == "ddlmodel" || FilterName == "ddlpartname" || FilterName == "ddldefect") {


                                select = $('<select id="' + FilterName + i + '"   multiple="multiple" class=" tableheadinput form-control input-sm"></select>')

                                    .appendTo($(filter + " th:eq(" + columnIndex + ")").empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });

                                var result = [];
                                var n = 0;
                                if (FilterName == "ddlVin") {
                                    n = 0;
                                }
                                else if (FilterName == "ddlvehicle") {
                                    n = 1;
                                }
                                else if (FilterName == "ddlmodel") {
                                    n = 2;
                                }
                                else if (FilterName == "ddlpartname") {
                                    n = 3;
                                }
                                else if (FilterName == "ddldefect") {
                                    n = 4;
                                }

                                var MyRows = $("#sorttable" + i).find('tbody').find('tr');
                                for (var j = 0; j < MyRows.length; j++) {
                                    var MyIndexValues = $(MyRows[j]).find('td:eq(' + n + ')').html();

                                    if (MyIndexValues != "No data available in table" && MyIndexValues != undefined) {
                                        var MyIndexValue = $(MyRows[j]).find('td:eq(' + n + ')').html().split(" <");
                                        if ($.inArray(MyIndexValue[0], result) == -1) result.push(MyIndexValue[0]);

                                    }
                                }


                                $.each(result, function (i, e) {
                                    select.append('<option value="' + e + '">' + e + '</option>')
                                });

                            }

                            else {


                                select = $('<select id="' + FilterName + i + '"   multiple="multiple" class=" tableheadinput form-control input-sm"></select>')

                                    .appendTo($(filter + " th:eq(" + columnIndex + ")").empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });


                                column.data().unique().sort().each(function (d, j) {
                                    if (d != "") {
                                        var str = d;
                                        if (str.includes("空白セル")) {
                                            var BlankCell = "空白セル";

                                            select.append('<option  value="' + BlankCell + '">' + '<b>' + BlankCell + '</b>' + '</option>')
                                        }
                                        else {
                                            select.append('<option value="' + d + '">' + d + '</option>')

                                        }

                                    }


                                });
                            }




                        });
                    }
                });


                FilterDropdown(i);


            }
            DynamicddlComlumn = [];
        }


      
    });


}
var DynamicddlComlumn = [];

function BindData(data) {
    ProgressData = data;
    showloader();
    $('#accordions').empty();

    var secondItem = data.Table1;
    var Datacount = data.listsProgressMonitorNew.length;
    if (Datacount == 0) {
        $('#accordions').append('<span style="margin-left: 558px";>..Records not found..</span>');

    }

    var lineheader = '';
    var tableheader = '';
    var tablebody = '';
    var tablefooter = '';
    var finaltable = '';
    var tableheaderhide = '';
    var hiddentable = [];
    var tableFilter = '';
    var DynamictableFilter = '';
    var firstItem = _.uniq(data.listlinedetails, function (x) {
        return x.linename;
    });
    var designarr = [];
    var loopsCount = 0;

     DynamicValueDetails = data.ListProgressMonitorNewForDynamicDetails;

    var DynamicColumn = "";
    DynamicColumn = data.listsProgressMonitorNewForDynamicColumn;
    ListofDynamicColumn = DynamicColumn;
    ListofProgressDefectItems = data.listsProgressMonitorNewForDefect;
    var Lineids = 0;
    $.each(data.listlinedetails, function (i, item) {
        if (glbLineid == item.lineid) {
            collapse = "";
        }
        else {
            collapse = "panel-collapse collapse";
        }
        loopsCount = 1;
        //lineheader += '<div class="panel panel-default"><div class="panel-heading">';
        //lineheader += '<a data-toggle="collapse" class="collapsed" data-parent="#accordions" href="#collapse' + i + '">';
        //lineheader += '<h4 class="panel-title">' + item.linename + '<span class="circle pull-right"><i class="fa"></i></span></h4></a></div>';

        //tableheader += '<div id="collapse' + i + '" class="panel-collapse collapse"><div class="table-responsive">';
        //tableheader += '<table class="table table-bordered table-striped" style="width: 1400px">';
        //tableheader += '<thead><tr class="tblheadtext"><th width="150"><span class="trn">Vin</span></th><th width="150"><span class="trn">Vehicle Type</span></th><th width="150"><span class="trn">Model</span></th>';
        //tableheaderhide += '<div class="AutomatedQFLPage-progressmonitor"><table class="table table-bordered table-striped text-center" style="width: 1400px"><thead style="display: none"><tr class="tblheadtext"><th width="150"><span class="trn">Vin</span></th><th width="150"><span class="trn">Vehicle Type</span></th><th width="150"><span class="trn">Model</span></th>';
        //tablebody += '<tbody><tr>';
        lineheader += '<div id="tab' + i + '" onclick=ClickLineCollapse("LineId",' + item.lineid +') class="panel panel-default"><div class="panel-heading">';
        lineheader += '<a data-toggle="collapse" class="collapsed" data-parent="#accordions" href="#collapse' + i + '">';
        lineheader += '<h4 class="panel-title">' + item.linename + '<span class="circle pull-right"><i class="fa"></i></span></h4></a></div>';
        tableheader += '<div id="collapse' + i + '" class="' + collapse + '"><div class="table-responsive IE-display-block">';
        tableheader += '<table id="tblbinding" class="table table-bordered" style ="width:' + DynamicColumn[0].Counts + 'px;display: none; table-layout: fixed;" >';
        //tableheader += '<table class="table table-bordered"  style = "width: 1337px;">';
        tableheader += '<thead><tr class="tblheadtext"><th style="width: 50px"><span class="trn">VIN</span></th><th style="width: 100px"><span class="trn">Vehicle Type</span></th><th style="width: 100px"><span class="trn">Model</span></th>';
        tableFilter += '<div class=" tableFixHead IE-mt-0 AutomatedQFLPage-progressmonitor' + i + '"><table id="sorttable' + i +'"  class="table table-bordered text-center" style ="width:' + DynamicColumn[0].Counts + 'px">';
        tableheaderhide += '<tr class="tblheadtext"><th style="width: 50px"><span class="trn">VIN</span></th><th style="width: 100px"><span class="trn">Vehicle Type</span></th><th style="width: 100px"><span class="trn">Model</span></th>';
        tableheaderhide += '<th style="width: 150px" ><span class="trn">Part Name</span></th><th style="width: 150px"><span class="trn">Defect</span></th><th style="width: 50px"><span class="trn">Status</span></th>  <th style="width: 75px"><span class="trn">Comments</span></th> <th style="width: 75px"><span class="trn">Photo</span></th>';

     

        designarr.push(".AutomatedQFLPage-progressmonitor" + i + " > .mCustomScrollBox");
        tablebody += '<tbody>';


        tableheader += '<th style="width: 150px" ><span class="trn">Part Name</span></th><th style="width: 150px"><span class="trn">Defect</span></th><th style="width: 50px"><span class="trn">Status</span></th> <th style="width: 75px"><span class="trn">Comments</span></th> <th style="width: 75px"><span class="trn">Photo</span></th>';

        var secondItemCount = $.grep(data.listsProgressMonitorNew, function (element, index) {
            return element.lineid == item.lineid;
        });
        var lcount = 1;
    

        var globaldata = '';
        var thirdItem = "";
        secondItem = $.grep(data.listsProgressMonitorNew, function (element, index) {
            return element.lineid == item.lineid;
        });
        $.each(secondItem, function (i, item) {
            var count = 0;
            thirdItem = $.grep(data.listsProgressMonitorNewForDefect, function (element, index) {
                return element.VinNumber == item.VinNumber;
            });

           

            if (Lineids != item.lineid) {

                if (DynamicColumn != null && DynamicColumn != "") {
                    if (DynamicColumn.length > 0) {
                        for (var i = 0; i < DynamicColumn.length; i++) {
                            if (DynamicColumn[i].DynamicColumnName != "") {
                                tableheader += '<th style="width: 150px" ><span class="trn">' + DynamicColumn[i].DynamicColumnName + '</span></th>';
                                tableheaderhide += '<th style="width: 150px" ><span class="trn">' + DynamicColumn[i].DynamicColumnName + '</span></th>';
                                DynamictableFilter += '<th style="width: 150px" ><span class="trn">' + DynamicColumn[i].DynamicColumnName + '</span></th>';

                               
                            }
                        }
                        Lineids = item.lineid;
                    }
                }

            }


            count = thirdItem.length;
            var counts = 1;
            var disabled = "";
            $.each(thirdItem, function (i, item) {
               /* if (counts == 1) {*/



                tablebody += ' <td style="width: 50px;background-color:' + item.VinnumberColor + '" id="Vinnumber_' + item.VinNumber + '"  class="Vinnumber Vinnumber_' + item.VinNumber + '">' + item.VinNumber + ' <div style="display:none;" class="Vinnumberclr ColorApply" id="colorid_Vinnumber_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div>  <div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div>  </td> '; // No header only hidden field for variant and modalid

                tablebody += '<td style="width: 100px;background-color:' + item.ModalColor + '" id="Vehicle_' + item.VinNumber + '"  class="Vehicle Vehicle_' + item.VinNumber + '">' + item.VehicleType + ' <div style="display:none;" class="Vehicleclr ColorApply" id="colorid_Vehicle_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")> </div> <div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div></td> '; // No header only hidden field for variant and modalid

                tablebody += '<td style="width: 100px;background-color:' + item.VehicleColor + '" id="Modal_' + item.VinNumber + '" class="Modal Modal_' + item.VinNumber + '">' + item.ModelName + ' <div style="display:none;" class="Modalclr ColorApply" id="colorid_Modal_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div> <div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div></td> '; // No header only hidden field for variant and modalid

                tablebody += '<td   style="width: 150px;background-color:' + item.DefectColor + '" id="PartName_' + item.QFLFeedbackWorkflowId + '"  class="PartName">' + item.inspectionitem + ' <div style="display:none;" class="PartNameclr ColorApply" id="colorid_PartName_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div><div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div></td> ';


                    if (item.Site1Image == "") {
                        tablebody += '<td style="width: 150px;background-color:' + item.DefectColor + '" id="Defect_' + item.QFLFeedbackWorkflowId + '" class="Defect">' + item.Defect + ' <div style="display:none;" class="Defectclr ColorApply" id="colorid_Defect_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div><div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div></td>';

                    }
                    else {

                        if (item.Defect == "") {
                          //  tablebody += '<td style="width: 150px">' + '<img style="width:inherit" id="" src="../SignatureSitePath/' + item.VinNumber + '/' + item.Site1Image + '" />' + '</td> '; // No header only hidden field for variant and modalid
                            tablebody += '<td style="width: 150px;background-color:' + item.DefectColor + '" id="Defect_' + item.QFLFeedbackWorkflowId + '" class="Defect">' + '<img style="width:50px" id="" src="' + UserDetails.SignatureSitePath + '/' + item.VinNumber + '/' + item.Site1Image + '" />' + ' <div style="display:none;" class="Defectclr ColorApply" id="colorid_Defect_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div> <div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div> <div class="square3" onclick=GetColour("White")></div> </div></td> '; // No header only hidden field for variant and modalid

                        }
                        else {
                           // tablebody += '<td style="width: 150px">' + item.Defect + " , " + '<img style="width:inherit" id="" src="../SignatureSitePath/' + item.VinNumber + '/' + item.Site1Image + '" />' + '</td> '; // No header only hidden field for variant and modalid
                            tablebody += '<td style="width: 150px;background-color:' + item.DefectColor + '" id="Defect_' + item.QFLFeedbackWorkflowId + '" class="Defect">' + item.Defect + " , " + '<img style="width:50px" id="" src="' + UserDetails.SignatureSitePath + '/' + item.VinNumber + '/' + item.Site1Image + '" />' + ' <div style="display:none;" class="Defectclr ColorApply" id="colorid_Defect_' + item.QFLFeedbackWorkflowId + '"> <div class="square" onclick=GetColour("red")></div> <div class="square1" onclick=GetColour("Yellow")></div> <div class="square2" onclick=GetColour("deepskyblue")></div><div class="square3" onclick=GetColour("White")></div>  </div></td> '; // No header only hidden field for variant and modalid

                        }
                    }

                     
                tablebody += '<td style="width: 50px">'


                var ReexaminationCycleCount = item.ReexaminationCycleCount;
                var ReworkCyclecount = item.ReworkCyclecount;
                if (ReexaminationCycleCount == 0) {
                    ReexaminationCycleCount = "";
                }
                if (ReworkCyclecount == 0) {
                    ReworkCyclecount = "";
                }

                    if (item.CheckListItemStatusId == 3 || item.CheckListItemStatusId == 6) {
                        tablebody += ('<span class="feebback-pending-buttons">');
                        tablebody += ('<img  id="" src="../Images/NotOk.jpg" />');
                        tablebody += ('<span style="display:none"> Not Ok</span>' + '<span style="color: Red;font-weight: bold;">' + ReworkCyclecount  + '</span>' + '</span>');
                    }
                     
                    else if (item.CheckListItemStatusId == 5) {
                        tablebody += ('<span class="feebback-pending-buttons">');
                        tablebody += ('<img  id="" src="../Images/ReExam.jpg" />');
                        tablebody += ('<span style="display:none">ReExam</span>' + '<span style="color: sandybrown;font-weight: bold;">' + ReexaminationCycleCount + '</span>' + '</span>');
                    }
                     
                    tablebody += '</td >';

                 var  CommentsChecked = $.grep(data.ListofCommunicationDetails, function (element, index) {
                        return element.QFLFeedBackWorkFlowId == item.QFLFeedbackWorkflowId;
                 });

                 if (CommentsChecked == undefined) {
                     disabled = "";
                 }

                    else if (CommentsChecked.length > 0) {
                        disabled = "";
                    }
                    else {
                        disabled = "disabled";
                        column = "";
                }
                var Checkdataavaibility = "";
                if (disabled == "") {
                    Checkdataavaibility = "Yes";
                }
                else {
                    Checkdataavaibility = "No";
                }
                    //tablebody += '<td style="width: 150px" DefectValue="' + item.Defect + '"  class="" onclick=btnReExamCommunicate(this,"' + item.VinId + '",' + item.QFLFeedbackWorkflowId + ',"' + item.inspectionitem + '","' + item.VinNumber + '") >';

                    tablebody += '<td style="width: 75px" class="checkdisabled"> <a href="#" DefectValue="' + item.Defect + '" id="communicationid_' + item.QFLFeedbackWorkflowId + '"  class="btn btn-comment checkdisabled ' + disabled + '" onclick=btnReExamCommunicate(this,"' + item.VinId + '",' + item.QFLFeedbackWorkflowId + ',"' + encodeURI(item.inspectionitem) + '","' + item.VinNumber + '")  class=" " data-toggle="tooltip" title="comment"   aria-hidden="true" id="" style=""><i id="" class="fas fa-comments text-gray"></i></a>';
                tablebody += '<span style="display:none">' + Checkdataavaibility + '</span></td >';


                 var UploadedImageDisabled = "";
                 if (item.NotOkUploadImage == "" || item.NotOkUploadImage == null && item.NotOkUploadImage == undefined) {
                     UploadedImageDisabled = "disabled";
                 }

                 else {
                     UploadedImageDisabled = "";
                }
                if (UploadedImageDisabled == "") {
                    Checkdataavaibility = "Yes";
                }
                else {
                    Checkdataavaibility = "No";
                }


                tablebody += '<td style="width: 75px" class="checkdisabled"> <a href="#"  class="btn btn-comment ' + UploadedImageDisabled + '" onclick="btnOpenUploadedImage(\'' + item.NotOkUploadImage + '\'  ,\'' + item.VinNumber + '\',\'' + item.ModelName + '\'  )" id=""  data-toggle="tooltip" title="Photo"   aria-hidden="true" id="" style=""><i id="" class="fa fa-picture-o"></i></a>';
                tablebody += '<span style="display:none">' + Checkdataavaibility + '</span> </td >';

                    //tablebody += '<td style="width: 150px" class="checkdisabled">';
                    //tablebody += ('<span class="feebback-pending-buttons">');
                    //tablebody += ('<img  onclick="btnOpenUploadedImage(\'' + item.NotOkUploadImage + '\'  ,\'' + item.VinNumber + '\' )"  id="" style="width: 30px" src="../Images/BlankImage.png" />');
                    //tablebody += ('</span>');
                    //tablebody += '</td >';

                    var DynamicDetails = "";
                    if (DynamicValueDetails.length > 0) {

                        DynamicDetails = $.grep(DynamicValueDetails, function (element, index) {
                            return element.QFLFeedBackworkflowId == item.QFLFeedbackWorkflowId && element.VinId == item.VinId;
                        });

                        if (DynamicDetails.length > 0) {
                            var DynamicDetails1 = "";
                            for (var j = 0; j < DynamicColumn.length; j++) {
                                DynamicDetails1 = $.grep(DynamicDetails, function (element, index) {
                                    return element.NewProgressColumnId == DynamicColumn[j].NewProgressColumnId;
                                });

                                if (DynamicDetails1.length > 0) {
                                    for (var n = 0; n < DynamicDetails1.length; n++) {
                                        if (DynamicDetails1[n].DynamicColumnDetails == "") {
                                            tablebody += '<td style="width: 150px" class="Dynamicvalue" id="DynamicdetailsId_' + item.QFLFeedbackWorkflowId + '_' + DynamicDetails1[n].NewProgressColumnId + '"><span style="display:none">空白セル</span></td>';

                                        }
                                        else {

                                            tablebody += '<td style="width: 150px" class="Dynamicvalue" id="DynamicdetailsId_' + item.QFLFeedbackWorkflowId + '_' + DynamicDetails1[n].NewProgressColumnId + '">' + DynamicDetails1[n].DynamicColumnDetails + '</td>';
                                        }
                                    }
                                }
                                else {


                                    tablebody += '<td style="width: 150px"  class="Dynamicvalue" id="DynamicdetailsId_' + item.QFLFeedbackWorkflowId + '_' + DynamicColumn[j].NewProgressColumnId + '"><span style="display:none">空白セル</span></td>';

                                }


                            }
                        }

                        else if (DynamicColumn.length > 0) {
                            for (var n = 0; n < DynamicColumn.length; n++) {
                                if (DynamicColumn[n].DynamicColumnName != "") {
                                    tablebody += '<td style="width: 150px" class="Dynamicvalue" id="DynamicdetailsId_' + item.QFLFeedbackWorkflowId + '_' + DynamicColumn[n].NewProgressColumnId + '"><span style="display:none">空白セル</span></td>';
                                }



                            }
                        }



                    }

                    else if (DynamicColumn.length > 0) {
                        for (var n = 0; n < DynamicColumn.length; n++) {
                            if (DynamicColumn[n].DynamicColumnName != "") {
                                tablebody += '<td style="width: 150px" class="Dynamicvalue" id="DynamicdetailsId_' + item.QFLFeedbackWorkflowId + '_' + DynamicColumn[n].NewProgressColumnId + '"><span style="display:none">空白セル</span></td>';
                            }

                        }
                }


                tablebody += '<td style="display: none;"  class="QFLFeedbackWorkflowIdtxt">' + item.QFLFeedbackWorkflowId + '</td> ';
                tablebody += '<td style="display: none;"  class="VinIdtxt">' + item.VinId + '</td> ';


                    tablebody += '</tr>'
               
            });
             });
       


        tableheader += '<th style="width: 150px;display: none;"><span class="trn">QFLworkFlowId</span></th><th style="width: 150px;display: none;"><span class="trn">VinId</span></th>';
        tableheaderhide += '<th style="width: 150px;display: none;"><span class="trn">QFLworkFlowId</span></th><th style="width: 150px;display: none;"><span class="trn">VinId</span></th>';

        tableheader += '</tr></thead></table>'

        tableFilter += '<thead style=""><tr class="tblheadtext filter' + i + '"><th style="width: 150px"><span class="trn">VIN</span></th><th style="width: 150px"><span class="trn">Vehicle Type</span></th><th style="width: 150px" id="model"><span class="trn">Model</span></th>'
        tableFilter += '<th style="width: 250px" ><span class="trn">Part Name</span></th><th style="width: 250px"><span class="trn">Defect</span></th><th style="width: 150px"><span class="trn">Status</span></th> <th style="width: 150px"><span class="trn">Comments</span></th> <th style="width: 150px"><span class="trn">Photo</span></th>'
        DynamictableFilter += '<th class="" style="width: 150px;display: none;"><span class="trn ">QFLworkFlowId</span></th><th class="" style="width: 150px;display: none;"><span class="trn ">VinId</span></th>';

        DynamictableFilter += '</tr>'
        tableheaderhide += '</tr></thead>'


       
     //   tableheader += '</tr></thead></table>'
        

        if (tablebody == '<tbody>') {
            
            hiddentable.push('#tab' + i)
        }
        else {
            
            $('#tab' + i).css('display', '');
        }

        tablefooter += '</tbody></table ></div></div></div></div>';
        finaltable += lineheader + tableheader + tableFilter + DynamictableFilter + tableheaderhide + tablebody + tablefooter;
        lineheader = ''; tableheader = ''; tablebody = ''; tablefooter = ''; tableheaderhide = ''; tableFilter = '', DynamictableFilter = ''
    });


    $('#accordions').append(finaltable);
    console.log(finaltable);
   

    for (var i = 0; i < hiddentable.length; i++) {
        $(hiddentable[i]).css('display', 'none');
    }

    hideloader();



    for (var i = 0; i < designarr.length; i++) {
        //$(".AutomatedQFLPage-progressmonitor" + i).mCustomScrollbar({

        //    scrollbarPosition: "outside",
        //    theme: "minimal-dark"
        //});
        //$height = $(window).height() - 480;

        //$(".AutomatedQFLPage-progressmonitor" + i).height($height);
        $(designarr[i]).css("width", DynamicColumn[0].Counts + "px").css("max-width", DynamicColumn[0].Counts + "px")
        $('.AutomatedQFLPage-progressmonitor' + i).css("width", DynamicColumn[0].Counts + "px")
        $('#collapse' + i).translate({ lang: $('.Languagepicker').val(), t: dict });
    }

    //$(".AutomatedQFLPage-progressmonitor0").mCustomScrollbar({

    //    scrollbarPosition: "outside",
    //    theme: "minimal-dark"
    //});
    //$height = $(window).height() - 480;

    //$(".AutomatedQFLPage-progressmonitor0").height($height);


    //$(".AutomatedQFLPage-progressmonitor1").mCustomScrollbar({

    //    scrollbarPosition: "outside",
    //    theme: "minimal-dark"
    //});
    //$height = $(window).height() - 480;

    //$(".AutomatedQFLPage-progressmonitor1").height($height);

    //$('.AutomatedQFLPage-progressmonitor0 > .mCustomScrollBox').css("width", firstItem[0].Counts + "px").css("max-width", firstItem[0].Counts + "px")
    //$('.AutomatedQFLPage-progressmonitor0').css("width", firstItem[0].Counts + "px")

    //$('.AutomatedQFLPage-progressmonitor1 > .mCustomScrollBox').css("width", firstItem[1].Counts + "px").css("max-width", firstItem[1].Counts + "px")
    //$('.AutomatedQFLPage-progressmonitor1').css("width", firstItem[1].Counts + "px")

    //// Added for Testing gate

    //$(".AutomatedQFLPage-progressmonitor2").mCustomScrollbar({

    //    scrollbarPosition: "outside",
    //    theme: "minimal-dark"
    //});
    //$height = $(window).height() - 480;

    //$(".AutomatedQFLPage-progressmonitor2").height($height);
    //$('.AutomatedQFLPage-progressmonitor2 > .mCustomScrollBox').css("width", firstItem[2].Counts + "px").css("max-width", firstItem[2].Counts + "px")
    //$('.AutomatedQFLPage-progressmonitor2').css("width", firstItem[2].Counts + "px")


    var Height = $('.AutomatedQFLPage-progressmonitorNew-page').height();
    Height = Height - 100;

    $(".tableFixHead").height(Height);
}

function OldProgress() {
    var ApiFunc = '../Home/ProgressMonitor';
    window.location.href = ApiFunc;

}




function ExcelExportProgressMonitor(input) {
   
    //var Input = JSON.stringify(json);
    var PlantId = $('#drpPlant').val();
    var vinfrom= $('#vinfrom').val();
    var vinto= $('#vinto').val();
    var Fromdate= $('#startDate').val();
    var Todate = $('#endDate').val();

    var startdate = $('#startDate').val();
    var endDate = $('#endDate').val();





    var from = new Date(DateConvert(startdate));
    var To = new Date(DateConvert(endDate));
    const diffTime = Math.abs(To - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var Current = 365;

    var datearrayFrom = startdate.split("/");
    var datearrayFrom = datearrayFrom[2];
    var datearrayTo = endDate.split("/");
    var datearrayTo = datearrayTo[2];
    var datearrayCurrent = new Date().getFullYear();


    //if (datearrayTo == datearrayCurrent) {


    //    if (Current < diffDays) {
    //        // alert(diffDays)
    //        $('#accordions').empty();
    //        if (UserDetails.Language == "en") {
    //            $('#AlertTitle').text("Please select date range witin 1 year");

    //        }
    //        else {
    //            $('#AlertTitle').text("1年以内の日付範囲を選択してください");

    //        }
    //        $('#AlertModal').modal('show');

    //        return false;
    //    }
    //}
    //else if (datearrayFrom != datearrayTo) {

    //    $('#accordions').empty();
    //    if (UserDetails.Language == "en") {
    //        $('#AlertTitle').text("For Historical data retrival, Please select From date and To date from same year");

    //    }
    //    else {
    //        $('#AlertTitle').text("履歴データの取得については、[開始日]と[同じ年の終了日]を選択してください");

    //    }
    //    $('#AlertModal').modal('show');

    //    return false;
    //}




    document.location.href = "../Home/DownloadExcelProgressNew?PlantId=" + PlantId + "&VINFrom=" + vinfrom + "&VINTo=" + vinto + "&FromDate=" + Fromdate + "&ToDate=" + Todate;


}
function OpenDynamicColumntext() {
    var DynamicValueDetails = "";
    var json = {
        "QFLWorkFeedBackworkflowId": QFLWorkFeedBackworkflowId,
        "VinNumber": VinNumber,
        "VinId": VinIds,

    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'Monitor.svc/GETDynamicColumnText';
    PostMethod(ApiFunc, Input, Token, function (data) {


        DynamicValueDetails = data.ListOfDetails;

        var content = [];

        var DynamicDetails = "";
        if (DynamicValueDetails.length > 0) {

            DynamicDetails = $.grep(DynamicValueDetails, function (element, index) {
                return element.QFLWorkFeedBackworkflowId == QFLWorkFeedBackworkflowId && element.VinId == VinIds;
            });
        }


        $("#BindingDynamicColumnPopupTitle").empty();

        if (ListofDynamicColumn.length > 0) {
            var Vin = "VIN : " + VinNumber
            var PartNameandDefect = partName + ' & ' + Defect
            $("#DynamicColumnPopupTitle").text(Vin + ' ' + PartNameandDefect);
            $("#DynamicColumnPopup").modal('show');


            $.each(ListofDynamicColumn, function (n, item) {
                var DynamicDetails1 = "";
                DynamicDetails1 = $.grep(DynamicDetails, function (element, index) {
                    return element.NewProgressColumnId == item.NewProgressColumnId;
                });
                if (item.DynamicColumnName != "") {


                    content.push('<div class="row mt-10">')
                    content.push('<div class="col-sm-4">')


                    content.push('<label for="" ><span>' + item.DynamicColumnName + '</span></label>')
                    content.push('</div>')

                    content.push('<div class="col-sm-8">')
                    if (DynamicDetails1.length > 0 && DynamicDetails1[0].DynamicColumnDetails != "") {
                        content.push('<input  type="text" id="dynamictxt_' + item.NewProgressColumnId + '" value="' + DynamicDetails1[0].DynamicValues + '" class="form-control" placeholder="">')

                    }
                    else {
                        content.push('<input  type="text" id="dynamictxt_' + item.NewProgressColumnId + '" value="" class="form-control" placeholder="">')

                    }

                    content.push('</div>')
                    content.push('</div>')

                }



            });


            $("#BindingDynamicColumnPopupTitle").append(content.join(''));
        }

    });



}


var VinIds=0
function btnSubmitDynamictxt() {
    var Lst = [];


    var ListDefectitems = $.grep(ListofProgressDefectItems, function (element, index) {
        return element.inspectionitem == partName && element.VinNumber == VinNumber
    });


    var VinId = VinIds;
    for (var i = 0; i < ListofDynamicColumn.length; i++) {
        var DynamicDetails = "";
        if (DynamicValueDetails.length > 0) {

            DynamicDetails = $.grep(DynamicValueDetails, function (element, index) {
                return element.QFLFeedBackworkflowId == QFLWorkFeedBackworkflowId && element.VinId == VinIds &&
                    element.NewProgressColumnId == ListofDynamicColumn[i].NewProgressColumnId;
            });
        }


        var DynamicValues = $('#dynamictxt_' + ListofDynamicColumn[i].NewProgressColumnId).val();
        json = {
            "DynamicValues": DynamicValues,
            "QFLWorkFeedBackworkflowId": QFLWorkFeedBackworkflowId,
            "VinNumber": VinNumber,
            "VinId": VinId,
            "NewProgressColumnId": ListofDynamicColumn[i].NewProgressColumnId,
            "userid": UserDetails.UserId,
            "NewProgressColumnDetailsId": DynamicDetails.length > 0 ? DynamicDetails[0].NewProgressColumnDetailsId : 0
        };
        Lst.push(json);
    }

    var json = {
        "ListOfDetails": Lst


    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'Monitor.svc/InsertDynamicColumnText';

    PostMethod(ApiFunc, Input, Token, function (data) {
        $("#DynamicColumnPopup").modal('hide');
        //ProgressMonitor1(UserDetails.PlantId)
        var json = {
            "QFLWorkFeedBackworkflowId": QFLWorkFeedBackworkflowId,
            "VinNumber": VinNumber,
            "VinId": VinId,

        };
        var Input = JSON.stringify(json);

        var ApiFunc = Api + 'Monitor.svc/GETDynamicColumnText';
        PostMethod(ApiFunc, Input, Token, function (data) {
            showloader();
            BindingUpdatedDynamicValues(data);
            hideloader();

        });


    });
}

function btnCloseDynamictxt() {
    $("#DynamicColumnPopup").modal('hide');

}
var column = "";





var communaicateQFLFeedBackid = 0;
var communaicateGateName = "";
var communaicateVinId = 0;
var communaicate_CheckListItemStatusId = 0
function btnReExamCommunicate(e, VinId, QFLFeedbackWorkFlowid, Partname, Vinnumber) {
    column = "Comments";
    VIN = Vinnumber;
    $("#CommunicateValidation").hide();
    var DefectValue = e.getAttribute('DefectValue');
    var DecodePartName = decodeURI(Partname);

    $("#ReworkAndReExamCommunicateTitle").text(DecodePartName + ' & ' + DefectValue);
    communaicateQFLFeedBackid = QFLFeedbackWorkFlowid;
    communaicateGateName = "ProgressMonitor";
    communaicateVinId = VinId;
    communaicate_CheckListItemStatusId = 0;

    GetCommunicationDetails();
}

function BindingPopupCommunicationDetails(CommunicationDetails, Data) {
    var content = [];

    var IsDisabledComments = Data.IsDisabledComments;

    if (IsDisabledComments == true) {
        //$('#txtCommunication').prop('disabled', true);
        $('#btnCommunicationClick').hide();

        if (UserDetails.Language == "en") {
            $('#btnCommunicationclose').val("Close");

        }
        else {
            $('#btnCommunicationclose').val("閉じる");

        }

    }
    else {
        //$('#txtCommunication').prop('disabled', false);
        $('#btnCommunicationClick').show();
        if (UserDetails.Language == "en") {
            $('#btnCommunicationclose').val("Back");
        }
        else {
            $('#btnCommunicationclose').val("バック");

        }
    }

    $("#BindingCommunicationDetails").empty();
    $("#ReworkAndReExamCommunicate").modal('show');

    if (CommunicationDetails.length > 0) {


        $.each(CommunicationDetails, function (i, item) {

            if (item.StartPosition.toUpperCase() == "LEFT") {


                content.push('<div class="row">')



                content.push('<div class="col-md-2 col-sm-2">')
                if (item.FileName != "") {
                    content.push('<img class="image-thumbnail"  onclick="btnOpenUploadedImage(\'' + item.FileName + '\',\'' + item.Vinnumber + '\',\'' + item.ModelName + '\')" src="' + UserDetails.SignatureSitePath + item.Vinnumber  + '/' + item.FileName + '" style="width:100%; margin-top: 15px;"/>')

                }
                content.push('</div>')

                content.push('<div class="col-md-4  col-sm-4 col-xs-4">')
                if (item.GateName == "Re-Examination") {
                    content.push('<h5 class="font-weights">' + 'QG Re-Examination' + '</h5>')

                }

                else if (item.GateName == "Re-Examination1") {
                    content.push('<h5 class="font-weights">' + '完成 Re-Examination' + '</h5>')

                }
                else {
                    content.push('<h5 class="font-weights">' + item.GateName + '</h5>')

                }

                content.push('<h5 class="font-weights">' + item.CompletedBy + '</h5>')
                content.push('<h5 class="font-weights">' + item.CompletedDate + '</h5>')
                content.push('</div>')

                content.push('<div class="col-md-6 col-sm-6 col-xs-6">')
                content.push('<div class="talk-bubbleleft triangle left-top">')
                content.push('<div class="talktext">')
                content.push('<p class="font-weights">' + item.Comments + '</p>')
                content.push('</div>')

                content.push('</div>')
                content.push('</div>')
                content.push('</div>')
            }


            else {
                content.push('<div class="row">')
                content.push('<div class="col-md-6 col-sm-6 col-xs-6">')
                content.push('<div class="talk-bubbleright triangle right-top right-Border-bubble">')
                content.push('<div class="talktext">')
                content.push('<p class="font-weights">' + item.Comments + '</p>')
                content.push('</div>')
                content.push('</div>')
                content.push('</div>')
                content.push('<div class="col-md-4  col-sm-4 col-xs-4">')

                if (item.GateName == "Re-Examination") {
                    content.push('<h5 class="font-weights">' + 'QG Re-Examination' + '</h5>')

                }

                else if (item.GateName == "Re-Examination1") {
                    content.push('<h5 class="font-weights">' + '完成 Re-Examination' + '</h5>')

                }
                else {
                    content.push('<h5 class="font-weights">' + item.GateName + '</h5>')

                }
                content.push('<h5 class="font-weights">' + item.CompletedBy + '</h5>')
                content.push('<h5 class="font-weights">' + item.CompletedDate + '</h5>')
                content.push('</div>')
                content.push('<div class="col-md-2 col-sm-2">')
                if (item.FileName != "") {
                    content.push('<img class="image-thumbnail"  onclick="btnOpenUploadedImage(\'' + item.FileName + '\',\'' + item.Vinnumber + '\',\'' + item.ModelName + '\')" src="' + UserDetails.SignatureSitePath + item.Vinnumber + '/' + item.FileName + '" style="width:100%; margin-top: 15px;"/>')

                }
                content.push('</div>')
                content.push('</div>')
            }
        });

        $("#BindingCommunicationDetails").append(content.join(''));
    }
    else {
        //$("#communicationid_" + communaicateQFLFeedBackid).attr("disabled", true);
    }
    

}

function btnCloseComunication() {
    $("#ReworkAndReExamCommunicate").modal('hide');

}

var VIN = "";

function GetCommunicationDetails() {
    var json = {
        "VinId": communaicateVinId,
        "communaicateQFLFeedBackid": communaicateQFLFeedBackid,
        "Vinnumber": VIN,
        "communaicateGateName": communaicateGateName,
        "userid": UserDetails.UserId,
        "CheckListItemStatusId": communaicate_CheckListItemStatusId
    };
    var Input = JSON.stringify(json);
    var ApiFunc = Api + 'QFL.svc/GetCommunicationDetails';
    PostMethod(ApiFunc, Input, Token, function (data) {

        BindingCommunicationDetails(data);
    });
}

function BindingCommunicationDetails(data) {
    BindingPopupCommunicationDetails(data.ListofCommunicationDetails, data)
    //$("#ReworkAndReExamCommunicate").modal('show');


}

function ProgressMonitor1(plantid) {
    showloader();

    var json = {
        "plantid": plantid,
        "vinfrom": $('#vinfrom').val(),
        "vinto": $('#vinto').val() == '' ? $('#vinfrom').val() : $('#vinto').val(),
        "fromdate": $('#startDate').val(),
        "todate": $('#endDate').val() == '' ? $('#startDate').val() : $('#endDate').val()
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'Monitor.svc/GetProgressMonitorNewDataForTablet';
    PostMethod(ApiFunc, Input, Token, function (data) {
        showloader();
        collapse = "";

        BindData(data);


    });


}
function ReloadUserDetails(newlanguage) {
    UserDetails.Language = newlanguage;
}


function btnOpenUploadedImage(NotOkUploadImage, VIN, ModelName) {
    $("#NotOkUploadImage").modal('show');

    $("#notokImageappend").empty();

    $('#notokImageappend').prepend('<img src="' + UserDetails.SignatureSitePath + VIN  + "/" + NotOkUploadImage + '"  class="image-thumbnail" alt="Forest" style="width:100%; ">')


}
var QRCheckVinnumber="";
function ScanQRCodeOpen(VinNumber,Modeltxt) {
    QRCheckVinnumber = VinNumber + Modeltxt;
    $("#QRCodeScanPopup").modal('show');
    startScan();
}


function startScan() {
    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete"
            || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    docReady(function () {
        var resultContainer = document.getElementById('qr-reader-results');
        var lastResult, countResults = 0;

        function onScanSuccess(qrCodeMessage) {
            //alert(qrCodeMessage);
            //$("#txtVinQRNumber").val(qrCodeMessage)


            $("#qr-reader").hide();
            $("#qr-reader-results").hide();
            if (qrCodeMessage !== lastResult) {
                ++countResults;
                lastResult = qrCodeMessage;
                resultContainer.innerHTML
                    += `<div>[${countResults}] - ${qrCodeMessage}</div>`;
        }

        html5QrcodeScanner.clear();
            if (QRCheckVinnumber == qrCodeMessage) {
                $("#QRCodeScanPopup").modal('hide');
                NavigateQFLFeedBackPage(qrCodeMessage)
            }
            else {
                $("#QRCodeScanPopup").modal('hide');
                $("#AlertModal").modal('show');
                $("#AlertTitle").text('VinModel are not Matched');
            }
    }

         
var html5QrcodeScanner = new Html5QrcodeScanner(
               "qr-reader", { fps: 10, qrbox: 500 });
html5QrcodeScanner.render(onScanSuccess);
$("#qr-reader").show();
$("#qr-reader-results").show();



$(document).ready(function () {
    $("#qr-reader__dashboard_section_swaplink").hide();
    $("#permission").css('display', 'none').trigger("click");
    $("#start").css('display', 'none').trigger("click");
});

});
}

function NavigateQFLFeedBackPage(qrCodeMessage)
{

    document.location.href = "../Home/ProgressMonitorToQFLFeedback?Vinnumber=" + qrCodeMessage;
}

function ProgressMonitorFromandEndDate() {
    var d = new Date();
    var currMonth = d.getMonth();
    var currYear = d.getFullYear();
    //var startDate = new Date(currYear, currMonth, 1);
    var startDate = new Date(currYear, currMonth, (d.getDate() - 7));
    var EndDate = new Date(currYear, currMonth, (d.getDate()));

    $('#startDate').datetimepicker("setDate", startDate);
    $("#endDate").datetimepicker("setDate", EndDate);
}

var glbLineid = 0
function ClickLineCollapse(value, LineId) {

    glbLineid = LineId;
}
function BindingUpdatedDynamicValues(data) {
    var Dynamicid = 0;

    if (data.ListOfDetails.length > 0 && data != null) {

        $.each(data.ListOfDetails, function (n, item) {
            Dynamicid = "DynamicdetailsId_" + item.QFLWorkFeedBackworkflowId + '_' + item.NewProgressColumnId;

            $("#" + Dynamicid).text(item.DynamicValues);
        });
    }
}

var FilterI = "";

var DynamicFileName1 = "";
var DynamicFileName2 = "";
var DynamicFileName3 = "";
var DynamicFileName4 = "";
var DynamicFileName5 = "";
var DynamicFileName6 = "";
var DynamicFileName7 = "";
var DynamicFileName8 = "";
var DynamicFileName9 = "";
var DynamicFileName10 = "";

function FilterDropdown(i) {
    if (FilterI == "") {

    }
    else {
        i = FilterI
    }
    $('#ddlVin' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        enableFiltering: true,
        maxHeight: 450,
        onClick: function (view) {
            arr = [];
            view = $("#ddlVin" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                // arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(0).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(0).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(0).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlVin' + i).multipleSelect("uncheckAll");

    $('#ddlvehicle' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#ddlvehicle" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(1).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(1).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(1).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlvehicle' + i).multipleSelect("uncheckAll");

    $('#ddlmodel' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#ddlmodel" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //  arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(2).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(2).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(2).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlmodel' + i).multipleSelect("uncheckAll");

    $('#ddlpartname' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#ddlpartname" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                // arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(3).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(3).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(3).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlpartname' + i).multipleSelect("uncheckAll");

    $('#ddldefect' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#ddldefect" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);
            });

            var table = $('#sorttable' + i).DataTable();


            table.column(4).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(4).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(4).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddldefect' + i).multipleSelect("uncheckAll");


    $('#ddlStatus' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];

            view = $("#ddlStatus" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);

            });

            var table = $('#sorttable' + i).DataTable();
            //arr = arr.join('|');
            // table.column(5).search(arr).draw();
            //table.column(5).search("Not Ok").draw();

            table.column(5).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(5).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(5).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlStatus' + i).multipleSelect("uncheckAll");

    $('#ddlComments' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];

            view = $("#ddlComments" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);

            });

            var table = $('#sorttable' + i).DataTable();
            //arr = arr.join('|');
            // table.column(5).search(arr).draw();
            //table.column(5).search("Not Ok").draw();

            table.column(6).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(6).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(6).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlComments' + i).multipleSelect("uncheckAll");


    $('#ddlPhoto' + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];

            view = $("#ddlPhoto" + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                //arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
                arr.push([view[i]]);

            });

            var table = $('#sorttable' + i).DataTable();
            //arr = arr.join('|');
            // table.column(5).search(arr).draw();
            //table.column(5).search("Not Ok").draw();

            table.column(7).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(7).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(7).search('').draw();

        },
        onOpen: function () {
        }
    });
    $('#ddlPhoto' + i).multipleSelect("uncheckAll");


    $('#' + DynamicFileName1 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName1 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(8).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(8).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(8).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName1 + i).multipleSelect("uncheckAll");



    $('#' + DynamicFileName2 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName2 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(9).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(9).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(9).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName2 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName3 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName3 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(10).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(10).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(10).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName3 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName4 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName4 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(11).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(11).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(11).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName4 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName5 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName5 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(12).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(12).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(12).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName5 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName6 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName6 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(13).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(13).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(13).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName6 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName7 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName7 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(14).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(14).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(14).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName7 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName8 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName8 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(15).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(15).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(15).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName8 + i).multipleSelect("uncheckAll");

    $('#' + DynamicFileName9 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName9 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(16).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(16).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(16).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName9 + i).multipleSelect("uncheckAll");


    $('#' + DynamicFileName10 + i).multipleSelect({
        filter: true,
        placeholder: "Select",
        width: "100%",
        onClick: function (view) {
            arr = [];
            view = $("#" + DynamicFileName10 + i).multipleSelect("getSelects", "text");

            $.each(view, function (i, item) {
                arr.push(['^(' + view[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')$']);
            });

            var table = $('#sorttable' + i).DataTable();

            table.column(17).search(arr.join('|'), true, false).draw();

        },
        onUncheckAll: function () {

            var table = $('#sorttable' + i).DataTable();
            table.column(17).search('').draw();

        },
        onCheckAll: function () {
            var table = $('#sorttable' + i).DataTable();
            table.column(17).search('').draw();

        },
        onOpen: function () {

        }

    });

    $('#' + DynamicFileName10 + i).multipleSelect("uncheckAll");


}

var AfterSelectedColour = "";

function GetColour(color) {

    // $("#ColourPopup").modal('hide');
    $('#colorid_' + selectedClass + '_' + QFLWorkFeedBackworkflowId).css('display', 'none');
    //$('#colorid_' + selectedClass + "_" + QFLWorkFeedBackworkflowId).show();

    var json = {
        "Vinnumber": VinNumber,
        "QFLWorkFeedBackworkflowId": QFLWorkFeedBackworkflowId,
        "SelectValue": selectedClass,
        "SelectedColor": color
    };
    var Input = JSON.stringify(json);

    var ApiFunc = Api + 'Monitor.svc/UpdateAllProgressColor';
    PostMethod(ApiFunc, Input, Token, function (data) {
        if (data.Result == "Success") {
            if (selectedClass == "PartName" || selectedClass == "Defect") {
                $('#PartName' + "_" + QFLWorkFeedBackworkflowId).css({ "background-color": color });
                $('#Defect' + "_" + QFLWorkFeedBackworkflowId).css({ "background-color": color });

            }
            else {
                $('.' + selectedClass + "_" + VinNumber).css({ "background-color": color });


            }
        }

    });
    AfterSelectedColour = "Yes";
}

//---------------------------------END -----------------------------------------------