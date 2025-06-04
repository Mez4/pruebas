using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCajas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SaldosCajas_VW
    {
              
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("Cerrada")]
        public bool Cerrada { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("EnOperacion")]
        public int EnOperacion { get; set; }
      
        
        [Column("BovedaID")]
        public int? BovedaID { get; set; }
      
        
        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }
      
        
        [Column("TotalCaja")]
        public decimal? TotalCaja { get; set; }


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
