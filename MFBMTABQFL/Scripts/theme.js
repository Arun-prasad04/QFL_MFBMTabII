/*------------------------------------------------------------------
Concern Tracking System Admin Template by Ganapathi Subramaniam, Arun Prasad

For

Daimler India Commercial Vehicle
------------------------------------------------------------------*/

/*****************************************************************
Concern Tracking System Theme.js Table of Contents

- Document Ready State
- ShrinkTable
- Close minizined table
- Dynamic Page scroll 
- Tooltips
	
!Note: You can search using the title above
*****************************************************************/

// Document Ready State
function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }

    return assoc;
}

var PlantId = 0;
var dict = {


    "English": {
        jp: "英語",
        en: "English"
    },
    "Japanese": {
        jp: "日本語",
        en: "Japanese"
    },
    "Change Password": {
        jp: "パスワードを変更する",
        en: "Change Password"
    },
    "Last Login": {
        jp: "前回のログイン",
        en: "Last Login"
    },
    "Log out": {
        jp: "ログアウト",
        en: "Log out"
    },
    "DTA QM Automated QFL Tool": {
        jp: "DTA QM自動QFLツール",
        en: "DTA QM Automated QFL Tool"
    },
    "Home": {
        jp: "ホーム",
        en: "Home"
    },
    "Progress Monitor": {
        jp: "進捗モニター",
        en: "Progress Monitor"
    },
    "QFL Feedback": {
        jp: "QFLフィードバック",
        en: "QFL Feedback"
    },
    "Extras": {
        jp: "エクストラ",
        en: "Extras"
    },
    "Reports": {
        jp: "レポート",
        en: "Reports"
    },
    "DPU Report": {
        jp: "DPUレポート",
        en: "DPU Report"
    },
    "Defect Number Report": {
        jp: "不良数レポート",
        en: "Defect Number Report"
    },
    "QGate Master": {
        jp: "QGateマスター",
        en: "QGate Master"
    },
    "Standard Master": {
        jp: "標準マスター",
        en: "Standard Master"
    },
    "Defect Place Master": {
        jp: "欠陥場所マスター",
        en: "Defect Place Master"
    },
    "Add Model": {
        jp: "モデルを追加",
        en: "Add Model"
    },
    "Add Vehicle Type": {
        jp: "車両タイプを追加",
        en: "Add Vehicle Type"
    },
    "Vehicle Type": {
        jp: "車両タイプ",
        en: "Vehicle Type"
    },


    "Model": {
        jp: "モデル",
        en: "Model"
    },
    "Action": {
        jp: "アクション",
        en: "Action"
    },
    "Description": {
        jp: "説明",
        en: "Description"
    },
    "Damage Code": {
        jp: "ダメージコード",
        en: "Damage Code"
    },
    "Created Date": {
        jp: "作成日",
        en: "Created Date"
    },
    "Part No": {
        jp: "部品番号",
        en: "Part No"
    },
    "Status": {
        jp: "状態",
        en: "Status"
    },
    "Raised by": {
        jp: "育った",
        en: "Raised by"
    },
    "Select": {
        jp: "選択",
        en: "Select"
    },
    " Select ": {
        jp: "選択",
        en: " Select "
    },
    "select": {
        jp: "選択",
        en: "select"
    },
    "Close": {
        jp: "閉じる",
        en: "Close"
    },
    "Select All": {
        jp: "すべて選択",
        en: "Select All"
    },
    "All selected": {
        jp: "すべて選択",
        en: "All selected"
    },
    "From Date": {
        jp: "日付から",
        en: "From Date"
    },
    "To Date": {
        jp: "現在まで",
        en: "To Date"
    },
    "filtered from": {
        jp: "フィルタリングされた",
        en: "filtered from"
    },
    "total entries": {
        jp: "合計エントリ",
        en: "total entries"
    },
    "No matching records found": {
        jp: "該当する記録が見つかりません",
        en: "No matching records found"
    },
    "No Records Found": {
        jp: "レコードが見つかりません",
        en: "No Records Found"
    },
    "Confirmation": {
        jp: "確認",
        en: "Confirmation"
    },
    "OK": {
        jp: "はい",
        en: "OK"
    },
    "Ok": {
        jp: "はい",
        en: "Ok"
    },
    "Showing": {
        jp: "見せる",
        en: "Showing"
    },
    "to ": {
        jp: "に",
        en: "to"
    },
    "of": {
        jp: "の",
        en: "of"
    },
    "entries": {
        jp: "エントリー",
        en: "entries"
    },
    "Previous": {
        jp: "前",
        en: "Previous"
    },
    "Next": {
        jp: "次",
        en: "Next"
    },
    "Browse": {
        jp: "ブラウズ",
        en: "Browse"
    },
    "Plant": {
        jp: "工場",
        en: "Plant"
    },
    "Edit Vehicle Type": {
        jp: "車両タイプを編集",
        en: "Edit Vehicle Type"
    },
    "Update": {
        jp: "更新",
        en: "Update"
    },
    "Defect Class": {
        jp: "欠陥クラス説明",
        en: "Defect Class"
    },
    "Enter VIN + Model": {
        jp: "VIN +モデル",
        en: "Enter VIN + Model"
    },
    "Quality Gate": {
        jp: "品質ゲート",
        en: "Quality Gate"
    },
    "No of Defects": {
        jp: "欠陥の数",
        en: "No of Defects"
    },
    "Vehicle/Product Type": {
        jp: "車両/製品タイプ",
        en: "Vehicle/Product Type"
    },
    "Variant Master": {
        jp: "バリアントマスター",
        en: "Variant Master"
    },
    "Vehicle Type Master": {
        jp: "車両タイプマスター",
        en: "Vehicle Type Master"
    },
    "Vehicle Type": {
        jp: "車両タイプ",
        en: "Vehicle Type"
    },
    "Add Vehicle Type": {
        jp: "車両タイプを追加",
        en: "Add Vehicle Type"
    },
    "Add Variant": {
        jp: "バリアントの追加",
        en: "Add Variant"
    },
    "Variant": {
        jp: "ボデータイプ",
        en: "Variant"
    },
    "Part Name": {
        jp: "部品名",
        en: "Part Name"
    },
    "Station No": {
        jp: "駅番号",
        en: "Station No"
    },
    "Defect Category": {
        jp: "欠陥カテゴリ",
        en: "Defect Category"
    },
    "Customer Impact": {
        jp: "顧客への影響",
        en: "Customer Impact"
    },
    "Supplier Name": {
        jp: "サプライヤ名",
        en: "Supplier Name"
    },
    "Defect Source": {
        jp: "欠陥源",
        en: "Defect Source"
    },
    "Responsible Person": {
        jp: "担当者",
        en: "Responsible Person"
    },
    "Responsible Department": {
        jp: "責任部",
        en: "Responsible Department"
    },
    "Image": {
        jp: "画像",
        en: "Image"
    },
    "Supplier": {
        jp: "サプライヤー",
        en: "Supplier"
    },
    "Transit": {
        jp: "トランジット",
        en: "Transit"
    },
    "Logistics": {
        jp: "ロジスティクス",
        en: "Logistics"
    },
    "Production Line": {
        jp: "生産ライン",
        en: "Production Line"
    },
    "Stockyard": {
        jp: "ストックヤード",
        en: "Stockyard"
    },
    "Dealer Stock": {
        jp: "ディーラーストック",
        en: "Dealer Stock"
    },
    "Field": {
        jp: "フィールド",
        en: "Field"
    },
    "Affected Qty": {
        jp: "影響を受ける数量",
        en: "Affected Qty"
    },
    "Retrofitment/Rework Qty as on date": {
        jp: "レトロフィット/リワーク",
        en: "Retrofitment/Rework Qty as on date"
    },
    "Issue History": {
        jp: "発行履歴",
        en: "Issue History"
    },
    "Date": {
        jp: "日付",
        en: "Date"
    },
    "VIN No / PIN": {
        jp: "VIN番号/ PIN",
        en: "VIN No / PIN"
    },
    "Observed By": {
        jp: "観察者",
        en: "Observed By"
    },
    "Remarks": {
        jp: "備考",
        en: "Remarks"
    },
    "Add": {
        jp: "追加",
        en: "Add"
    },
    "Clear": {
        jp: "クリア",
        en: "Clear"
    },
    "Product Audit Tracker": {
        jp: "製品監査トラッカー",
        en: "Product Audit Tracker"
    },
    "Audit Date": {
        jp: "監査日",
        en: "Audit Date"
    },
    "Total DPU": {
        jp: "総DPU",
        en: "Total DPU"
    },
    "Audited By": {
        jp: "監査人",
        en: "Audited By"
    },
    "Audit Observation": {
        jp: "監査観測",
        en: "Audit Observation"
    },
    "Submit": {
        jp: "提出する",
        en: "Submit"
    },
    "Save": {
        jp: "セーブ",
        en: "Save"
    },
    "Cancel": {
        jp: "キャンセル",
        en: "Cancel"
    },
    "Delete": {
        jp: "削除",
        en: "Delete"
    },
    "Problem Description": {
        jp: "問題の説明",
        en: "Problem Description"
    },
    "Containment Action": {
        jp: "閉じ込めアクション",
        en: "Containment Action"
    },
    "Root Cause Analysis": {
        jp: "問題の説明",
        en: "Root Cause Analysis"
    },
    "Root Cause Analysis": {
        jp: "根本原因分析",
        en: "Root Cause Analysis"
    },
    "Corrective Action": {
        jp: "是正処置",
        en: "Corrective Action"
    },
    "Monitoring Effectiveness": {
        jp: "モニタリングの有効性",
        en: "Monitoring Effectiveness"
    },
    "Action Date": {
        jp: "アクションの日付",
        en: "Action Date"
    },
    "Attachments": {
        jp: "添付ファイル",
        en: "Attachments"
    },
    "Plan Date": {
        jp: "計画日",
        en: "Plan Date"
    },
    "Implementation VIN No": {
        jp: "実装VINいいえ",
        en: "Implementation VIN No"
    },
    "Start Date": {
        jp: "開始日",
        en: "Start Date"
    },
    "IAR Rejection": {
        jp: "IAR拒否",
        en: "IAR Rejection"
    },
    "Rejection Comments": {
        jp: "拒否コメント",
        en: "Rejection Comments"
    },
    "ReOpen Confirmation": {
        jp: "再確認の確認",
        en: "ReOpen Confirmation"
    },
    "Confirmation": {
        jp: "確認",
        en: "Confirmation"
    },
    "Are you sure? Want to ReOpen this Issue?": {
        jp: "本気ですか？ この問題を再開したいですか？",
        en: "Are you sure? Want to ReOpen this Issue?"
    },
    "No": {
        jp: "いいえ",
        en: "No"
    },
    "Yes": {
        jp: "はい",
        en: "Yes"
    },
    "Current Status": {
        jp: "現在のステータス",
        en: "Current Status"
    },
    "Registered IAR": {
        jp: "登録されたIAR",
        en: "Registered IAR"
    },
    "Open": {
        jp: "開いた",
        en: "Open"
    },
    "Implementation": {
        jp: "実装",
        en: "Implementation"
    },
    "Monitoring": {
        jp: "モニタリング",
        en: "Monitoring"
    },
    "Closed": {
        jp: "閉館",
        en: "Closed"
    },
    "Concern Details": {
        jp: "懸念事項",
        en: "Concern Details"
    },
    "Actions": {
        jp: "行動",
        en: "Actions"
    },
    "History": {
        jp: "歴史",
        en: "History"
    },
    "ReOpen": {
        jp: "再オープン",
        en: "ReOpen"
    },
    "Move To Monitoring": {
        jp: "モニタリングに移動",
        en: "Move To Monitoring"
    },
    "Expected Closure Date": {
        jp: "予想終了日",
        en: "Expected Closure Date"
    },
    "Containment Action History": {
        jp: "封じ込め行動の歴史",
        en: "Containment Action History"
    },
    "Root Cause Analysis History": {
        jp: "根本原因分析の履歴",
        en: "Root Cause Analysis History"
    },
    "Corrective Action History": {
        jp: "是正措置の歴史",
        en: "Corrective Action History"
    },
    "Monitoring Effectiveness History": {
        jp: "有効性履歴の監視",
        en: "Monitoring Effectiveness History"
    },
    "Remarks History": {
        jp: "備考歴史",
        en: "Remarks History"
    },
    "Observations": {
        jp: "観察",
        en: "Observations"
    },
    "Save As Draft": {
        jp: "下書きとして保存",
        en: "Save As Draft"
    },
    "Project Master": {
        jp: "プロジェクトマスター",
        en: "Project&nbsp;Master"
    },
    "Production Stage Master": {
        jp: "生産ステージマスター",
        en: "Production Stage Master"
    },
    "Add Project": {
        jp: "プロジェクトを追加",
        en: "Add Project"
    },
    "Action": {
        jp: "アクション",
        en: "Action"
    },
    "Add Production Stage": {
        jp: "プロダクションステージを追加",
        en: "Add Production Stage"
    },
    "QFL Type Master": {
        jp: "QFLタイプマスター",
        en: "QFL Type Master"
    },
    "Add QFL Type": {
        jp: "QFLタイプを追加",
        en: "Add QFL Type"
    },
    "Production Stage Name": {
        jp: "生産段階名",
        en: "Production Stage Name"
    },
    "Add Quality Gate": {
        jp: "品質ゲートを追加",
        en: "Add Quality Gate"
    },
    "Quality Gate Master": {
        jp: "品質ゲートマスター",
        en: "Quality Gate Master"
    },
    "Customer Impact Master": {
        jp: "カスタマーインパクトマスター",
        en: "Customer Impact Master"
    },
    "Add Customer Impact": {
        jp: "顧客への影響を加える",
        en: "Add Customer Impact"
    },
    "Add Defect Category": {
        jp: "欠陥カテゴリを追加する",
        en: "Add Defect Category"
    },
    "Defect Category Master": {
        jp: "欠陥カテゴリマスター",
        en: "Defect Category Master"
    },
    "Add Defect Source": {
        jp: "欠陥ソースを追加する",
        en: "Add Defect Source"
    },
    "Defect Source Master": {
        jp: "欠陥源マスタ",
        en: "Defect Source Master"
    },
    "Add IRA Responsible": {
        jp: "責任あるIRAを追加",
        en: "Add IRA Responsible"
    },
    "IRA Responsible Master": {
        jp: "IRA責任マスター",
        en: "IRA Responsible Master"
    },
    "DTA QM Automated QFL Tool": {
        jp: "DTA QM自動QFLツール",
        en: "DTA QM Automated QFL Tool"
    },
    "QGate Master": {
        jp: "QGateマスター",
        en: "QGate Master"
    },
    "Quality Gate": {
        jp: "品質ゲート",
        en: "Quality Gate"
    },
    "QFL Feedback": {
        jp: "QFLのフィードバック",
        en: "QFL Feedback"
    },
    "VIN/PIN": {
        jp: "VIN/PIN",
        en: "VIN/PIN"
    },
    "Check Items": {
        jp: "チェック項目",
        en: "Check Items"
    },
    "Spec": {
        jp: "仕様",
        en: "Spec"
    },
    "Actual/Comment": {
        jp: "実際/コメント",
        en: "Actual/Comment"
    },
    "Defect Description": {
        jp: "欠陥の説明",
        en: "Defect Description"
    },
    "Spec. Min": {
        jp: "スペック分",
        en: "Spec. Min"
    },
    "Spec. Max": {
        jp: "スペック最大",
        en: "Spec. Max"
    },
    "View CheckList": {
        jp: "チェックリストを見る",
        en: "View CheckList"
    },
    "QFL Dashboard": {
        jp: "QFLダッシュボード",
        en: "QFL Dashboard"
    },
    "Actual Value/Spec": {
        jp: "実績値/仕様",
        en: "Actual Value/Spec"
    },
    "Comments": {
        jp: "コメント",
        en: "Comments"
    },
    "Upload Image": {
        jp: "画像をアップロード",
        en: "Upload Image"
    },
    "Browse...": {
        jp: "ブラウズ...",
        en: "Browse..."
    },
    "Assembly Name": {
        jp: "アセンブリ名",
        en: "Assembly Name"
    },
    "Method Of Inspection": {
        jp: "検査方法",
        en: "Method Of Inspection"
    },
    "Part Level 3": {
        jp: "パートレベル3",
        en: "Part Level 3"
    },
    "Part Level 4": {
        jp: "パートレベル4",
        en: "Part Level 4"
    },
    "Part Level 5": {
        jp: "パートレベル5",
        en: "Part Level 5"
    },
    "Option 1": {
        jp: "オプション1",
        en: "Option 1"
    },
    "Option 2": {
        jp: "オプション2",
        en: "Option 2"
    }
    ,
    "Remarks 1": {
        jp: "備考 1",
        en: "Remarks 1"
    },
    "Remarks 2": {
        jp: "備考 2",
        en: "Remarks 2"
    },
    "Progress Monitor": {
        jp: "プログレスモニタ",
        en: "Progress Monitor"
    },
    "Previous": {
        jp: "以前の",
        en: "Previous"
    },
    "Next": {
        jp: "次",
        en: "Next"
    },
    "Total Check Items": {
        jp: "合計チェック項目",
        en: "Total Check Items"
    },
    "Not Ok": {
        jp: "良くない。",
        en: "Not Ok"
    },
    "VIN/Prod.Iden.No": {
        jp: "VIN /工事番号",
        en: "VIN/Prod.Iden.No"
    },
    "QGate": {
        jp: "Qゲート",
        en: "QGate"
    },
    "Customer": {
        jp: "顧客",
        en: "Customer"
    },
    "Standard": {
        jp: "標準",
        en: "Standard"
    },
    "Pending": {
        jp: "保留中",
        en: "Pending"
    },
    "Showing": {
        jp: "見せる",
        en: "Showing"
    },
    "Entries": {
        jp: "エントリー",
        en: "Entries"
    },
    "Skipped": {
        jp: "スキップした",
        en: "Skipped"
    },
    "Keep all existing check items and add new items": {
        jp: "既存のチェック項目をすべて保持して新しい項目を追加する",
        en: "Keep all existing check items and add new items"
    },
    "Delete all existing check items and upload": {
        jp: "既存のチェック項目をすべて削除してアップロードする",
        en: "Delete all existing check items and upload"
    },
    "Upload CheckList": {
        jp: "チェックリストをアップロード",
        en: "Upload CheckList"
    },
    "End Date": {
        jp: "終了日",
        en: "End Date"
    },
    "Please Select a Plant to Proceed": {
        jp: "続行するプラントを選択してください",
        en: "Please Select a Plant to Proceed"
    },
    "No Checklist Uploaded": {
        jp: "アップロードされたチェックリストがありません",
        en: "No Checklist Uploaded"
    },
    "Checklist updated on": {
        jp: "更新されたチェックリスト",
        en: "Checklist updated on"
    },
    "Upload": {
        jp: "アップロード",
        en: "Upload"
    },
    "View History": {
        jp: "ビューの履歴",
        en: "View History"
    },
    "File Name": {
        jp: "ファイル名",
        en: "File Name"
    },
    "Model-Variant": {
        jp: "ファイル名",
        en: "Model-Variant"
    },
    "Uploaded by": {
        jp: "アップロード者",
        en: "Uploaded by"
    },
    "Uploaded on": {
        jp: "アップロードされた",
        en: "Uploaded on"
    },
    "View Checkpoint": {
        jp: "チェックポイントの表示",
        en: "View Checkpoint"
    }
    ,
    "Add New Checkpoint": {
        jp: "新しいチェックポイントを追加する",
        en: "Add New Checkpoint"
    },
    "Select a file to Upload": {
        jp: "アップロードするファイルを選択してください",
        en: "Select a file to Upload"
    },
    "Year": {
        jp: "年",
        en: "Year"
    },
    "By Vehicle Type": {
        jp: "車種別",
        en: "By Vehicle Type"
    },
    "By Stations": {
        jp: "駅で",
        en: "By Stations"
    },
    "By Defect Type": {
        jp: "不良タイプ別",
        en: "By Defect Type"
    },
    "By Classification": {
        jp: "分類別",
        en: "By Classification"
    },
    "DPU by Vehicle Type": {
        jp: "車種別DPU",
        en: "DPU by Vehicle Type"
    },
    "DPU by Stations": {
        jp: "駅別DPU",
        en: "DPU by Stations"
    },
    "Search": {
        jp: "サーチ",
        en: "Search"
    },
    "Others ...": {
        jp: "その他",
        en: "Others ..."
    },
    "Others": {
        jp: "その他",
        en: "Others"
    },

    "This VIN has been added already with different line. Please check the VIN again.": {

        jp: "このVINはすでに別の回線で追加されています。もう一度VINを確認してください.",
        en: "This VIN has been added already with different line. Please check the VIN again."
    },

    "This VIN has been added already with different vehicle type / model. Please check the VIN again.": {

        jp: "このVINはすでに別の車種/モデルで追加されています。もう一度VINを確認してください.",
        en: "This VIN has been added already with different vehicle type / model. Please check the VIN again."
    },

    "vinIsCompleted": {
        jp: "完了",
        en: "Completed"
    },
    "ReCompleted": {
        jp: "完了を元に戻す",
        en: "Revert Completion"
    },
    "Reasonfordeleting": {
        jp: "VINを削除する理由を入力してください",
        en: "Please input reason for deleting the VIN"
    },
    "Responsible": {
        jp: "担当者",
        en: "Responsible"
    },
    "DamageCode": {
        jp: "不具合コード",
        en: "Damage Code"
    },
    "UploadFile": {
        jp: "ファイルをアップロードする",
        en: "Upload File"
    },
    "ExporttoExcel": {
        jp: "Excelにエクスポート",
        en: "Export to Excel"
    },
    "DownloadVINData": {
        jp: "VINデータのダウンロード",
        en: "Download VIN Data"
    },
    "DownloadIssueData":
    {
        jp: "課題データのダウンロード",
        en: "Download Issue Data"
    },
    "None of files available for this Vehicle and Model":
    {
        jp: "この車両およびモデルで使用可能なファイルはありません！..",
        en: "None of files available for this Vehicle and Model!.."
    },
    "Rework":
    {
        jp: "未修整",
        en: "Rework"
    },
    "Re-examination":
    {
        jp: "検査待",
        en: "Re-examination"
    },
    "Re-Examination":
    {
        jp: "検査待",
        en: "Re-Examination"
    },

    "HDB Line":
    {
        en: "HDB Line",
        jp: "HDB ライン"
    },
    "LDB Line":
    {
        en: "LDB Line",
        jp: "LDB ライン"
    },
    "Seal":
    {
        jp: "封",
        en: "Seal"
    },
    "This Model is Not Available":
    {
        jp: "「このモデルは利用できません",
        en: "This Model is Not Available"
    },

    "Uploaded By":
    {
        jp: "アップロード者",
        en: "Uploaded By"
    },
    "Uploaded On":
    {
        jp: "アップロード",
        en: "Uploaded On"
    },
    "Attachment":
    {
        jp: "別添",
        en: "Attachment"
    },
    "Standard Name":
    {
        jp: "標準名",
        en: "Standard Name"
    },
    "Serial No":
    {
        jp: "シリアル番号",
        en: "Serial No"
    },
    "Standard":
    {
        jp: "標準",
        en: "Standard"
    },
    "Action":
    {
        jp: "アクション",
        en: "Action"
    },
    "Defect Place":
    {
        jp: "欠陥場所",
        en: "Defect Place"
    },
    "Name":
    {
        jp: "名前",
        en: "Name"
    },
    "Template":
    {
        jp: "テンプレート",
        en: "Template"
    },
    "Add New":
    {
        jp: "新しく追加する",
        en: "Add New"
    },
    "Defect Place Master":
    {
        jp: "欠陥場所マスター",
        en: "Defect Place Master"
    },
    "Edit Standard Master":
    {
        jp: "標準マスターを編集します",
        en: "Edit Standard Master"
    },
    "Showing":
    {
        jp: "表示中",
        en: "Showing"
    },
    "entries":
    {
        jp: "エントリー",
        en: "entries"
    },
    "Vin":
    {
        jp: "ヴィン",
        en: "Vin"
    },
    "Model":
    {
        jp: "モデル",
        en: "Model"
    },
    "Line":
    {
        jp: "ライン",
        en: "Line"
    },
    "CommentsFiles":
    {
        jp: "コメントファイル",
        en: "CommentsFiles"
    },
    "Actual Comments":
    {
        jp: "実際のコメント",
        en: "Actual Comments"
    },
    "Choose File":
    {
        jp: "ファイルを選ぶ",
        en: "Choose File"
    },

    "Completed":
    {
        jp: "完了しました",
        en: "Completed"

    },
    "Revert Completion":
    {
        jp: "完了を元に戻す",
        en: "Revert Completion"
    },



    "Revert Completion":
    {
        jp: "完了を元に戻す",
        en: "Revert Completion"

    },


    "Gate Name":
    {
        jp: "ゲート名",
        en: "Gate Name"
    },
    "Completed By":
    {
        jp: "完了者",
        en: "Completed By"
    },
    "Completed Date":
    {
        jp: "完了日",
        en: "Completed Date"
    },
    "Signature":
    {
        jp: "署名",
        en: "Signature"
    },
    "Site":
    {
        jp: "敷地",
        en: "Site"
    },
    "Reset":
    {
        jp: "リセット",
        en: "Reset"

    },
    "Done":
    {
        jp: "できた",
        en: "Done"
    },

    "Skip":
    {
        jp: "スキップ",
        en: "Skip"
    },

    "Back":
    {
        jp: "バック",
        en: "Back"
    },

    "Defective Places":
    {
        jp: "欠陥のある場所",
        en: "Defective Places"
    },

    "Defect":
    {
        jp: "欠陥",
        en: "Defect"
    },


    "QG Re-examination":
{
        jp: "QG 検査待",
    en: "QG Re-examination"
},
    "QG Re-Examination":
    {
        jp: "QG 検査待",
        en: "QG Re-Examination"
    },

    "完成 Re-examination":
    {
        jp: "完成 検査待",
        en: "完成 Re-examination"
    },
    "完成 Re-Examination":
    {
        jp: "完成 検査待",
        en: "完成 Re-Examination"
    },

    "Check Items":
    {
        jp: "チェック項目",
        en: "Check Items"
    },

}

