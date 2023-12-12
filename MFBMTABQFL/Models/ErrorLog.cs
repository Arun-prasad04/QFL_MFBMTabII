using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.IO;


namespace MFBMTABQFL.Models
{
    public class ErrorLog
    {
        // Parameter Constructor
        public ErrorLog(string Statement)
        {
            string sTemp = ConfigurationManager.AppSettings["Path"] + "_" + DateTime.Now.ToString("dd_MM") + ".txt";
            FileStream Fs = new FileStream(sTemp, FileMode.OpenOrCreate | FileMode.Append);
            StreamWriter st = new StreamWriter(Fs);
            string dttemp = DateTime.Now.ToString("[dd:MM:yyyy] [HH:mm:ss:ffff]");
            st.WriteLine(dttemp + "\t" + Statement);
            st.Close();
        }
        // Error log 
        public static void Log(string Statement)
        {
            ErrorLog currentError = new ErrorLog(Statement);
        }
    }
}