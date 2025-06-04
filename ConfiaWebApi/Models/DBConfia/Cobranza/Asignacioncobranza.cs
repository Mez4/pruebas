using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AsignacionCobranza")]
    [ExplicitColumns]
    // No primary key detected
    public class AsignacionCobranza
    {
              
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("limInferiorDias")]
        public int? limInferiorDias { get; set; }
      
        
        [Column("limSuperiorDias")]
        public int? limSuperiorDias { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("MotivoID")]
        public int? MotivoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CobranzaID")]
        public int? CobranzaID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }


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
