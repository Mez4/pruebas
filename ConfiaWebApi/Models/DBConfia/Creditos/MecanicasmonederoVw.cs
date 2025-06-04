using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.MecanicasMonedero_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MecanicasMonedero_VW
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("MecanicaID")]
        public int MecanicaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("Zona")]
        public string Zona { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
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
