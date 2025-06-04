using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.V2")]
    [ExplicitColumns]
    // View, no primary key needed
    public class V2
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("UltimaRelacionFecha")]
        public DateTime? UltimaRelacionFecha { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("UltRelacionImporte")]
        public decimal? UltRelacionImporte { get; set; }
      
        
        [Column("Recuperado")]
        public decimal? Recuperado { get; set; }
      
        
        [Column("CortesAtrasados")]
        public int? CortesAtrasados { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        
        [Column("SaldoAnterior")]
        public decimal? SaldoAnterior { get; set; }


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
