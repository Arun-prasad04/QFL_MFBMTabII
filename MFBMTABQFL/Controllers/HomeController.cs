using MFBMTABQFL.Services;
using MFBMTABQFL.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Text;

using System.Web.Mvc;
using System.IO;
using System.Data;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

//using NPOI;
//using NPOI.XSSF.UserModel;
//using NPOI.SS.UserModel;
//using NPOI.HSSF;

//using System.Net;
//using OfficeOpenXml;
//using System.Reflection;
//using System.IO.Compression;
//using DocumentFormat.OpenXml.Spreadsheet;
//using System.Web.Helpers;
//using NPOI.SS.Util;

namespace MFBMTABQFL.Controllers
{
    public class HomeController : Controller
    {
        string langStatus = string.Empty;
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult Login()
        {

            LoginModel _obj = new LoginModel();
            if (Request.Cookies["Muserid"] != null)
                _obj.username = Request.Cookies["Muserid"].Value;
            if (Request.Cookies["Mpwd"] != null)
            {
                _obj.password = Request.Cookies["Mpwd"].Value;
                ViewBag.password = Request.Cookies["Mpwd"].Value;
            }
            if (Request.Cookies["Muserid"] != null && Request.Cookies["Mpwd"] != null)
                _obj.rememberme = true;

            return View(_obj);

        }

        //string langStatus = string.Empty;

