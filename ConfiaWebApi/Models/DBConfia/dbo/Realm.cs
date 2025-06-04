using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REALM")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class REALM
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ACCESS_CODE_LIFESPAN")]
        public int? ACCESS_CODE_LIFESPAN { get; set; }
      
        
        [Column("USER_ACTION_LIFESPAN")]
        public int? USER_ACTION_LIFESPAN { get; set; }
      
        
        [Column("ACCESS_TOKEN_LIFESPAN")]
        public int? ACCESS_TOKEN_LIFESPAN { get; set; }
      
        
        [Column("ACCOUNT_THEME")]
        public string ACCOUNT_THEME { get; set; }
      
        
        [Column("ADMIN_THEME")]
        public string ADMIN_THEME { get; set; }
      
        
        [Column("EMAIL_THEME")]
        public string EMAIL_THEME { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("EVENTS_ENABLED")]
        public bool EVENTS_ENABLED { get; set; }
      
        
        [Column("EVENTS_EXPIRATION")]
        public Int64? EVENTS_EXPIRATION { get; set; }
      
        
        [Column("LOGIN_THEME")]
        public string LOGIN_THEME { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("NOT_BEFORE")]
        public int? NOT_BEFORE { get; set; }
      
        
        [Column("PASSWORD_POLICY")]
        public string PASSWORD_POLICY { get; set; }
      
        
        [Column("REGISTRATION_ALLOWED")]
        public bool REGISTRATION_ALLOWED { get; set; }
      
        
        [Column("REMEMBER_ME")]
        public bool REMEMBER_ME { get; set; }
      
        
        [Column("RESET_PASSWORD_ALLOWED")]
        public bool RESET_PASSWORD_ALLOWED { get; set; }
      
        
        [Column("SOCIAL")]
        public bool SOCIAL { get; set; }
      
        
        [Column("SSL_REQUIRED")]
        public string SSL_REQUIRED { get; set; }
      
        
        [Column("SSO_IDLE_TIMEOUT")]
        public int? SSO_IDLE_TIMEOUT { get; set; }
      
        
        [Column("SSO_MAX_LIFESPAN")]
        public int? SSO_MAX_LIFESPAN { get; set; }
      
        
        [Column("UPDATE_PROFILE_ON_SOC_LOGIN")]
        public bool UPDATE_PROFILE_ON_SOC_LOGIN { get; set; }
      
        
        [Column("VERIFY_EMAIL")]
        public bool VERIFY_EMAIL { get; set; }
      
        
        [Column("MASTER_ADMIN_CLIENT")]
        public string MASTER_ADMIN_CLIENT { get; set; }
      
        
        [Column("LOGIN_LIFESPAN")]
        public int? LOGIN_LIFESPAN { get; set; }
      
        
        [Column("INTERNATIONALIZATION_ENABLED")]
        public bool INTERNATIONALIZATION_ENABLED { get; set; }
      
        
        [Column("DEFAULT_LOCALE")]
        public string DEFAULT_LOCALE { get; set; }
      
        
        [Column("REG_EMAIL_AS_USERNAME")]
        public bool REG_EMAIL_AS_USERNAME { get; set; }
      
        
        [Column("ADMIN_EVENTS_ENABLED")]
        public bool ADMIN_EVENTS_ENABLED { get; set; }
      
        
        [Column("ADMIN_EVENTS_DETAILS_ENABLED")]
        public bool ADMIN_EVENTS_DETAILS_ENABLED { get; set; }
      
        
        [Column("EDIT_USERNAME_ALLOWED")]
        public bool EDIT_USERNAME_ALLOWED { get; set; }
      
        
        [Column("OTP_POLICY_COUNTER")]
        public int? OTP_POLICY_COUNTER { get; set; }
      
        
        [Column("OTP_POLICY_WINDOW")]
        public int? OTP_POLICY_WINDOW { get; set; }
      
        
        [Column("OTP_POLICY_PERIOD")]
        public int? OTP_POLICY_PERIOD { get; set; }
      
        
        [Column("OTP_POLICY_DIGITS")]
        public int? OTP_POLICY_DIGITS { get; set; }
      
        
        [Column("OTP_POLICY_ALG")]
        public string OTP_POLICY_ALG { get; set; }
      
        
        [Column("OTP_POLICY_TYPE")]
        public string OTP_POLICY_TYPE { get; set; }
      
        
        [Column("BROWSER_FLOW")]
        public string BROWSER_FLOW { get; set; }
      
        
        [Column("REGISTRATION_FLOW")]
        public string REGISTRATION_FLOW { get; set; }
      
        
        [Column("DIRECT_GRANT_FLOW")]
        public string DIRECT_GRANT_FLOW { get; set; }
      
        
        [Column("RESET_CREDENTIALS_FLOW")]
        public string RESET_CREDENTIALS_FLOW { get; set; }
      
        
        [Column("CLIENT_AUTH_FLOW")]
        public string CLIENT_AUTH_FLOW { get; set; }
      
        
        [Column("OFFLINE_SESSION_IDLE_TIMEOUT")]
        public int? OFFLINE_SESSION_IDLE_TIMEOUT { get; set; }
      
        
        [Column("REVOKE_REFRESH_TOKEN")]
        public bool REVOKE_REFRESH_TOKEN { get; set; }
      
        
        [Column("ACCESS_TOKEN_LIFE_IMPLICIT")]
        public int? ACCESS_TOKEN_LIFE_IMPLICIT { get; set; }
      
        
        [Column("LOGIN_WITH_EMAIL_ALLOWED")]
        public bool LOGIN_WITH_EMAIL_ALLOWED { get; set; }
      
        
        [Column("DUPLICATE_EMAILS_ALLOWED")]
        public bool DUPLICATE_EMAILS_ALLOWED { get; set; }
      
        
        [Column("DOCKER_AUTH_FLOW")]
        public string DOCKER_AUTH_FLOW { get; set; }
      
        
        [Column("REFRESH_TOKEN_MAX_REUSE")]
        public int? REFRESH_TOKEN_MAX_REUSE { get; set; }
      
        
        [Column("ALLOW_USER_MANAGED_ACCESS")]
        public bool ALLOW_USER_MANAGED_ACCESS { get; set; }
      
        
        [Column("SSO_MAX_LIFESPAN_REMEMBER_ME")]
        public int SSO_MAX_LIFESPAN_REMEMBER_ME { get; set; }
      
        
        [Column("SSO_IDLE_TIMEOUT_REMEMBER_ME")]
        public int SSO_IDLE_TIMEOUT_REMEMBER_ME { get; set; }
      
        
        [Column("DEFAULT_ROLE")]
        public string DEFAULT_ROLE { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
