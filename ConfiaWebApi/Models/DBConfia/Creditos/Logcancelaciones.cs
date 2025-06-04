using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.LogCancelaciones")]
    [ExplicitColumns]
    [PrimaryKey("LogCancelacionID")]
    public class LogCancelaciones
    {
              
        
        [Column("LogCancelacionID")]
        public Int64 LogCancelacionID { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime FechaCancelacion { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("AplicacionID")]
        public Int64? AplicacionID { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }
      
        
        [Column("UsuarioCancelaID")]
        public Int64 UsuarioCancelaID { get; set; }


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
