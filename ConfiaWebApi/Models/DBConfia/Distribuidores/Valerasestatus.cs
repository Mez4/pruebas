using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValerasEstatus")]
    [ExplicitColumns]
    [PrimaryKey("ValeraEstatusID", AutoIncrement=false)]
    public class ValerasEstatus
    {
              
        
        [Column("ValeraEstatusID")]
        public string ValeraEstatusID { get; set; }
      
        
        [Column("ValeraEstatus")]
        public string ValeraEstatus { get; set; }
      
        
        [Column("PuedeCanjear")]
        public bool PuedeCanjear { get; set; }
      
        
        [Column("AsignaUsuario")]
        public bool AsignaUsuario { get; set; }
      
        
        [Column("Orden")]
        public int Orden { get; set; }


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
