using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosBovedas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ArqueosBovedas_VW
    {
              
        
        [Column("ArqueoBovedaID")]
        public int ArqueoBovedaID { get; set; }
      
        
        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("BovedaID")]
        public int BovedaID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }


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
