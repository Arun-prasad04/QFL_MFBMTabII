using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MFBMTABQFL.Models
{
    public class UserValidation
    {
        public int Administrator { get; set; }

        public int AuditTool { get; set; }

        public int AutomatedQFL { get; set; }

        public Boolean ChangePassword { get; set; }

        public int ConcernTracker { get; set; }

        public int ELearning { get; set; }

        public string LoginStatus { get; set; }

        public int QmLab { get; set; }

        public int RPMS { get; set; }

        public int TaskTracker { get; set; }

        public string email { get; set; }
        public string lastlogin { get; set; }
        public string username { get; set; }
       

    }
}