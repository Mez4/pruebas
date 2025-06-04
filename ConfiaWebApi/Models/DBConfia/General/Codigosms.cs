using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.CodigoSMS")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class CodigoSMS
    {
              
        
        [Column("Id")]
        public Int64 Id { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Codigo")]
        public string Codigo { get; set; }
      
        
        [Column("FechaEnvio")]
        public DateTime FechaEnvio { get; set; }
      
        
        [Column("FechaCaduca")]
        public DateTime FechaCaduca { get; set; }
      
        
        [Column("Confirmado")]
        public bool Confirmado { get; set; }
      
        
        [Column("SMSId")]
        public Int64? SMSId { get; set; }
      
        
        [Column("CanjeAppId")]
        public Int64? CanjeAppId { get; set; }
      
        
        [Column("TipoID")]
        public int? TipoID { get; set; }


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
