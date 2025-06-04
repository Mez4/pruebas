using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosBovedasDetalle2")]
    [ExplicitColumns]
    [PrimaryKey("ArqueoBovedaDetalleID")]
    public class ArqueosBovedasDetalle2
    {
              
        
        [Column("ArqueoBovedaDetalleID")]
        public int ArqueoBovedaDetalleID { get; set; }
      
        
        [Column("CatDenomEfectivoID")]
        public int CatDenomEfectivoID { get; set; }
      
        
        [Column("TotalXEfectivo")]
        public decimal? TotalXEfectivo { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("ArqueoBovedaID")]
        public int? ArqueoBovedaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("Cantidad")]
        public int? Cantidad { get; set; }


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
