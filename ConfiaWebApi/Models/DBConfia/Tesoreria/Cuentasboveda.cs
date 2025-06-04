using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasBoveda")]
    [ExplicitColumns]
    [PrimaryKey("CtasBovedaId")]
    public class CuentasBoveda
    {
              
        
        [Column("CtasBovedaId")]
        public int CtasBovedaId { get; set; }
      
        
        [Column("BovedaId")]
        public int BovedaId { get; set; }
      
        
        [Column("CuentaBancoId")]
        public int CuentaBancoId { get; set; }


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
