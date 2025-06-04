using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionGestoresDistribuidoresAgrupado_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionGestoresDistribuidoresAgrupado_VW
    {
              
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
      
        
        [Column("GestorDesc")]
        public string GestorDesc { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("empresaId")]
        public int empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("SucursaDesc")]
        public string SucursaDesc { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DistribuidorDesc")]
        public string DistribuidorDesc { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }


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
