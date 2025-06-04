using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.TiposUsuario")]
    [ExplicitColumns]
    [PrimaryKey("TipoUsusarioID")]
    public class TiposUsuario
    {
              
        
        [Column("TipoUsuarioID")]
        public int TipoUsuarioID { get; set; }
      
        
        [Column("TipoUsuario")]
        public string TipoUsuario { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }
    }
}
