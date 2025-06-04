using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.CatalogoTipoArchivados")]
    [ExplicitColumns]
    [PrimaryKey("TipoArchivadoID")]
    public class CatalogoTipoArchivados
    {
              
        
        [Column("TipoArchivadoID")]
        public int TipoArchivadoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("Clave")]
        public string Clave { get; set; }

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
