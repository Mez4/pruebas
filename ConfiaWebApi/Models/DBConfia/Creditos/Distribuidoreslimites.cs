using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.DistribuidoresLimites")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresLimites
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("LimiteDeCredito")]
        public decimal LimiteDeCredito { get; set; }
      
        
        [Column("Disponible")]
        public decimal? Disponible { get; set; }
      
        
        [Column("PorcColocacionLimite")]
        public decimal? PorcColocacionLimite { get; set; }
      
        
        [Column("CreditosActivos")]
        public int CreditosActivos { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public Int64? PersonaResponsableID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }


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
