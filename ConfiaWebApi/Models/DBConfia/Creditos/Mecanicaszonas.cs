using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.MecanicasZonas")]
    [ExplicitColumns]
    [PrimaryKey("ID")]
    public class MecanicasZonas
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
        [Column("MecanicaID")]
        public int? MecanicaID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
