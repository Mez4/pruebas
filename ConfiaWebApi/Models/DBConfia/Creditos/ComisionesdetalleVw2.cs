using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ComisionesDetalle_VW2")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ComisionesDetalle_VW2
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("RenglonId")]
        public int RenglonId { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidoNivelrOrigenID")]
        public int? DistribuidoNivelrOrigenID { get; set; }
      
        
        [Column("DistribuidorNivelOrigen")]
        public string DistribuidorNivelOrigen { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("DiasMin")]
        public int DiasMin { get; set; }
      
        
        [Column("DiasMax")]
        public int DiasMax { get; set; }
      
        
        [Column("PorcComision")]
        public decimal PorcComision { get; set; }
      
        
        [Column("PorcComisionReal")]
        public decimal PorcComisionReal { get; set; }
      
        
        [Column("porcMonedero")]
        public decimal porcMonedero { get; set; }
      
        
        [Column("porcMonederoReal")]
        public decimal porcMonederoReal { get; set; }


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
