using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.SucursalesProductos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalesProductos_VW
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("distribuidorIdMin")]
        public Int64 distribuidorIdMin { get; set; }
      
        
        [Column("distribuidorIdMax")]
        public Int64 distribuidorIdMax { get; set; }
      
        
        [Column("importeLimiteCreditoDefault")]
        public decimal importeLimiteCreditoDefault { get; set; }
      
        
        [Column("tabuladorTipoID")]
        public int tabuladorTipoID { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("SucursalFisicaID")]
        public int SucursalFisicaID { get; set; }
      
        
        [Column("DiasDeEntregaAprox")]
        public int? DiasDeEntregaAprox { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("ContratoCIE")]
        public string ContratoCIE { get; set; }


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
