using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.ListaAsignarDistribuidor_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ListaAsignarDistribuidor_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorDesc")]
        public string DistribuidorDesc { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("MotivoID")]
        public int MotivoID { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }
      
        
        [Column("TipoCobranza")]
        public string TipoCobranza { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }


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
