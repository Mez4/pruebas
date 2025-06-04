using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.GruposGestorUsuarios")]
    [ExplicitColumns]
    [PrimaryKey("GrupoID,UsuarioID", AutoIncrement=false)]
    public class GruposGestorUsuarios
    {
              
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("UsuarioCreoID")]
        public int UsuarioCreoID { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("UsuarioModificoID")]
        public int? UsuarioModificoID { get; set; }
      
        
        [Column("FechaModificacion")]
        public DateTime? FechaModificacion { get; set; }


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
