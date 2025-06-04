using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.SucursalesFisicas")]
    [ExplicitColumns]
    [PrimaryKey("SucursalFisicaID")]
    public class SucursalesFisicas
    {
              
        
        [Column("SucursalFisicaID")]
        public int SucursalFisicaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("DireccionID")]
        public Int64 DireccionID { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }


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