        public string GenerateToken(string username, string password)
        {
            string date = DateTime.UtcNow.AddMinutes(60).ToString("yyyy-MM-dd HH:mm:ss");
            string authInfo = username + "#" + password + "#" + date;
            authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));
            return authInfo;
        }



        [HttpPost]
        public ActionResult Login(FormCollection col, LoginModel login)
        {

            WebServices Service = new WebServices();
            Users _obj = new Users();
            UserDetails Userdetail = new UserDetails();
            ValidateUserDetails Validate=new ValidateUserDetails();
            try
            {
                _obj.password = Convert.ToString(col["password"]);
                _obj.username = Convert.ToString(col["username"]);
                string language = Convert.ToString(col["language"]);
                ValidateUserDetails _users = Service.GetUserDetails(_obj);
                if (_users != null && (!string.IsNullOrEmpty(_users.Email)))
                {

                    string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["TokenUser"]), Convert.ToString(ConfigurationManager.AppSettings["TokenPass"]));
                    string username = Convert.ToString(_obj.username);
                    string password = Convert.ToString(_obj.password);
                    DataSet ds = new DataSet();
                    ds = Service.GetUserDetails(_users.Email, token);
                    Userdetail.Token = token;
                    Userdetail.Language = Convert.ToString(language);


                    var filterLogin = from Line in ds.Tables[0].AsEnumerable()

                                      select new
                                      {
                                          UserName = Line.Field<string>("UserName"),
                                          LastLogin = Line.Field<DateTime>("LastLogin"),
                                          EmailId = Line.Field<string>("Email"),
                                          RoleId = Line.Field<Int64>("RoleId"),
                                          Userid = Line.Field<Int64>("Userid"),
                                          CountryCode = Line.Field<string>("CountryCode"),
                                          Deptid = Line.Field<Int64>("Deptid"),


                                      };


                    var filterAccess = from Line in ds.Tables[1].AsEnumerable()

                                       select new
                                       {
                                           UserId = Line.Field<Int64>("UserId"),
                                           AccessId = Line.Field<Int64>("AccessId"),
                                           AccessName = Line.Field<string>("AccessName"),
                                           Toolid = Line.Field<Int64>("Toolid"),
                                           AccessType = Line.Field<string>("AccessType"),


                                       };


                    UserAccess Access = new UserAccess();
                    List<UserAccess> AccesesDetails = new List<UserAccess>();

                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        AccesesDetails.Add(new UserAccess
                        {
                            AccessId = Convert.ToInt16(dr["AccessId"]),
                            UserId = Convert.ToInt16(dr["UserId"]),
                            AccessName = Convert.ToString(dr["AccessName"]),
                            AccessType = Convert.ToString(dr["AccessType"]),
                            ToolId = Convert.ToInt16(dr["ToolId"]),
                        });
                    }

                    Userdetail.AccessDetails = AccesesDetails;

                    Userdetail.UserName = filterLogin.ElementAt(0).UserName;
                    Userdetail.LastLogin = Convert.ToString(filterLogin.ElementAt(0).LastLogin);
                    Userdetail.Email = filterLogin.ElementAt(0).EmailId.ToString();
                    Userdetail.UserId = Convert.ToInt16(filterLogin.ElementAt(0).Userid);
                    Userdetail.CountryCode = filterLogin.ElementAt(0).CountryCode;
                    Userdetail.DeptId = Convert.ToInt16(filterLogin.ElementAt(0).Deptid);
                    Userdetail.RoleId = Convert.ToInt16(filterLogin.ElementAt(0).RoleId);

                    Session["UserDetails"] = Userdetail;

                    Session["UserName"] = filterLogin.ElementAt(0).UserName;
                    Session["LastLogin"] =filterLogin.ElementAt(0).LastLogin;
                    Session["EmailId"] = filterLogin.ElementAt(0).EmailId;
                    Session["Userid"] = filterLogin.ElementAt(0).Userid;
                    Session["CountryCode"] = filterLogin.ElementAt(0).CountryCode;
                    Session["Deptid"] = filterLogin.ElementAt(0).Deptid;
                    Session["RoleId"] = filterLogin.ElementAt(0).RoleId;
                    var roleid = filterLogin.ElementAt(0).RoleId;


                    langStatus = Convert.ToString(language);

                    //Session["UserDetails"] = Userdetail;
                    //Session["UserName"] = _users.UserName;
                    //Session["Email"] = _users.Email;
                    //Session["LastLogin"] = _users.LastLogin;
                   
                    bool result = login.rememberme;
                    if (result == true)
                    {
                        Response.Cookies["Muserid"].Value = Convert.ToString(col["UserName"]);
                        Response.Cookies["Mpwd"].Value = Convert.ToString(col["Password"]);
                        Response.Cookies["Muserid"].Expires = DateTime.Now.AddDays(15);
                        Response.Cookies["Mpwd"].Expires = DateTime.Now.AddDays(15);
                    }
                    else
                    {
                        Response.Cookies["Muserid"].Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies["Mpwd"].Expires = DateTime.Now.AddDays(-1);
                    }
                    TempData["ChangePassword"] = _users.ChangePassword;
                    //For Mail Redirect to the Portal
                    if (!string.IsNullOrEmpty(Convert.ToString(TempData["RedirectToPortal"])))
                    {
                        string[] RedirectToPortal = Convert.ToString(TempData["RedirectToPortal"]).Split(':');
                        int ToolId = Convert.ToInt32(RedirectToPortal[0]);
                        string redirecttoportal = RedirectToPortal[1];

                        if (ToolId == 3)//Concern Portal
                        {
                            //string email = Convert.ToString(Session["Email"]);
                            //string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["IarUser"]), Convert.ToString(ConfigurationManager.AppSettings["IarPass"]));
                           // return Redirect(Convert.ToString(ConfigurationManager.AppSettings["QMIssueTrackerUrl"]) + "?email=" + email + "&token=" + token + "&ln=" + language + "&redirecttoiar=" + redirecttoportal + "");//Pass IAR No also here
                        }
                        else
                        {
                            return RedirectToAction("HomePage", "Home", new { id = language });
                        }
                    }
                    else if (!string.IsNullOrEmpty(Convert.ToString(TempData["auditrefno"])))
                    {
                        //string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["AuditUser"]), Convert.ToString(ConfigurationManager.AppSettings["AuditPass"]));
                        string email = Convert.ToString(Session["Email"]);
                        string stageid = Convert.ToString(TempData["stageid"]);
                        string auditrefno = Convert.ToString(TempData["auditrefno"]);
                        string url = Convert.ToString(ConfigurationManager.AppSettings["AuditToolUrl"]) + "?email=" + email + "&token=" + token + "&ln=" + language + "&stageid=" + stageid + "&auditrefno=" + auditrefno;
                        return Redirect(url);
                    }
                    else
                    {
                        return RedirectToAction("QFLFeedback");
                    }
                }
                else
                {
                    Service.WriteToLog(_obj.username + " " + _obj.password + " Wrongly attempt");
                    ViewBag.ErrorMessage = "Invalid Credentials";
                }
            }

            catch (Exception ex)
            {
                Service.WriteToLog(_obj.username + " " + ex.Message);
            }
            return View();
        }

        //[HttpPost]
        //public ActionResult Login(FormCollection col, LoginModel login)
        //{
        //    WebServices Service = new WebServices();
        //    Users _obj = new Users();
        //    try
        //    {
        //        _obj.password = Convert.ToString(col["password"]);
        //        _obj.username = Convert.ToString(col["username"]);
        //        string email = _obj.username;
        //        string language = Convert.ToString(col["language"]);

        //        Service.WriteToLog("Login Function");
        //        Service.WriteToLog("Password - " + Convert.ToString(col["password"]));
        //        Service.WriteToLog("Username - " + Convert.ToString(col["username"]));
        //        Service.WriteToLog("Language - " + Convert.ToString(col["language"]));


        //        if (_obj != null && (!string.IsNullOrEmpty(_obj.username)) && (!string.IsNullOrEmpty(_obj.password)))
        //        {
        //            UserDetails Users = new UserDetails();
        //            WebServices _web = new WebServices();
        //            string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["TokenUser"]), Convert.ToString(ConfigurationManager.AppSettings["TokenPass"]));
        //            string username = Convert.ToString(_obj.username);
        //            string password = Convert.ToString(_obj.password);
        //            Users = Service.GetUserDetails(email, token); 
        //            Users.Token = token;
        //            Users.Language = Convert.ToString(language);

        //            langStatus = Convert.ToString(language);

        //            Session["UserDetails"] = Users;
        //            Session["UserName"] = Users.UserName;
        //            Session["LastLogin"] = Users.LastLogin;
        //            Session["EmailId"] = Users.Email;

        //            bool result = login.rememberme;
        //            // if (result == true)
        //            if (!string.IsNullOrEmpty(Users.Email))
        //            {
        //                if (result == true)
        //                {
        //                    Response.Cookies["Muserid"].Value = Convert.ToString(col["UserName"]);
        //                    Response.Cookies["Mpwd"].Value = Convert.ToString(col["Password"]);
        //                    Response.Cookies["Muserid"].Expires = DateTime.Now.AddDays(15);
        //                    Response.Cookies["Mpwd"].Expires = DateTime.Now.AddDays(15);
        //                    Service.WriteToLog("Login Success - Emailid :" + Users.Email);
        //                }
        //                else
        //                {
        //                    Response.Cookies["Muserid"].Expires = DateTime.Now.AddDays(-1);
        //                    Response.Cookies["Mpwd"].Expires = DateTime.Now.AddDays(-1);
        //                    Service.WriteToLog("Login Failed - Emailid : " + Users.Email);
        //                }

        //                Service.WriteToLog("Login Function- Current Language Status:  " + langStatus);
        //                return RedirectToAction("QFLFeedback", "Home");
        //            }
        //            else
        //            {
        //                Service.WriteToLog("Login Function- Current Language Status:  " + langStatus);
        //                ViewBag.ErrorMessage = "Invalid Credentials";
        //                // return RedirectToAction("Login", "Home", new { id = language });
        //            }
        //            //Service.WriteToLog("Login Function- Current Language Status:  " + langStatus);
        //            //return RedirectToAction("QFLFeedback", "Home");
        //        }
        //        else
        //        {
        //            Service.WriteToLog("Login Function- Current Language Status:  " + langStatus);
        //            ViewBag.ErrorMessage = "Invalid Credentials";
        //            //return RedirectToAction("Login", "Home", new { id = language });

        //        }

        //    }

        //    catch (Exception ex)
        //    {
        //        Service.WriteToLog("Current Language Status:  " + langStatus);
        //        Service.WriteToLog("Login Failed : " + ex.Message);
        //    }

        //    Service.WriteToLog("Current Language Status:  " + langStatus);

        //    return View();
        //}

    
        public ActionResult Logoff()
        {

            //UserDetails Users = new UserDetails();
            //Users = (UserDetails)Session["UserDetails"];
            //ErrorLog.Log("Email = " + Users.Email);
            //ErrorLog.Log("PlantId = " + Users.PlantId);
            //ErrorLog.Log("RoleId = " + Users.RoleId);
            //ErrorLog.Log("Token = " + Users.Token);
            //ErrorLog.Log("Logout = " + "Logoff");

            Session.RemoveAll();
            return RedirectToAction("Login", "Home");
        }

        [SessionExpire]
        public ActionResult HomePage()
        {
            UserDetails users = (UserDetails)Session["UserDetails"];
            Session.RemoveAll();
            return Redirect((Convert.ToString(ConfigurationManager.AppSettings["Logout"]) + "Home/HomePage/" + users.Language));
        }
        [SessionExpire]
        public ActionResult QFLFeedback()
        {
            
            ViewBag.Vinnumber = TempData["Vinnumber"];

            return View();
        }

        
        public JsonResult PageLoadData()
        {
            UserDetails Users = new UserDetails();
            try
            {
                //ErrorLog.Log("PageLoad");
                //ErrorLog.Log("UserDetails :" + Convert.ToString(Session["UserDetails"]));
                Users = (UserDetails)Session["UserDetails"];

                //ErrorLog.Log("Email = " + Users.Email);
                //ErrorLog.Log("PlantId = " + Users.PlantId);
                //ErrorLog.Log("RoleId = " + Users.RoleId);
                //ErrorLog.Log("Token = " + Users.Token);


                if (Users == null)
                    Users = new UserDetails();
                Users.Api = Convert.ToString(ConfigurationManager.AppSettings["Api"]);
                Users.SignatureSitePath = Convert.ToString(ConfigurationManager.AppSettings["SignatureSitePath"]);
                Users.PaintingImagePath = Convert.ToString(ConfigurationManager.AppSettings["PaintingImagePath"]);


                //ErrorLog.Log("JsonResult :" + Json(Users, JsonRequestBehavior.AllowGet));
            }
            catch (Exception ex)
            {
                ErrorLog.Log("Page Load Data " + ex.Message);
            }
            return Json(Users, JsonRequestBehavior.AllowGet);
        }

        [SessionExpire]
        public JsonResult LanguageChanger(string input)
        {
            UserDetails Users = new UserDetails();
            try
            {
                Users = (UserDetails)Session["UserDetails"];
                if (Users == null)
                    Users = new UserDetails();

                Users.Language = input;

                ErrorLog.Log("LanguageChanger Function- Current Language Status: " + input);
            }
            catch (Exception ex)
            {
                ErrorLog.Log("LanguageChanger Function- Current Language Status: " + input);
                ErrorLog.Log("Language Changer" + ex.Message);
            }
            return Json(Users, JsonRequestBehavior.AllowGet);
        }


        [SessionExpire]
        public JsonResult MaintainPlantId(int PlantId)
        {
            UserDetails Users = new UserDetails();
            try
            {
                //  ErrorLog.Log("PageLoad");
                //  ErrorLog.Log("UserDetails :" + Convert.ToString(Session["UserDetails"]));
                Users = (UserDetails)Session["UserDetails"];
                if (Users == null)
                    Users = new UserDetails();
                Users.Api = Convert.ToString(ConfigurationManager.AppSettings["Api"]);
                Users.PlantId = PlantId;
                Session["UserDetails"] = Users;
                //  ErrorLog.Log("JsonResult :" + Json(Users, JsonRequestBehavior.AllowGet));
            }
            catch (Exception ex)
            {
                ErrorLog.Log("MaintainPlantId" + ex.Message);
            }
            return Json(Users, JsonRequestBehavior.AllowGet);
        }
        [SessionExpire]
        public JsonResult SignatureSave(string imagedata, string Vinnumber, int VinId, int Gateid)
        {
            WebServices Service = new WebServices();
            UserDetails Signature = new UserDetails();
            string path = ConfigurationManager.AppSettings["SignaturePath"].ToString();
            string Filename = DateTime.Now.ToString().Replace("/", "_").Replace(" ", "_").Replace(":", "") + ".png";
            Filename = "Signature_" + Vinnumber + '_' + VinId + "_" + Gateid + "_" + Filename.Replace("-", "_");
            string fileNameWithPath = path + Filename;
            try
            {
                using (FileStream fs = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {

                        byte[] data = Convert.FromBase64String(imagedata);

                        bw.Write(data);

                        bw.Close();
                    }

                }
                //string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["TokenUser"]), Convert.ToString(ConfigurationManager.AppSettings["TokenPass"]));
                //Signature = Service.AddSignature(fileNameWitPath, token);

            }
            catch (Exception ex)
            {
                ErrorLog.Log("SignatureSave " + ex.Message);
            }
            return Json(Filename, JsonRequestBehavior.AllowGet);

        }
        [SessionExpire]
        public JsonResult SignatureSiteSave(string imagedata,string Vinnumber, int VinId, int Gateid, string ModelName)
        {
            WebServices Service = new WebServices();
            UserDetails Signature = new UserDetails();
            string path = ConfigurationManager.AppSettings["SignaturePath"].ToString();
            string Filename = DateTime.Now.ToString().Replace("/", "_").Replace(" ", "_").Replace(":", "") + ".png";
            Filename = "Signature_" + Vinnumber + '_' + VinId + "_" + Gateid + "_" + Filename.Replace("-", "_");
            string fileNameWithPath = path +@""+ Vinnumber + @"\" + ModelName + @"\" + Filename;
            string postedFile = path +@""+ Vinnumber + @"\" + ModelName;
            if (!System.IO.Directory.Exists(postedFile))
            {
                System.IO.Directory.CreateDirectory(postedFile);

            }
            try
            {
                using (FileStream fs = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {

                        byte[] data = Convert.FromBase64String(imagedata);

                        bw.Write(data);

                        bw.Close();
                    }

                }
                //string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["TokenUser"]), Convert.ToString(ConfigurationManager.AppSettings["TokenPass"]));
                //Signature = Service.AddSignature(fileNameWitPath, token);

            }
            catch (Exception ex)
            {
                ErrorLog.Log("SignatureSiteSave " + ex.Message);
            }
            return Json(Filename, JsonRequestBehavior.AllowGet);

        }
        [SessionExpire]
        public ActionResult Signature()
        {
            return View();
        }
        [SessionExpire]

        public JsonResult DownLoadSignature(string SignatureFilename)
        {

            return Json(SignatureFilename, JsonRequestBehavior.AllowGet);
        }
        [SessionExpire]
        public FileResult DownLoadSignatureFile(string SignatureFilename)
        {
            WebServices _web = new WebServices();
            //string checklistfilenames = Session["checklistfilename"].ToString();
            string filepath = Convert.ToString(ConfigurationManager.AppSettings["SignaturePath"]) + SignatureFilename;
            byte[] pdfByte = GetBytesFromFile(filepath);
            //return File(pdfByte, "application/xlsx", checklistfilename);

            Response.Clear();

            string attachment = String.Format("attachment; filename={0}", Server.UrlPathEncode(SignatureFilename));
            Response.AddHeader("Content-Disposition", attachment);

            Response.ContentType = ".png";
            Response.Charset = "utf-8";
            Response.HeaderEncoding = UnicodeEncoding.UTF8;
            Response.ContentEncoding = UnicodeEncoding.UTF8;
            Response.BinaryWrite(pdfByte);
            Response.End();
            return null;
        }
        public byte[] GetBytesFromFile(string fullFilePath)
        {
            // this method is limited to 2^32 byte files (4.2 GB)
            FileStream fs = null;
            try
            {

                fs = System.IO.File.OpenRead(fullFilePath);
                byte[] bytes = new byte[fs.Length];
                fs.Read(bytes, 0, Convert.ToInt32(fs.Length));
                return bytes;
            }
            //catch(FileNotFoundException ex)
            //{

            //}
            finally
            {
                if (fs != null)
                {
                    fs.Close();
                    fs.Dispose();
                }
            }


        }

        [SessionExpire]
        //public JsonResult CheckSignature(string Filename,string lan)
        //{
        //    string plainText = "";
        //    UserDetails Users = new UserDetails();
        //    Users = (UserDetails)Session["UserDetails"];
        //    string path = ConfigurationManager.AppSettings["SignaturePath"].ToString();
        //    try
        //    {


        //        using (var api = OcrApi.Create())
        //        {
        //            if (lan == "jp")
        //            {
        //                api.Init(Languages.Japanese);
        //            }
        //            else
        //            {
        //                api.Init(Languages.English);
        //            }

        //            plainText = api.GetTextFromImage(path + Filename);

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorLog.Log("CheckSignature " + ex.Message);
        //    }
        //    return Json(plainText, JsonRequestBehavior.AllowGet);

        //}




        #region ChangePassword

        public ActionResult ChangePassword(string Email, string Language)
        {
            UserDetails user = new UserDetails();
            user = (UserDetails)Session["UserDetails"];
            ViewBag.Api = Convert.ToString(ConfigurationManager.AppSettings["Api"]);
            ViewBag.EmailId = Convert.ToString(user.Email);
            ViewBag.language = Convert.ToString(user.Language);
            return View();
        }

        #endregion
     
        [SessionExpire]
        public FileResult RedirectStandardMasterFile(string StandardMasterfilename, string filename)
        {
            WebServices _web = new WebServices();
            string filepath = _web.GetUploadPath() + "StandMaster\\" + StandardMasterfilename + "\\" + filename;
            byte[] pdfByte = GetBytesFromFile(filepath);
            string ReportURL = filepath;
            byte[] FileBytes = System.IO.File.ReadAllBytes(ReportURL);
            return File(FileBytes, "application/pdf");
        }
        [SessionExpire]
        public FileResult DwdStandardMasterFile(string StandardMasterfilename, string filename)
        {
            WebServices _web = new WebServices();
            string filepath = _web.GetUploadPath() + "StandMaster\\" + StandardMasterfilename + "\\" + filename;
            byte[] pdfByte = GetBytesFromFile(filepath);
            return File(pdfByte, "application/pdf", filename);
        }
        [SessionExpire]
        public FileResult DownLoadCommentsFile(string StandardMasterfilename, string filename)
        {
            WebServices _web = new WebServices();
            string filepath = _web.GetUploadPath() + "ActualComment\\" + StandardMasterfilename + "\\" + filename;
            byte[] pdfByte = GetBytesFromFile(filepath);
            return File(pdfByte, "application/pdf", filename);

        }



        [SessionExpire]
        [HttpPost]
        public ActionResult Actualcomment(FormCollection formCollection, string actualvalue, string responsible)
        {
            WebServices _web = new WebServices();
            try
            {

                HttpFileCollectionBase file = Request.Files;
                int r = file.Count;
                int i = 0;
                List<Actualcomment> defectdetail = new List<Actualcomment>();
                string checkitems = string.Empty;
                StringBuilder sb = new StringBuilder();
                //var fileName = Convert.ToString(formCollection["filename"]);

                //string guid = Convert.ToString(formCollection["fileguid"]);
                string FolderName = Convert.ToString(formCollection["fileguid"]);
                var checklistitemid = Convert.ToString(formCollection["checklistitemid"]);



                string postedFile = _web.GetUploadPath() + "ActualComment\\" + FolderName;
                if (!System.IO.Directory.Exists(postedFile))
                {
                    System.IO.Directory.CreateDirectory(postedFile);

                }

                if (System.IO.Directory.Exists(postedFile))
                {
                    for (i = 0; i < r; i++)
                    {
                        if (file != null && file[i].ContentLength > 0)
                        {


                            long b = file[i].ContentLength;
                            long kb = b / 1024;
                            long mb = kb / 1024;
                            string ActualFileSize = kb.ToString();// "KB";
                            // Storing file into the upload path
                            string fileName = Path.GetFileName(file[i].FileName);
                            string ActualFileName = fileName;
                            // fileName = fileName.Substring(0, fileName.Length - 5) + "-" + fileName.Substring(fileName.Length - 5, 5);
                            string existfilename = System.IO.Path.Combine(postedFile, fileName);
                            //int fileid = 0;
                            sb.Append("<rows>");
                            sb.Append("<row>");
                            sb.Append("<ActualFileName>" + ActualFileName.ToString().Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("'", "&apos;") + "</ActualFileName>");
                            sb.Append("<ActualFileSize>" + ActualFileSize.ToString().Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("'", "&apos;") + "</ActualFileSize>");
                            sb.Append("</row>");
                            sb.Append("</rows>");



                            byte[] bytes = null;
                            using (var File = new FileStream(existfilename, FileMode.Create))
                            {
                                var binaryReader = new BinaryReader(file[i].InputStream);
                                bytes = binaryReader.ReadBytes(Request.Files[0].ContentLength);
                                File.Write(bytes, 0, bytes.Length);
                                File.Flush();

                            }


                        }
                    }
                }

                var DeleteMode = Convert.ToString(formCollection["mode"]);
                //var DeleteMode = Convert.ToInt32(formCollection["fileid"]);
                var Deletefilename = Convert.ToString(formCollection["deletefilename"]);

                if (DeleteMode == "D" && System.IO.Directory.Exists(postedFile))
                {
                    string existfilename = System.IO.Path.Combine(postedFile, Deletefilename);
                    if (System.IO.File.Exists(existfilename))
                        System.IO.File.Delete(existfilename);
                }



                Actualcomment Actualcommentdetail = new Actualcomment()
                {
                    token = Convert.ToString(formCollection["token"]),

                    guid = Convert.ToString(formCollection["fileguid"]),
                    actualid = Convert.ToInt32(formCollection["actualid"]),
                    checklistitemid = Convert.ToInt32(formCollection["checklistitemid"]),
                    actualvalue = Convert.ToString(formCollection["actualvalue"]),
                    responsible = Convert.ToString(formCollection["responsible"]),
                    damagecode = Convert.ToString(formCollection["damagecode"]),
                    comments = Convert.ToString(formCollection["comments"]),
                    userid = Convert.ToInt32(formCollection["userid"]),
                    mode = Convert.ToString(formCollection["mode"]),
                    filedetail = sb.ToString(),
                    fileid = Convert.ToInt32(formCollection["fileid"]),
                    vinid = Convert.ToInt32(formCollection["VinIds"]),
                    staticchecklistitemid = Convert.ToString(formCollection["StaticCheckListItemId"]),

                };
                string result = string.Empty;

                result = _web.InsertUpdatActualComment(Actualcommentdetail);
                result = result.Replace("\"", "");
                //FileStream file1 = new FileStream(SubFolder, FileMode.Create);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)

            {
                ErrorLog.Log("Upload file: " + ex.Message);
                return Json("error", JsonRequestBehavior.AllowGet);

            }

        }


        [SessionExpire]
        [HttpPost]
        public ActionResult NotOkUploadImage(FormCollection formCollection)
        {
            string fileName;
            string Filename;
            string FullPath = ConfigurationManager.AppSettings["SignatureSitePath"].ToString();
            WebServices _web = new WebServices();
            try
            {

                HttpFileCollectionBase file = Request.Files;
                // fileName = Convert.ToString(formCollection["filename"]);
                string path = ConfigurationManager.AppSettings["SignaturePath"].ToString();
                string Vinnumber = Convert.ToString(formCollection["Vinnumber"]);
                string ModelName = Convert.ToString(formCollection["ModelName"]);
                int VinId = Convert.ToInt32(formCollection["VinId"]);
                int Gateid = Convert.ToInt32(formCollection["GateId"]);

                string vaild = Convert.ToString(formCollection["filedata"]);
                Filename = DateTime.Now.ToString().Replace("/", "_").Replace(" ", "_").Replace(":", "") + ".png";
                Filename = "UploadNotOkImg_" + Vinnumber + '_' + ModelName + '_' + VinId + "_" + Gateid + "_" + Filename.Replace("-", "_");

                string fileNameWithPath = path + @"" + Vinnumber +  @"\" + Filename;
                path = path + @"" + Vinnumber ;

                FullPath = fileNameWithPath;


                if (!System.IO.Directory.Exists(path))
                {
                    System.IO.Directory.CreateDirectory(path);

                }

                using (FileStream fs = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        byte[] data = Convert.FromBase64String(Convert.ToString(formCollection["filedata"]).Split(',')[1]);

                        bw.Write(data);

                        bw.Close();
                    }

                }

            }
            catch (Exception ex)
            {
                ErrorLog.Log("NotOkUploadImage: " + ex.Message);
                return Json("error", JsonRequestBehavior.AllowGet);

            }

            return Json(Filename, JsonRequestBehavior.AllowGet);
        }


        [SessionExpire]
        public ActionResult ProgressMonitorNew()
        {
            return View();
        }


        //public void DownloadExcelProgressNew(int PlantId, string VinFrom, string VinTo, string FromDate, string ToDate)
        //{
        //    ErrorLog.Log("Test1 " + DateTime.Today);
        //    UserDetails Users = new UserDetails();

        //    ErrorLog.Log("Test2 ");
        //    //DataSet ds = new DataSet();
        //    //WebServices _web = new WebServices();
        //    //IWorkbook workbook;
        //    //workbook = new XSSFWorkbook();

        //    //if (ToDate == "" || ToDate == null)
        //    //{
        //    //    ToDate = FromDate;
        //    //}
        //    //if (VinTo == "" || VinTo == null)
        //    //{
        //    //    VinTo = VinFrom;
        //    //}



        //    //ds = _web.Get_Excel_ExportNew(PlantId, VinFrom, VinTo, FromDate, ToDate, Users.Token);
        //    //ErrorLog.Log("ds " + ds);
        //}


       
        [SessionExpire]
        [Obsolete]
        public void DownloadExcelProgressNew(int PlantId, string VinFrom, string VinTo, string FromDate, string ToDate)
        {
            
            UserDetails Users = new UserDetails();
            Users = (UserDetails)Session["UserDetails"];
            DataSet ds = new DataSet();

            try
            {
                WebServices _web = new WebServices();

                IWorkbook workbook= new XSSFWorkbook();
                
                if (ToDate == "" || ToDate == null)
                {
                    ToDate = FromDate;
                }
                if (VinTo == "" || VinTo == null)
                {
                    VinTo = VinFrom;
                }


                ds = _web.Get_Excel_ExportNew(PlantId, VinFrom, VinTo, FromDate, ToDate, Users.Token);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    //Create the worksheet
                    // ExcelWorksheet ws;
                    //IWorkbook workbook;
                    //workbook = new XSSFWorkbook();


                    //ds.Tables[0].Columns["VinNumber"].ColumnName = "VinNumber";
                    //ds.Tables[0].Columns["VehicleType"].ColumnName = "VehicleType";
                    //ds.Tables[0].Columns["ModelName"].ColumnName = "ModelName";
                    //ds.Tables[0].Columns["Inspection"].ColumnName = "Inspection";
                    //ds.Tables[0].Columns["Status"].ColumnName = "Status";


                    DataTable dtLine = new DataTable();



                    var BindUniqueLine = (from DataRow dRow in ds.Tables[1].Rows
                                          select dRow["LineName"]).Distinct();


                    DataTable DtBind = new DataTable();
                    DataTable DtBind1 = new DataTable();
                    foreach (var name in BindUniqueLine)
                    {

                        var filtergate = from Line in ds.Tables[1].AsEnumerable()
                                         where Line.Field<string>("LineName") == name.ToString()
                                         select new
                                         {
                                             LineName = Line.Field<Int64>("Sno")

                                         };

                        string LineName = Convert.ToString(name);
                        string expression = "LineId= '" + filtergate.ElementAt(0).LineName.ToString() + "'";


                        DataView dataView = ds.Tables[0].DefaultView;
                        //DataView dataView1 = ds.Tables[2].DefaultView;
                        if (!string.IsNullOrEmpty(LineName))
                        {
                            dataView.RowFilter = expression;
                            DtBind = dataView.ToTable();

                            //dataView1.RowFilter = expression;
                            //DtBind1 = dataView1.ToTable();
                            //DtBind.Columns["VariantId "].ColumnName = "VariantId";
                        }


                        var DynmaicColumnList = from DyColumns in ds.Tables[3].AsEnumerable()

                                                select new
                                                {
                                                    DynamicColumnName = DyColumns.Field<string>("DynamicColumnName"),
                                                    NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),


                                                };




                        DataTable dt = new DataTable();
                        dt.Columns.Add("VIN");
                        dt.Columns.Add("VehicleType");
                        dt.Columns.Add("Model");
                        dt.Columns.Add("Part Name");
                        dt.Columns.Add("Defect");
                        dt.Columns.Add("Status");
                        if (DynmaicColumnList.Count() > 0)
                        {
                            for (int i = 0; i < DynmaicColumnList.Count(); i++)
                            {
                                if (Convert.ToString(DynmaicColumnList.ElementAt(i).DynamicColumnName) != "")
                                {
                                    dt.Columns.Add(DynmaicColumnList.ElementAt(i).DynamicColumnName);
                                }

                            }
                        }






                        ISheet sheet1 = workbook.CreateSheet(Convert.ToString(LineName));
                        int k = 0;
                        int RowFrom = 1;
                        int Filtercount = 0;





                        //byte[] data = System.IO.File.ReadAllBytes("D:\\Auto QFL Phase II\\MFBMAutomatedQFL\\MFBMAutomatedQFL\\Signature\\Signature_05_05_2020_153946.png");
                        //int pictureIndex = workbook.AddPicture(data, PictureType.PNG);
                        //ICreationHelper helper = workbook.GetCreationHelper();
                        //IDrawing drawing = sheet1.CreateDrawingPatriarch();
                        //IClientAnchor anchor = helper.CreateClientAnchor();
                        //anchor.Col1 = 4;//0 index based column
                        //anchor.Row1 = 0;//0 index based row
                        //IPicture picture = drawing.CreatePicture(anchor, pictureIndex);
                        //picture.Resize();


                        for (int i = 0; i < DtBind.Rows.Count; i++)
                        {


                            int counts = 1;

                            var filtergates = from Line in ds.Tables[2].AsEnumerable()
                                              where Line.Field<string>("VinNumber") == Convert.ToString(DtBind.Rows[i][0].ToString())
                                              select new
                                              {
                                                  Defect = Line.Field<string>("Defect"),
                                                  Vin = Line.Field<string>("VinNumber"),
                                                  VehicleType = Line.Field<string>("VehicleType"),
                                                  Model = Line.Field<string>("ModelName"),
                                                  CheckListItemStatusId = Line.Field<Int64>("CheckListItemStatusId"),
                                                  StatusCount = Line.Field<Int64>("StatusCount"),
                                                  ReExaminationCount = Line.Field<Int64>("ReExaminationCount"),
                                                  InspectionItem = Line.Field<string>("inspectionitem"),
                                                  Site1Image = Line.Field<string>("Site1Image"),
                                                  QFLFeedbackWorkflowId = Line.Field<Int64>("QFLFeedbackWorkflowId"),
                                                  VinId = Line.Field<Int64>("VinId"),

                                              };
                            for (int j = 0; j < filtergates.Count(); j++)
                            {
                                Filtercount = filtergates.Count();
                                DataRow dr = dt.NewRow();
                                dt.Rows.Add(dr);


                                if (filtergates.ElementAt(j).Site1Image != "")
                                {

                                    int imgWidth = 50; // only initial if not known
                                    int imgHeight = 50;
                                    int LOGO_MARGIN = 2;
                                    byte[] data = null;
                                    WebServices _webs = new WebServices();
                                    string filepath = ConfigurationManager.AppSettings["SignaturePath"] + filtergates.ElementAt(j).Vin + @"\" + filtergates.ElementAt(j).Site1Image;
                                    ICreationHelper helper = workbook.GetCreationHelper();
                                    IDrawing drawing = sheet1.CreateDrawingPatriarch();
                                    IClientAnchor anchor = helper.CreateClientAnchor();

                                    data = GetBytesFromFile(filepath);
                                    int pictureIndex = workbook.AddPicture(data, PictureType.PNG);

                                    anchor.Col1 = 4;
                                    anchor.Row1 = j + 1;

                                    IPicture picture = drawing.CreatePicture(anchor, pictureIndex);
                                    picture.Resize(1);
                                    //picture.Resize(0.5 * imgWidth / XSSFShape.PIXEL_DPI, 5 * imgHeight / XSSFShape.PIXEL_DPI);




                                }


                                //if (counts == 1)
                                //{

                                    RowFrom = k + 1;


                                    //dt.Rows[k]["VIN"] = Convert.ToString(DtBind1.Rows[k][2].ToString());
                                    //dt.Rows[k]["VehicleType"] = Convert.ToString(DtBind1.Rows[k][4].ToString());
                                    //dt.Rows[k]["Model"] = Convert.ToString(DtBind1.Rows[k][3].ToString());
                                    //dt.Rows[k]["Defect"] = Convert.ToString(DtBind1.Rows[k][0].ToString());

                                    dt.Rows[k]["VIN"] = Convert.ToString(filtergates.ElementAt(j).Vin);
                                    dt.Rows[k]["VehicleType"] = Convert.ToString(filtergates.ElementAt(j).VehicleType);
                                    dt.Rows[k]["Model"] = Convert.ToString(filtergates.ElementAt(j).Model);
                                    dt.Rows[k]["Part Name"] = Convert.ToString(filtergates.ElementAt(j).InspectionItem);

                                    dt.Rows[k]["Defect"] = Convert.ToString(filtergates.ElementAt(j).Defect);


                                    if (filtergates.ElementAt(j).CheckListItemStatusId == 3 || filtergates.ElementAt(j).CheckListItemStatusId == 6)
                                    {
                                        dt.Rows[k]["Status"] = Convert.ToString("Rework");
                                    }
                                    else
                                    {
                                        dt.Rows[k]["Status"] = Convert.ToString("Re-Examination");
                                    }


                                    //var DynamicDetails ="";

                                    //var DynamicValueDetails = from DyColumns in ds.Tables[4].AsEnumerable()
                                    //                          where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
                                    //                          &&
                                    //                          DyColumns.Field<Int64>("VinId") == Convert.ToInt64(filtergates.ElementAt(j).VinId)
                                    //                          select new
                                    //                          {
                                    //                              DynamicColumnDetails = DyColumns.Field<string>("DynamicColumnDetails"),
                                    //                              NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),
                                    //                              QFLFeedBackworkflowId = DyColumns.Field<Int64>("QFLFeedBackworkflowId"),
                                    //                              VinId = DyColumns.Field<Int64>("VinId"),

                                    //                          };

                                    var DynamicList = (from DyColumns in ds.Tables[6].AsEnumerable()
                                                       where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
                                                       select DyColumns).ToList();



                                    DataTable dataTable = DynamicList.CopyToDataTable();
                                    if (DynmaicColumnList.Count() >= 1)
                                    {
                                        //dt.Rows[k][6] = Convert.ToString(ds.Tables[7].Rows[k][1]);
                                        dt.Rows[k][6] = Convert.ToString(dataTable.Rows[0][1]);



                                    }
                                    if (DynmaicColumnList.Count() >= 2)
                                    {
                                        //dt.Rows[k][7] = Convert.ToString(ds.Tables[7].Rows[k][2]);
                                        dt.Rows[k][7] = Convert.ToString(dataTable.Rows[0][2]);
                                    }
                                    if (DynmaicColumnList.Count() >= 3)
                                    {
                                        dt.Rows[k][8] = Convert.ToString(dataTable.Rows[0][3]);
                                    }
                                    if (DynmaicColumnList.Count() >= 4)
                                    {
                                        dt.Rows[k][9] = Convert.ToString(dataTable.Rows[0][4]);
                                    }
                                    if (DynmaicColumnList.Count() >= 5)
                                    {
                                        dt.Rows[k][10] = Convert.ToString(dataTable.Rows[0][5]);
                                    }
                                    if (DynmaicColumnList.Count() >= 6)
                                    {
                                        dt.Rows[k][11] = Convert.ToString(dataTable.Rows[0][6]);
                                    }
                                    if (DynmaicColumnList.Count() >= 7)
                                    {
                                        dt.Rows[k][12] = Convert.ToString(dataTable.Rows[0][7]);
                                    }
                                    if (DynmaicColumnList.Count() >= 8)
                                    {
                                        dt.Rows[k][13] = Convert.ToString(dataTable.Rows[0][8]);
                                    }
                                    if (DynmaicColumnList.Count() >= 9)
                                    {
                                        dt.Rows[k][14] = Convert.ToString(dataTable.Rows[0][9]);
                                    }
                                    if (DynmaicColumnList.Count() >= 10)
                                    {
                                        dt.Rows[k][15] = Convert.ToString(dataTable.Rows[0][10]);
                                    }
                                    if (DynmaicColumnList.Count() >= 11)
                                    {
                                        dt.Rows[k][16] = Convert.ToString(dataTable.Rows[0][11]);
                                    }
                                    if (DynmaicColumnList.Count() >= 12)
                                    {
                                        dt.Rows[k][17] = Convert.ToString(dataTable.Rows[0][12]);
                                    }
                                    if (DynmaicColumnList.Count() >= 13)
                                    {
                                        dt.Rows[k][18] = Convert.ToString(dataTable.Rows[0][13]);
                                    }
                                    if (DynmaicColumnList.Count() >= 14)
                                    {
                                        dt.Rows[k][19] = Convert.ToString(dataTable.Rows[0][14]);
                                    }
                                    if (DynmaicColumnList.Count() >= 15)
                                    {
                                        dt.Rows[k][20] = Convert.ToString(dataTable.Rows[0][15]);
                                    }
                                    if (DynmaicColumnList.Count() >= 16)
                                    {
                                        for (int a = 16; a < DynmaicColumnList.Count(); a++)

                                            dt.Rows[k][a + 5] = Convert.ToString(dataTable.Rows[0][a]);
                                    }


                                    //int m = 0;
                                    //while (m < DynmaicColumnList.Count())
                                    //{





                                    //    var DynamicDetails = (from item in DynamicValueDetails
                                    //                          where item.NewProgressColumnId == Convert.ToInt64(DynmaicColumnList.ElementAt(m).NewProgressColumnId)
                                    //                          select item).ToList();

                                    //    if (DynamicDetails.Count > 0)
                                    //    {

                                    //        dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString(DynamicDetails.ElementAt(0).DynamicColumnDetails);
                                    //    }
                                    //    else
                                    //    {
                                    //        if (DynmaicColumnList.ElementAt(m).DynamicColumnName != "")
                                    //        {
                                    //            dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString("");
                                    //        }

                                    //    }
                                    //    m++;
                                    //}

                                //}
                                //else
                                //{
                                //    dt.Rows[k]["Part Name"] = Convert.ToString(filtergates.ElementAt(j).InspectionItem);

                                //    dt.Rows[k]["Defect"] = Convert.ToString(filtergates.ElementAt(j).Defect);


                                //    if (filtergates.ElementAt(j).CheckListItemStatusId == 3 || filtergates.ElementAt(j).CheckListItemStatusId == 6)
                                //    {
                                //        dt.Rows[k]["Status"] = Convert.ToString("Rework");
                                //    }
                                //    else
                                //    {
                                //        dt.Rows[k]["Status"] = Convert.ToString("Re-Examination");
                                //    }


                                //    //var DynamicValueDetails = from DyColumns in ds.Tables[4].AsEnumerable()
                                //    //                          where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
                                //    //                          &&
                                //    //                          DyColumns.Field<Int64>("VinId") == Convert.ToInt64(filtergates.ElementAt(j).VinId)
                                //    //                          select new
                                //    //                          {
                                //    //                              DynamicColumnDetails = DyColumns.Field<string>("DynamicColumnDetails"),
                                //    //                              NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),
                                //    //                              QFLFeedBackworkflowId = DyColumns.Field<Int64>("QFLFeedBackworkflowId"),
                                //    //                              VinId = DyColumns.Field<Int64>("VinId"),

                                //    //                          };

                                //    var DynamicList = (from DyColumns in ds.Tables[6].AsEnumerable()
                                //                       where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
                                //                       select DyColumns).ToList();

                                //    DataTable dataTable = DynamicList.CopyToDataTable();

                                //    if (DynmaicColumnList.Count() >= 1)
                                //    {
                                //        dt.Rows[k][6] = Convert.ToString(dataTable.Rows[0][1]);

                                //    }
                                //    if (DynmaicColumnList.Count() >= 2)
                                //    {
                                //        dt.Rows[k][7] = Convert.ToString(dataTable.Rows[0][2]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 3)
                                //    {
                                //        dt.Rows[k][8] = Convert.ToString(dataTable.Rows[0][3]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 4)
                                //    {
                                //        dt.Rows[k][9] = Convert.ToString(dataTable.Rows[0][4]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 5)
                                //    {
                                //        dt.Rows[k][10] = Convert.ToString(dataTable.Rows[0][5]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 6)
                                //    {
                                //        dt.Rows[k][11] = Convert.ToString(dataTable.Rows[0][6]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 7)
                                //    {
                                //        dt.Rows[k][12] = Convert.ToString(dataTable.Rows[0][7]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 8)
                                //    {
                                //        dt.Rows[k][13] = Convert.ToString(dataTable.Rows[0][8]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 9)
                                //    {
                                //        dt.Rows[k][14] = Convert.ToString(dataTable.Rows[0][9]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 10)
                                //    {
                                //        dt.Rows[k][15] = Convert.ToString(dataTable.Rows[0][10]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 11)
                                //    {
                                //        dt.Rows[k][16] = Convert.ToString(dataTable.Rows[0][11]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 12)
                                //    {
                                //        dt.Rows[k][17] = Convert.ToString(dataTable.Rows[0][12]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 13)
                                //    {
                                //        dt.Rows[k][18] = Convert.ToString(dataTable.Rows[0][13]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 14)
                                //    {
                                //        dt.Rows[k][19] = Convert.ToString(dataTable.Rows[0][14]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 15)
                                //    {
                                //        dt.Rows[k][20] = Convert.ToString(dataTable.Rows[0][15]);
                                //    }
                                //    if (DynmaicColumnList.Count() >= 16)
                                //    {
                                //        for (int a = 16; a < DynmaicColumnList.Count(); a++)

                                //            dt.Rows[k][a + 5] = Convert.ToString(dataTable.Rows[0][a]);
                                //    }

                                //    //int m = 0;
                                //    //while (m < DynmaicColumnList.Count())
                                //    //{


                                //    //    var DynamicDetails = (from item in DynamicValueDetails
                                //    //                          where item.NewProgressColumnId == Convert.ToInt64(DynmaicColumnList.ElementAt(m).NewProgressColumnId)
                                //    //                          select item).ToList();

                                //    //    if (DynamicDetails.Count > 0)
                                //    //    {

                                //    //        dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString(DynamicDetails.ElementAt(0).DynamicColumnDetails);
                                //    //    }
                                //    //    else
                                //    //    {


                                //    //        if (DynmaicColumnList.ElementAt(m).DynamicColumnName != "")
                                //    //        {
                                //    //            dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString("");
                                //    //        }

                                //    //    }
                                //    //    m++;
                                //    //}


                                //    if (Filtercount == j + 1)
                                //    {
                                //        //new NPOI.SS.Util.CellRangeAddress(RowFrom,RowTo, FromColumn, ToColumn);
                                //        NPOI.SS.Util.CellRangeAddress cra = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 0, 0);
                                //        NPOI.SS.Util.CellRangeAddress cra1 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 1, 1);
                                //        NPOI.SS.Util.CellRangeAddress cra2 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 2, 2);
                                //        //NPOI.SS.Util.CellRangeAddress cra3 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 4, 4);
                                //        sheet1.AddMergedRegion(cra);
                                //        sheet1.AddMergedRegion(cra1);
                                //        sheet1.AddMergedRegion(cra2);
                                //        //sheet1.AddMergedRegion(cra3);

                                //    }



                                //}




                                counts++;
                                k++;


                            }
                        }

                        //header bold

                        var font = workbook.CreateFont();
                        font.FontHeightInPoints = (short)12;
                        font.FontName = "Calibri";

                        font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Normal;

                        NPOI.HSSF.UserModel.HSSFWorkbook wob = new NPOI.HSSF.UserModel.HSSFWorkbook();//alfred test
                        NPOI.HSSF.UserModel.HSSFPalette pa = wob.GetCustomPalette();
                        NPOI.HSSF.Util.HSSFColor XlColour = pa.FindSimilarColor(192, 192, 192);

                        //make a header row  
                        IRow row1 = sheet1.CreateRow(0);

                        XSSFCellStyle yourStyle = (XSSFCellStyle)workbook.CreateCellStyle();
                        yourStyle.WrapText = true;
                        yourStyle.Alignment = HorizontalAlignment.Center;
                        yourStyle.VerticalAlignment = VerticalAlignment.Center;
                        yourStyle.BorderBottom = BorderStyle.Medium;
                        yourStyle.BorderRight = BorderStyle.Medium;
                        yourStyle.BorderTop = BorderStyle.Medium;
                        yourStyle.BorderLeft = BorderStyle.Medium;



                        for (int j = 0; j < dt.Columns.Count; j++)
                        {
                            //sheet1.SetColumnWidth(j, 5000);
                            sheet1.SetColumnWidth(j, 9000);
                            ICell cell = row1.CreateCell(j);
                            cell.CellStyle = workbook.CreateCellStyle();
                            cell.CellStyle = yourStyle;
                            cell.CellStyle.SetFont(font);
                            cell.CellStyle.FillForegroundColor = XlColour.Indexed;
                            cell.CellStyle.FillPattern = FillPattern.NoFill;

                            String columnName = dt.Columns[j].ToString();
                            cell.SetCellValue(columnName);
                        }

                        //loops through data  
                        for (int m = 0; m < dt.Rows.Count; m++)
                        {
                            IRow row = sheet1.CreateRow(m + 1);
                            for (int j = 0; j < dt.Columns.Count; j++)
                            {
                                ICell cell = row.CreateCell(j);
                                cell.CellStyle = yourStyle;
                                String columnName = dt.Columns[j].ToString();
                                cell.SetCellValue(dt.Rows[m][columnName].ToString());

                            }
                        }

                    }

                    using (var exportData = new MemoryStream())
                    {
                        Response.Clear();
                        workbook.Write(exportData);

                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", "Progress_Monitor" + "_" + DateTime.Now.ToString("dd-MM-yyyy_HH-mm-ss") + ".xlsx"));
                        Response.BinaryWrite(exportData.ToArray());
                        Response.End();
                    }
                }
            }


            catch (Exception ex)
            {
                ErrorLog.Log("ProgressmonitorNew Excel" + ex.Message);
            }

        }


        //public void DownloadExcelProgressNew(int PlantId, string VinFrom, string VinTo, string FromDate, string ToDate)
        //{
        //    ErrorLog.Log("Test1 " + DateTime.Today);
        //    UserDetails Users = new UserDetails();
        //    Users = (UserDetails)Session["UserDetails"];

        //    DataSet ds = new DataSet();

        //    try
        //    {
        //        WebServices _web = new WebServices();
        //        IWorkbook workbook;
        //        workbook = new XSSFWorkbook();
        //        string ToVin = "";
        //        string Todate = "";
        //        if (ToDate == "" || ToDate == null)
        //        {
        //            ToDate = FromDate;
        //        }
        //        if (VinTo == "" || VinTo == null)
        //        {
        //            VinTo = VinFrom;
        //        }



        //        ds = _web.Get_Excel_ExportNew(PlantId, VinFrom, VinTo, FromDate, ToDate, Users.Token);

        //        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //        {
        //            //Create the worksheet
        //            // ExcelWorksheet ws;
        //            //IWorkbook workbook;
        //            //workbook = new XSSFWorkbook();


        //            ds.Tables[0].Columns["VinNumber"].ColumnName = "VinNumber";
        //            ds.Tables[0].Columns["VehicleType"].ColumnName = "VehicleType";
        //            ds.Tables[0].Columns["ModelName"].ColumnName = "ModelName";
        //            ds.Tables[0].Columns["Inspection"].ColumnName = "Inspection";
        //            ds.Tables[0].Columns["Status"].ColumnName = "Status";


        //            DataTable dtLine = new DataTable();



        //            var BindUniqueLine = (from DataRow dRow in ds.Tables[1].Rows
        //                                  select dRow["LineName"]).Distinct();


        //            DataTable DtBind = new DataTable();
        //            DataTable DtBind1 = new DataTable();
        //            foreach (var name in BindUniqueLine)
        //            {

        //                var filtergate = from Line in ds.Tables[1].AsEnumerable()
        //                                 where Line.Field<string>("LineName") == name.ToString()
        //                                 select new
        //                                 {
        //                                     LineName = Line.Field<Int64>("Sno")

        //                                 };

        //                string LineName = Convert.ToString(name);
        //                string expression = "LineId= '" + filtergate.ElementAt(0).LineName.ToString() + "'";


        //                DataView dataView = ds.Tables[0].DefaultView;
        //                DataView dataView1 = ds.Tables[2].DefaultView;
        //                if (!string.IsNullOrEmpty(LineName))
        //                {
        //                    dataView.RowFilter = expression;
        //                    DtBind = dataView.ToTable();

        //                    dataView1.RowFilter = expression;
        //                    DtBind1 = dataView1.ToTable();
        //                    //DtBind.Columns["VariantId "].ColumnName = "VariantId";
        //                }


        //                var DynmaicColumnList = from DyColumns in ds.Tables[4].AsEnumerable()

        //                                        select new
        //                                        {
        //                                            DynamicColumnName = DyColumns.Field<string>("DynamicColumnName"),
        //                                            NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),


        //                                        };




        //                DataTable dt = new DataTable();
        //                dt.Columns.Add("VIN");
        //                dt.Columns.Add("VehicleType");
        //                dt.Columns.Add("Model");
        //                dt.Columns.Add("Part Name");
        //                dt.Columns.Add("Defect");
        //                dt.Columns.Add("Status");
        //                if (DynmaicColumnList.Count() > 0)
        //                {
        //                    for (int i = 0; i < DynmaicColumnList.Count(); i++)
        //                    {
        //                        if (Convert.ToString(DynmaicColumnList.ElementAt(i).DynamicColumnName) != "")
        //                        {
        //                            dt.Columns.Add(DynmaicColumnList.ElementAt(i).DynamicColumnName);
        //                        }

        //                    }
        //                }






        //                ISheet sheet1 = workbook.CreateSheet(Convert.ToString(LineName));
        //                int k = 0;
        //                int RowFrom = 1;
        //                int Filtercount = 0;





        //                //byte[] data = System.IO.File.ReadAllBytes("D:\\Auto QFL Phase II\\MFBMAutomatedQFL\\MFBMAutomatedQFL\\Signature\\Signature_05_05_2020_153946.png");
        //                //int pictureIndex = workbook.AddPicture(data, PictureType.PNG);
        //                //ICreationHelper helper = workbook.GetCreationHelper();
        //                //IDrawing drawing = sheet1.CreateDrawingPatriarch();
        //                //IClientAnchor anchor = helper.CreateClientAnchor();
        //                //anchor.Col1 = 4;//0 index based column
        //                //anchor.Row1 = 0;//0 index based row
        //                //IPicture picture = drawing.CreatePicture(anchor, pictureIndex);
        //                //picture.Resize();

        //                for (int i = 0; i < DtBind.Rows.Count; i++)
        //                {

        //                    int counts = 1;

        //                    var filtergates = from Line in ds.Tables[3].AsEnumerable()
        //                                      where Line.Field<string>("VinNumber") == Convert.ToString(DtBind.Rows[i][2].ToString())
        //                                      select new
        //                                      {
        //                                          Defect = Line.Field<string>("Defect"),
        //                                          Vin = Line.Field<string>("VinNumber"),
        //                                          VehicleType = Line.Field<string>("VehicleType"),
        //                                          Model = Line.Field<string>("ModelName"),
        //                                          CheckListItemStatusId = Line.Field<Int64>("CheckListItemStatusId"),
        //                                          StatusCount = Line.Field<Int64>("StatusCount"),
        //                                          ReExaminationCount = Line.Field<Int64>("ReExaminationCount"),
        //                                          InspectionItem = Line.Field<string>("inspectionitem"),
        //                                          Site1Image = Line.Field<string>("Site1Image"),
        //                                          QFLFeedbackWorkflowId = Line.Field<Int64>("QFLFeedbackWorkflowId"),
        //                                          VinId = Line.Field<Int64>("VinId"),

        //                                      };
        //                    for (int j = 0; j < filtergates.Count(); j++)
        //                    {
        //                        Filtercount = filtergates.Count();
        //                        DataRow dr = dt.NewRow();
        //                        dt.Rows.Add(dr);


        //                        if (filtergates.ElementAt(j).Site1Image != "")
        //                        {

        //                            int imgWidth = 50; // only initial if not known
        //                            int imgHeight = 50;
        //                            int LOGO_MARGIN = 2;
        //                            byte[] data = null;
        //                            WebServices _webs = new WebServices();
        //                            string filepath = ConfigurationManager.AppSettings["SignaturePath"] + filtergates.ElementAt(j).Vin + @"\" + filtergates.ElementAt(j).Site1Image;
        //                            ICreationHelper helper = workbook.GetCreationHelper();
        //                            IDrawing drawing = sheet1.CreateDrawingPatriarch();
        //                            IClientAnchor anchor = helper.CreateClientAnchor();

        //                            data = GetBytesFromFile(filepath);
        //                            int pictureIndex = workbook.AddPicture(data, PictureType.PNG);

        //                            anchor.Col1 = 4;
        //                            anchor.Row1 = j + 1;

        //                            IPicture picture = drawing.CreatePicture(anchor, pictureIndex);
        //                            picture.Resize(1);
        //                            //picture.Resize(0.5 * imgWidth / XSSFShape.PIXEL_DPI, 5 * imgHeight / XSSFShape.PIXEL_DPI);




        //                        }


        //                        if (counts == 1)
        //                        {

        //                            RowFrom = k + 1;


        //                            //dt.Rows[k]["VIN"] = Convert.ToString(DtBind1.Rows[k][2].ToString());
        //                            //dt.Rows[k]["VehicleType"] = Convert.ToString(DtBind1.Rows[k][4].ToString());
        //                            //dt.Rows[k]["Model"] = Convert.ToString(DtBind1.Rows[k][3].ToString());
        //                            //dt.Rows[k]["Defect"] = Convert.ToString(DtBind1.Rows[k][0].ToString());

        //                            dt.Rows[k]["VIN"] = Convert.ToString(filtergates.ElementAt(j).Vin);
        //                            dt.Rows[k]["VehicleType"] = Convert.ToString(filtergates.ElementAt(j).VehicleType);
        //                            dt.Rows[k]["Model"] = Convert.ToString(filtergates.ElementAt(j).Model);
        //                            dt.Rows[k]["Part Name"] = Convert.ToString(filtergates.ElementAt(j).InspectionItem);

        //                            dt.Rows[k]["Defect"] = Convert.ToString(filtergates.ElementAt(j).Defect);


        //                            if (filtergates.ElementAt(j).CheckListItemStatusId == 3 || filtergates.ElementAt(j).CheckListItemStatusId == 6)
        //                            {
        //                                dt.Rows[k]["Status"] = Convert.ToString("Rework");
        //                            }
        //                            else
        //                            {
        //                                dt.Rows[k]["Status"] = Convert.ToString("Re-Examination");
        //                            }


        //                            //var DynamicDetails ="";

        //                            var DynamicValueDetails = from DyColumns in ds.Tables[5].AsEnumerable()
        //                                                      where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
        //                                                      &&
        //                                                      DyColumns.Field<Int64>("VinId") == Convert.ToInt64(filtergates.ElementAt(j).VinId)
        //                                                      select new
        //                                                      {
        //                                                          DynamicColumnDetails = DyColumns.Field<string>("DynamicColumnDetails"),
        //                                                          NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),
        //                                                          QFLFeedBackworkflowId = DyColumns.Field<Int64>("QFLFeedBackworkflowId"),
        //                                                          VinId = DyColumns.Field<Int64>("VinId"),

        //                                                      };

        //                            for (int m = 0; m < DynmaicColumnList.Count(); m++)
        //                            {


        //                                var DynamicDetails = (from item in DynamicValueDetails
        //                                                      where item.NewProgressColumnId == Convert.ToInt64(DynmaicColumnList.ElementAt(m).NewProgressColumnId)
        //                                                      select item).ToList();

        //                                if (DynamicDetails.Count > 0)
        //                                {

        //                                    dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString(DynamicDetails.ElementAt(0).DynamicColumnDetails);
        //                                }
        //                                else
        //                                {
        //                                    if (DynmaicColumnList.ElementAt(m).DynamicColumnName != "")
        //                                    {
        //                                        dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString("");
        //                                    }

        //                                }
        //                            }


        //                        }
        //                        else
        //                        {
        //                            dt.Rows[k]["Part Name"] = Convert.ToString(filtergates.ElementAt(j).InspectionItem);

        //                            dt.Rows[k]["Defect"] = Convert.ToString(filtergates.ElementAt(j).Defect);


        //                            if (filtergates.ElementAt(j).CheckListItemStatusId == 3 || filtergates.ElementAt(j).CheckListItemStatusId == 6)
        //                            {
        //                                dt.Rows[k]["Status"] = Convert.ToString("Rework");
        //                            }
        //                            else
        //                            {
        //                                dt.Rows[k]["Status"] = Convert.ToString("Re-Examination");
        //                            }


        //                            var DynamicValueDetails = from DyColumns in ds.Tables[5].AsEnumerable()
        //                                                      where DyColumns.Field<Int64>("QFLFeedBackworkflowId") == Convert.ToInt64(filtergates.ElementAt(j).QFLFeedbackWorkflowId)
        //                                                      &&
        //                                                      DyColumns.Field<Int64>("VinId") == Convert.ToInt64(filtergates.ElementAt(j).VinId)
        //                                                      select new
        //                                                      {
        //                                                          DynamicColumnDetails = DyColumns.Field<string>("DynamicColumnDetails"),
        //                                                          NewProgressColumnId = DyColumns.Field<Int64>("NewProgressColumnId"),
        //                                                          QFLFeedBackworkflowId = DyColumns.Field<Int64>("QFLFeedBackworkflowId"),
        //                                                          VinId = DyColumns.Field<Int64>("VinId"),

        //                                                      };

        //                            for (int m = 0; m < DynmaicColumnList.Count(); m++)
        //                            {


        //                                var DynamicDetails = (from item in DynamicValueDetails
        //                                                      where item.NewProgressColumnId == Convert.ToInt64(DynmaicColumnList.ElementAt(m).NewProgressColumnId)
        //                                                      select item).ToList();

        //                                if (DynamicDetails.Count > 0)
        //                                {

        //                                    dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString(DynamicDetails.ElementAt(0).DynamicColumnDetails);
        //                                }
        //                                else
        //                                {


        //                                    if (DynmaicColumnList.ElementAt(m).DynamicColumnName != "")
        //                                    {
        //                                        dt.Rows[k][DynmaicColumnList.ElementAt(m).DynamicColumnName] = Convert.ToString("");
        //                                    }

        //                                }
        //                            }


        //                            if (Filtercount == j + 1)
        //                            {
        //                                //new NPOI.SS.Util.CellRangeAddress(RowFrom,RowTo, FromColumn, ToColumn);
        //                                NPOI.SS.Util.CellRangeAddress cra = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 0, 0);
        //                                NPOI.SS.Util.CellRangeAddress cra1 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 1, 1);
        //                                NPOI.SS.Util.CellRangeAddress cra2 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 2, 2);
        //                                //NPOI.SS.Util.CellRangeAddress cra3 = new NPOI.SS.Util.CellRangeAddress(RowFrom, k + 1, 4, 4);
        //                                sheet1.AddMergedRegion(cra);
        //                                sheet1.AddMergedRegion(cra1);
        //                                sheet1.AddMergedRegion(cra2);
        //                                //sheet1.AddMergedRegion(cra3);
        //                            }



        //                        }




        //                        counts++;
        //                        k++;


        //                    }
        //                }

        //                //header bold


        //                var font = workbook.CreateFont();
        //                font.FontHeightInPoints = (short)12;
        //                font.FontName = "Calibri";

        //                font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Normal;

        //                NPOI.HSSF.UserModel.HSSFWorkbook wob = new NPOI.HSSF.UserModel.HSSFWorkbook();//alfred test
        //                NPOI.HSSF.UserModel.HSSFPalette pa = wob.GetCustomPalette();
        //                NPOI.HSSF.Util.HSSFColor XlColour = pa.FindSimilarColor(192, 192, 192);

        //                //make a header row  
        //                IRow row1 = sheet1.CreateRow(0);

        //                XSSFCellStyle yourStyle = (XSSFCellStyle)workbook.CreateCellStyle();
        //                yourStyle.WrapText = true;
        //                yourStyle.Alignment = HorizontalAlignment.Center;
        //                yourStyle.VerticalAlignment = VerticalAlignment.Center;
        //                yourStyle.BorderBottom = BorderStyle.Medium;
        //                yourStyle.BorderRight = BorderStyle.Medium;
        //                yourStyle.BorderTop = BorderStyle.Medium;
        //                yourStyle.BorderLeft = BorderStyle.Medium;



        //                for (int j = 0; j < dt.Columns.Count; j++)
        //                {
        //                    //sheet1.SetColumnWidth(j, 5000);
        //                    sheet1.SetColumnWidth(j, 9000);
        //                    ICell cell = row1.CreateCell(j);
        //                    cell.CellStyle = workbook.CreateCellStyle();
        //                    cell.CellStyle = yourStyle;
        //                    cell.CellStyle.SetFont(font);
        //                    cell.CellStyle.FillForegroundColor = XlColour.Indexed;
        //                    cell.CellStyle.FillPattern = FillPattern.NoFill;

        //                    String columnName = dt.Columns[j].ToString();
        //                    cell.SetCellValue(columnName);
        //                }

        //                //loops through data  
        //                for (int m = 0; m < dt.Rows.Count; m++)
        //                {
        //                    IRow row = sheet1.CreateRow(m + 1);
        //                    for (int j = 0; j < dt.Columns.Count; j++)
        //                    {
        //                        ICell cell = row.CreateCell(j);
        //                        cell.CellStyle = yourStyle;
        //                        String columnName = dt.Columns[j].ToString();
        //                        cell.SetCellValue(dt.Rows[m][columnName].ToString());

        //                    }
        //                }

        //            }

        //            using (var exportData = new MemoryStream())
        //            {
        //                Response.Clear();
        //                workbook.Write(exportData);

        //                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //                Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", "Progress_Monitor" + "_" + DateTime.Now.ToString("dd-MM-yyyy_HH-mm-ss") + ".xlsx"));
        //                Response.BinaryWrite(exportData.ToArray());
        //                Response.End();
        //            }
        //        }
        //    }


        //    catch (Exception ex)
        //    {
        //        ErrorLog.Log("Progressmonitor Excel" + ex.Message);
        //    }
        //}



        [SessionExpire]
        public ActionResult ProgressMonitorToQFLFeedback(string Vinnumber)
        {
            TempData["Vinnumber"] = Vinnumber;
            return RedirectToAction("QFLFeedback");
        }



        [HttpPost]
        public JsonResult KeepSessionAlive()
        {

            return new JsonResult
            {
                Data = "Beat Generated"
            };
        }


        [SessionExpire]
        public JsonResult SignatureSaveBusImage(string imagedata, string Vinnumber, int VinId, int Gateid,string ModelName)
        {
            WebServices Service = new WebServices();
            UserDetails Signature = new UserDetails();
            string path = ConfigurationManager.AppSettings["PaintingImage"].ToString();
            string Filename = DateTime.Now.ToString().Replace("/", "_").Replace(" ", "_").Replace(":", "") + ".png";
            Filename = "PaintingImage_" + Vinnumber + '_' + VinId + "_" + Gateid + "_" + Filename.Replace("-", "_");
            // string fileNameWithPath = path + Filename;

            string fileNameWithPath = path + @"" + Vinnumber + @"\" + ModelName + @"\" + Filename;

            string postedFile = path + @"" + Vinnumber + @"\" + ModelName;

            if (!System.IO.Directory.Exists(postedFile))
            {
                System.IO.Directory.CreateDirectory(postedFile);

            }
            try
            {
                using (FileStream fs = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {

                        byte[] data = Convert.FromBase64String(imagedata);

                        bw.Write(data);

                        bw.Close();
                    }

                }
                //string token = GenerateToken(Convert.ToString(ConfigurationManager.AppSettings["TokenUser"]), Convert.ToString(ConfigurationManager.AppSettings["TokenPass"]));
                //Signature = Service.AddSignature(fileNameWitPath, token);

            }
            catch (Exception ex)
            {
                ErrorLog.Log("SignatureSaveBusImage " + ex.Message);
                return Json("Error", JsonRequestBehavior.AllowGet);

            }
            return Json(Filename, JsonRequestBehavior.AllowGet);

        }

    }
}