$(document).ready(function () {

    //Tooltips(); // Tooltip
    //overallTableScroll(); //overallTableScroll
    AutomatedQFLPage();
    AutomatedQFLPage_ProgressMonitor();
    //EditConcernDetails();
    //  $('.Languagepicker').selectpicker();


    $('.Languagepicker').on('change', function (ev) {
        var selected = $(this).find("option:selected").val();
        //alert(selected);
        var ApiFunc = '../Home/LanguageChanger?input=' + selected;

        var input = JSON.stringify({ "input": selected });

        JsonPostMethod(ApiFunc, '', '', function (data) {

            Conversion(selected);
            ev.preventDefault();
            $('.Languagepicker').selectpicker('val', selected);
            ReloadUserDetails(selected);
        });
    });









    var qs = getQueryStrings();
    var selected = $('.Languagepicker').val();
    var translator = '';
    var myParam = qs["ln"];
    if (myParam != null && myParam != undefined && selected != null && selected != '') {
        $('.Languagepicker').selectpicker('val', myParam);
        Conversion(myParam);
    }



 

});

// End of Document Ready State

function Conversion(ln) {

    var translator = $('#lBody').translate({ lang: ln, t: dict });
}

// End of Document Ready State

//function Conversion(ln) {
//    var translator = $('#lBody').translate({ lang: ln, t: dict });
//    $("#searchByVehicleType,#QFLFeedbackSearch,#ProgressMonitorSearch,#searchByStation,#excelId,#btnClose,#searchByStation,#searchByDefectType,#searchClassification").removeAttr('title')

