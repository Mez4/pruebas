using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ArqueoDetalleID")]
    public class ArqueosDetalle
    {
              
        
        [Column("ArqueoDetalleID")]
        public int ArqueoDetalleID { get; set; }
      
        
        [Column("CatDenomEfectivoID")]
        public int CatDenomEfectivoID { get; set; }
      
        
        [Column("Cantidad")]
        public int Cantidad { get; set; }
      
        
        [Column("TotalXEfectivo")]
        public decimal? TotalXEfectivo { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("ArqueoID")]
        public int? ArqueoID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }


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
