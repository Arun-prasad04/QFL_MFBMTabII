using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MFBMTABQFL.Models
{
    public class LoginModel
    {
        public string username { get; set; }
        public string password { get; set; }
        public bool rememberme { get; set; }
        public string language { get; set; }
    }
    public class Users
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}