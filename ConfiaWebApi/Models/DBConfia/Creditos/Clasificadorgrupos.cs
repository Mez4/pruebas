using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ClasificadorGrupos")]
    [ExplicitColumns]
    [PrimaryKey("ClasificadorGrupoID")]
    public class ClasificadorGrupos
    {
              
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("UsuarioCreoID")]
        public int UsuarioCreoID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("UsuarioModID")]
        public int? UsuarioModID { get; set; }
      
        
        [Column("FechaMod")]
        public DateTime? FechaMod { get; set; }


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
