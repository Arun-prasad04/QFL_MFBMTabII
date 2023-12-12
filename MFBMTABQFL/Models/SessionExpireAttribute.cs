using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;

namespace MFBMTABQFL.Models
{
    public class SessionExpireAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            // check  sessions here
            string Users = (string)HttpContext.Current.Session["UserName"];
            ErrorLog.Log("Users = " + Users);
            if (string.IsNullOrEmpty(Users))
            {
                filterContext.Result = new RedirectResult(Convert.ToString(ConfigurationManager.AppSettings["Logout"]));
                return;
            }
            base.OnActionExecuting(filterContext);
        }
    }
}