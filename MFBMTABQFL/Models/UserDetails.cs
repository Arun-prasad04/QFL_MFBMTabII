using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MFBMTABQFL.Models
{
    public class UserDetails
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string LastLogin { get; set; }

        public string Token { get; set; }

        public string Api { get; set; }

        public string Language { get; set; }

        public string CountryCode { get; set; }

        public int DeptId { get; set; }

        public int RoleId { get; set; }

        public int PlantId { get; set; }
        public string LoginStatus { get; set; }
        public string SignatureSitePath { get; set; }
        public string PaintingImagePath { get; set; }
        //public bool ChangePassword { get; set; }
        //public int Administrator { get; set; }
        //public int AutomatedQFL { get; set; } 
        

        public List<UserAccess> AccessDetails { get; set; }
    }
    public class UserAccess
    {
        public int UserId { get; set; }
        public int AccessId { get; set; }
        public string AccessName { get; set; }
        public int ToolId { get; set; }
        public string AccessType { get; set; }
    }


    public class ValidateUserDetails
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string LastLogin { get; set; }

        public string Token { get; set; }

        public string Api { get; set; }

        public string Language { get; set; }

        public string CountryCode { get; set; }

        public int DeptId { get; set; }

        public int RoleId { get; set; }

        public int PlantId { get; set; }
        public string LoginStatus { get; set; }
        public bool ChangePassword { get; set; }
        public int Administrator { get; set; }
        public int AutomatedQFL { get; set; }


        public List<UserAccess> AccessDetails { get; set; }
    }


    public class ModifiedDateDetails
    {
        public string VIN { get; set; }

        public int QGateId { get; set; }

        public int LineId { get; set; }

        public string ModifiedDate { get; set; }

        public string Varaint { get; set; }

        public string QGateName { get; set; }

        public string Rework { get; set; }
        public string Status { get; set; }
    }

    public class Excel_DetailsList
    {


        public List<ModifiedDateDetails> ModifiedDateDetailsList { get; set; }


    }

    public class Inputs
    {
        public int plantid { get; set; }

        public string vinfrom { get; set; }

        public string vinto { get; set; }

        public string fromdate { get; set; }

        public string todate { get; set; }

        public string VINNumber { get; set; }
    }

}