//    $('.Languagepicker').val() != "en" ? $("#ExportExcel,#excelId").attr("data-original-title", "Excelにエクスポート") : $("#ExportExcel,#excelId").attr("data-original-title", "Export to Excel");

//    $('.Languagepicker').val() != "en" ? $("#btnClose").attr("data-original-title", "閉じる") : $("#btnClose").attr("data-original-title", "Close");

//    $('.Languagepicker').val() != "en" ? $("#searchByVehicleType,#searchByStation,#ProgressMonitorSearch,#QFLFeedbackSearch,#searchByStation,#searchByDefectType,#searchClassification").attr("data-original-title", "サーチ") : $("#searchByVehicleType,#searchByStation,#ProgressMonitorSearch,#QFLFeedbackSearch,#searchByStation,#searchByDefectType,#searchClassification").attr("data-original-title", "Search");
//}

// Shrink Table
function ShrinkTable() {



}

// Close minizined table

function CloseEditSchedule() {

    $(".tblsmall").removeClass("tableMinimized col-lg-3");
    $('[data-label]').css('display', '');
    $('[data-minilabel]').css('display', '');
    $(".tblsmalledit").hide();
    $("tr").removeClass("activegrey");
    $("body").removeClass("bodyoveflow");
    overallTableScrollCustomized();


}

