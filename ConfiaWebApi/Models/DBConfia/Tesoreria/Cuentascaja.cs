using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasCaja")]
    [ExplicitColumns]
    [PrimaryKey("CtasCajaId")]
    public class CuentasCaja
    {
              
        
        [Column("CtasCajaId")]
        public int CtasCajaId { get; set; }
      
        
        [Column("CajaId")]
        public int CajaId { get; set; }
      
        
        [Column("CuentaBancoId")]
        public int CuentaBancoId { get; set; }
      
        
        [Column("Disponible")]
        public bool Disponible { get; set; }


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
