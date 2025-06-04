using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.TiposCodigos")]
    [ExplicitColumns]
    [PrimaryKey("TipoCodigoID")]
    public class TiposCodigos
    {
              
        
        [Column("TipoCodigoID")]
        public int TipoCodigoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