// Dynamic Page scroll 

function resizeContent() {

    $(".tableMinimized,.smalltbleditablecontent").mCustomScrollbar({
        //setHeight:340,
        theme: "minimal-dark",
        //theme:"inset-2-dark"
        //theme:"dark-3"
        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 290;
    $(".tableMinimized ").height($height);
    $(".smalltbleditablecontent ").height($height);
    $(".Table_contentpanel ").height($height);

}

//overall table tab scroll


function EditConcernDetails() {

    $(".EditConcern").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 220;

    $(".EditConcern").height($height);

}




function AutomatedQFLPage() {

    $(".AutomatedQFLPage").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 400;

    $(".AutomatedQFLPage").height($height);


    $(".AutomatedQFLPage-qgmaster").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 320;

    $(".AutomatedQFLPage-qgmaster").height($height);


    $(".AutomatedQFLPage-clmaster").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 380;

    $(".AutomatedQFLPage-clmaster").height($height);


    $(".AutomatedQFLPage-progressmonitor").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 340;

    $(".AutomatedQFLPage-progressmonitor").height($height);

}



function AutomatedQFLPage_ProgressMonitor() {

    $(".AutomatedQFLPage_ProgressMonitor").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 380;

    $(".AutomatedQFLPage_ProgressMonitor").height($height);

    $(".AutomatedQFLPage-feedback").mCustomScrollbar({

        scrollbarPosition: "outside",
        theme: "minimal-dark",

        callbacks: {
            onScroll: function () {
                openSelect($(".js-example-tags"));
                openSelect($(".js-example-tags"));

            }
        }
    });
    $height = $(window).height() - 380;

    $(".AutomatedQFLPage-feedback").height($height);


    //$(".AutomatedQFLPage-progressmonitorNew-page").mCustomScrollbar({

    //    //scrollbarPosition: "outside",
    //    theme: "minimal-dark",

    //    //callbacks: {
    //    //    onScroll: function () {
    //    //        openSelect($(".js-example-tags"));
    //    //        openSelect($(".js-example-tags"));

    //    //    }
    //    //}
    //});
    $height = $(window).height() - 340;

    $(".AutomatedQFLPage-progressmonitorNew-page").height($height);

}


// Tooltips
function Tooltips() {

    $('body').tooltip({
        selector: '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])',
        trigger: 'hover',
        container: 'body'
    }).on('click mousedown mouseup', '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])', function () {
        $('[data-toggle="tooltip"], [title]:not([data-toggle="popover"])').tooltip('destroy');
    });

}


function DatatableFooterTranslater(id) {
    $('#' + id + '_info').translate({ lang: $('.Languagepicker').val(), t: dict });
    $('#' + id + '_paginate').translate({ lang: $('.Languagepicker').val(), t: dict });
    $('#dvCheckList').translate({ lang: $('.Languagepicker').val(), t: dict });
}


//MenuRemoveClass

function MenuRemoveClass() {
    $("#liQFLDashboardMaster").removeClass("active");
    $("#liQGateMaster").removeClass("active");
    $("#liQFLFeedback").removeClass("active");
    $("#liProgressMonitor").removeClass("active");

    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");
    $("#").removeClass("active");





}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function CheckFileType(filename) {
    var ext = filename.split('.')[1];

    var Filetype = '';
    if (ext == "pptx" || ext == "ppt") {
        Filetype = "ppt.png";
    }
    else if (ext == "xls" || ext == "xlsx" || ext == "csv") {
        Filetype = "excel.png";
    }
    else if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "svg" || ext == "JPG" || ext == "JPEG" || ext == "PNG" || ext == "SVG") {
        Filetype = "image.png";
    }
    else if (ext == "doc" || ext == "docx") {
        Filetype = "word.png";
    }
    else if (ext == "pdf") {
        Filetype = "pdf.png";
    }
    else if (ext == "mp4") {
        Filetype = "video.png";
    }
    else if (ext == "txt") {
        Filetype = "text.png";
    }
    else if (ext == "zip") {
        Filetype = "zip.png";
    }
    else {
        Filetype = "notype.png";
    }

    return Filetype;
}

function downloadFile() {
    alert('Please save the data and then download the file');
}

function openSelect(obj) {

    var element = obj[0];
    if (element != 'undefined' && element != undefined) {
        if (document.createEvent) { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(e);
        } else
            if (element.fireEvent) { // ie
                element.fireEvent("onmousedown");
            }
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


function timeoutcheck(UserDetails) {

    //var dtStr = UserDetails.LastLogin;
 
    //dtStr = new Date(Date.parse(dtStr));


    //var CDate = new Date();
    //var CamOrPm = (CDate.getHours() < 12) ? "AM" : "PM";
    //var Chour = (CDate.getHours() < 12) ? CDate.getHours() : CDate.getHours() - 12;
    //var Ccurrentmonth = CDate.getMonth() + 1;



    
    //var amOrPm1 = (dtStr.getHours() < 12) ? "AM" : "PM";
    //var hour1 = (dtStr.getHours() < 12) ? dtStr.getHours() : dtStr.getHours() - 12;
    //var currentmonth1 = dtStr.getMonth()+1;
    //var Dates1 = CDate.getDate() + '-' + Ccurrentmonth + '-' + dtStr.getFullYear() + ' ' + hour1 + ':' + dtStr.getMinutes() + ':' + dtStr.getSeconds() + ' ' + amOrPm1;
    //var OldDates1 = dtStr.getDate() + '-' + currentmonth1 + '-' + dtStr.getFullYear() + ' ' + hour1 + ':' + dtStr.getMinutes() + ':' + dtStr.getSeconds() + ' ' + amOrPm1;

    //var LoginDate = strToDate(Dates1.replace("/", "-").replace("/", "-"));



    //var d = new Date();
    //var amOrPm = (d.getHours() < 12) ? "AM" : "PM";
    //var hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;
    //var currentmonth = d.getMonth() + 1;
    //var Dates = d.getDate() + '-' + currentmonth + '-' + d.getFullYear() + ' ' + hour + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + amOrPm;
    //var CurrentDate = strToDate(Dates.replace("/", "-").replace("/", "-"));

    //var seconds = Math.floor((LoginDate - (CurrentDate)) / 1000);
    //var minutes = Math.floor(seconds / 60);
    //var hours = Math.floor(minutes / 60);
    //var days = Math.floor(hours / 24);
    


    //var replaces = minutes.toString();
    //replaces = replaces.replace("-", "");
    //var Int = parseInt(replaces);
    ////alert(replace)
    //if (Int >= 60) {

       
    //    window.location.href = "../Home/Logoff";

    //}
}

function strToDate(dtStr) {

    let dateParts = dtStr.split("-");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);

}
