using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
//using System.Configuration.Install;
using System.Linq;
using System.Net;
using MFBMTABQFL.Models;
using System.Configuration;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;
using System.Data;
using System.Text;

namespace MFBMTABQFL.Services
{
    public partial class WebServices : WebClient
    {
        public int Timeout { get; set; }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var request = base.GetWebRequest(address);
            request.Timeout = Timeout;
            return request;
        }


        public DataSet GetUserDetails(string emailid, string token)
        {
            string result = string.Empty;
            UserDetails user = new UserDetails();
            UserDetails Input = new UserDetails();
            Input.Email = emailid;
            DataSet myDataSet = new DataSet();
            try
            {
                var client = new WebServices();
                client.Timeout = 900000;
                client.Credentials = CredentialCache.DefaultCredentials;
                client.Headers["Content-type"] = "application/json";
                client.Headers["Authorization"] = "Basic " + token;
                client.Headers["cache-control"] = "no-cache";

                client.Proxy.Credentials = CredentialCache.DefaultCredentials;
                var url = ConfigurationManager.AppSettings["API"] + "QFL.svc/GetUserDetails";

                MemoryStream stream = new MemoryStream();
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(UserDetails));
                serializer.WriteObject(stream, Input);
                byte[] data = client.UploadData(url, "POST", stream.ToArray());
                stream = new MemoryStream(data);
                var jsonString = System.Text.Encoding.UTF8.GetString(stream.ToArray());
                string unescapedJsonString = JsonConvert.DeserializeObject<string>(jsonString);

                stream.Close();


                myDataSet = JsonConvert.DeserializeObject<DataSet>(unescapedJsonString);
                ;


            }
            catch (Exception ex)
            {
                WriteToLog("Service Consume Error");
                WriteToLog(ex.Message);
            }
            return myDataSet;
        }


        //public UserDetails GetUserDetails(string emailid, string token)
        //{
        //    var result = "";
        //    UserDetails user = new UserDetails();
        //    try
        //    {
        //        var client = new WebServices();
        //        client.Timeout = 900000;
        //        client.Credentials = CredentialCache.DefaultCredentials;
        //        client.Headers["Content-type"] = "application/json";
        //        client.Headers["Authorization"] = "Basic " + token;
        //        client.Headers["cache-control"] = "no-cache";

        //        client.Proxy.Credentials = CredentialCache.DefaultCredentials;
        //        var url = ConfigurationManager.AppSettings["API"] + "QFL.svc/GetUserDetails?emailid=" + emailid;
        //        var jsonString = client.DownloadString(url);
        //        result = Convert.ToString(jsonString);
        //        JObject o = JObject.Parse(jsonString);
        //        //user.UserName = (string)o["UserName"];
        //        //user.Email = (string)o["Email"];
        //        //user.LastLogin = (string)o["LastLogin"];
        //        //user.UserId = (int)o["UserId"];
        //        //user.CountryCode = (string)o["CountryCode"];
        //        //user.DeptId = (int)o["DeptId"];
        //        //user.RoleId = (int)o["RoleId"];
        //        user = JsonConvert.DeserializeObject<UserDetails>(jsonString);
        //    }
        //    catch (Exception ex)
        //    {
        //        WriteToLog("Service Consume Error");
        //        WriteToLog(ex.Message);
        //    }
        //    return user;
        //}



        public void WriteToLog(string text)
        {
            string sTemp = ConfigurationManager.AppSettings["Path"] + "_" + DateTime.Now.ToString("dd_MM") + ".txt";
            FileStream Fs = new FileStream(sTemp, FileMode.OpenOrCreate | FileMode.Append);
            StreamWriter st = new StreamWriter(Fs);
            string dttemp = DateTime.Now.ToString("[dd:MM:yyyy] [HH:mm:ss:ffff]");
            st.WriteLine(dttemp + "\t" + text);
            st.Close();
        }



        public ValidateUserDetails GetUserDetails(Users users)
        {
            string result = string.Empty;
            ValidateUserDetails user = new ValidateUserDetails();
            string jsonString = string.Empty;
            try
            {

                var client = new WebServices();
                client.Timeout = 900000;
                client.Credentials = System.Net.CredentialCache.DefaultCredentials;
                client.Headers["Content-type"] = "application/json";
                client.Headers["cache-control"] = "no-cache";
                client.Proxy.Credentials = CredentialCache.DefaultCredentials;
                var url = ConfigurationManager.AppSettings["Api"] + "QFL.svc/GetUserValidate";
                MemoryStream stream = new MemoryStream();
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Users));
                serializer.WriteObject(stream, users);
                byte[] data = client.UploadData(url, "POST", stream.ToArray());
                stream = new MemoryStream(data);
                 jsonString = System.Text.Encoding.UTF8.GetString(stream.ToArray());

                result = Convert.ToString(jsonString);
                stream.Close();
                JObject o = JObject.Parse(jsonString);
                user.UserName = (string)o["username"];
                user.Email = (string)o["email"];
                user.LastLogin = (string)o["lastlogin"];
                //user.AuditTool = (Int32)o["AuditTool"];
               // user.TaskTracker = (Int32)o["TaskTracker"];
               // user.ConcernTracker = (Int32)o["ConcernTracker"];
