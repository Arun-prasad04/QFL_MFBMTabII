using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MFBMTABQFL.Models
{
    public class Actualcomment
    {
      
            public int fileid { get; set; }
            public int vinid { get; set; }
            public string staticchecklistitemid { get; set; }
            public int actualid { get; set; }

            public int checklistitemid { get; set; }

            public string actualvalue { get; set; }

            public string responsible { get; set; }
            public string damagecode { get; set; }

            public string comments { get; set; }
            public string filename { get; set; }
            public string filesize { get; set; }
            public string filedata { get; set; }
            public string guid { get; set; }
            public string result { get; set; }
            public string token { get; set; }
            public string mode { get; set; }
            public int userid { get; set; }

            public string filedetail { get; set; }
            public List<Actualcomment> actualdetail { get; set; }
        
    }
}