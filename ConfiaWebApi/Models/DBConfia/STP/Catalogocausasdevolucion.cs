using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.CatalogoCausasDevolucion")]
    [ExplicitColumns]
    [PrimaryKey("CausaDevolucionID")]
    public class CatalogoCausasDevolucion
    {
              
        
        [Column("CausaDevolucionID")]
        public int CausaDevolucionID { get; set; }
      
        
        [Column("Clave")]
        public int Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Abreviatura")]
        public string Abreviatura { get; set; }


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
