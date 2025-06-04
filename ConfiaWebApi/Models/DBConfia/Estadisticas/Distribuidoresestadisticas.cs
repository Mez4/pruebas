using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Estadisticas
{
    [TableName("Estadisticas.DistribuidoresEstadisticas")]
    [ExplicitColumns]
    // No primary key detected
    public class DistribuidoresEstadisticas
    {
              
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("CoordinadorID")]
        public int? CoordinadorID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("PagosAtr")]
        public int? PagosAtr { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("SaldoAtr")]
        public decimal? SaldoAtr { get; set; }
      
        
        [Column("DiasAtr")]
        public int? DiasAtr { get; set; }
      
        
        [Column("EsMigrada")]
        public bool? EsMigrada { get; set; }


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
