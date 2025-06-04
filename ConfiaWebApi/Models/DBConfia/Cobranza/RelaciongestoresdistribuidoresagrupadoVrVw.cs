using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionGestoresDistribuidoresAgrupado_VR_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionGestoresDistribuidoresAgrupado_VR_VW
    {
              
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
      
        
        [Column("GestorDesc")]
        public string GestorDesc { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
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
      
        
        [Column("FhUltimoPago")]
        public DateTime? FhUltimoPago { get; set; }
      
        
        [Column("SistemaId")]
        public int? SistemaId { get; set; }
      
        
        [Column("SistemaDsc")]
        public string SistemaDsc { get; set; }


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