//user.ELearning = (Int32)o["ELearning"];
                //user.RPMS = (Int32)o["RPMS"];
                user.Administrator = (Int32)o["Administrator"];
                user.AutomatedQFL = (Int32)o["AutomatedQFL"];
              //  user.QmLab = (Int32)o["QmLab"];
                user.ChangePassword = (Boolean)o["ChangePassword"];
                user.LoginStatus = (string)o["LoginStatus"];
                
            }
            catch (Exception ex)
            {
                WriteToLog("Service Consume Error");
                WriteToLog(ex.Message);
            }
            return user;

        }

        public string GetUploadPath()
        {
            return ConfigurationManager.AppSettings["UploadFile"];
        }
        public string GetSignaturePathPath()
        {
            return ConfigurationManager.AppSettings["SignaturePath"];
        }

        public string InsertUpdatActualComment(Actualcomment json)
        {
            string url = ConfigurationManager.AppSettings["API"] + "QFL.svc/InsertUpdateActualCommentDetails";
            string jsonString = string.Empty;
            try
            {
                var client = new WebServices();
                client.Timeout = 900000;
                client.Credentials = System.Net.CredentialCache.DefaultCredentials;
                client.Encoding = System.Text.Encoding.UTF8;
                client.Headers["Content-type"] = "application/json";
                client.Headers["Authorization"] = "Basic " + json.token;
                client.Headers["cache-control"] = "no-cache";
                client.Proxy.Credentials = CredentialCache.DefaultCredentials;
                MemoryStream stream = new MemoryStream();
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Actualcomment));
                serializer.WriteObject(stream, json);
                byte[] data = client.UploadData(url, "POST", stream.ToArray());
                stream = new MemoryStream(data);
                jsonString = System.Text.Encoding.UTF8.GetString(stream.ToArray());
                stream.Close();

            }
            catch (Exception ex)
            {
                WriteToLog("Service Consume Error");
                WriteToLog(ex.Message);
            }

            return jsonString;
        }


        public DataSet Get_Excel_ExportNew(int PlantId, string VINFrom, string VINTo, string FromDate, string ToDate, string token)
        {
            Excel_DetailsList _obj = new Excel_DetailsList();
            Inputs Input = new Inputs();
            string jsonStrings = string.Empty;
            //string jsonString = string.Empty;
            string url = ConfigurationManager.AppSettings["API"] + "Monitor.svc/GetProgressMonitorNewDatas";
            Input.plantid = PlantId;
            Input.vinfrom = VINFrom;
            Input.vinto = VINTo;
            Input.fromdate = FromDate;
            Input.todate = ToDate;
            DataSet myDataSet = new DataSet();
            try
            {



                var client = new WebServices();
                client.Timeout = 900000;
                client.Credentials = System.Net.CredentialCache.DefaultCredentials;
                client.Encoding = Encoding.UTF8;
                client.Headers["Content-type"] = "application/json";
                client.Headers["Authorization"] = "Basic " + token;
                client.Headers["cache-control"] = "no-cache";
                client.Proxy.Credentials = CredentialCache.DefaultCredentials;
                MemoryStream stream = new MemoryStream();
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Inputs));
                serializer.WriteObject(stream, Input);
                byte[] data = client.UploadData(url, "POST", stream.ToArray());
                stream = new MemoryStream(data);
                var jsonString = Encoding.UTF8.GetString(stream.ToArray());
                string unescapedJsonString = JsonConvert.DeserializeObject<string>(jsonString);

                stream.Close();

                //var finalUnescapedJsonString = JsonConvert.DeserializeObject<string>(unescapedJsonString);


             

                myDataSet = JsonConvert.DeserializeObject<DataSet>(unescapedJsonString);

                stream.Close();

            }
            catch (Exception ex)
            {
                WriteToLog("Service Consume Error");
                WriteToLog(ex.Message);
            }

            //return _obj;
            return myDataSet;
        }

    }
}
