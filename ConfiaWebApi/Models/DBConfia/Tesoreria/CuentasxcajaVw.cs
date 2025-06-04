using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasXCaja_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasXCaja_VW
    {
              
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("CuentaBanco")]
        public string CuentaBanco { get; set; }
      
        
        [Column("Disponible")]
        public bool Disponible { get; set; }
      
        
        [Column("CuentaBancoDesc")]
        public string CuentaBancoDesc { get; set; }


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
