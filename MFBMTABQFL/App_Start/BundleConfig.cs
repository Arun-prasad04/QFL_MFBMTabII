﻿using System.Web;
using System.Web.Optimization;

namespace MFBMTABQFL
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-3.3.1.js",
                         "~/Scripts/bootstrap.js",
                         "~/Scripts/bootstrap-select.js",
                         "~/Scripts/jquery.mCustomScrollbar.js",
                         "~/Scripts/jquery.validationEngine-en.js",
                         "~/Scripts/jquery.validationEngine.js",
                         "~/Scripts/select2.js",
                          "~/Scripts/theme.js",
                         "~/Scripts/DataAccessLayer.js",
                         "~/Scripts/Validation.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //            "~/Scripts/bootstrap.js",
            //            "~/Scripts/bootstrap-select.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/glyphicons.css",
                "~/Content/theme.css",
                "~/Content/bootstrap.css",
                "~/Content/jquery.mCustomScrollbar.css"

                ));

        }
    }
}