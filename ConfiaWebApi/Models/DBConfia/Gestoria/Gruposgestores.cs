using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.GruposGestores")]
    [ExplicitColumns]
    [PrimaryKey("GrupoID")]
    public class GruposGestores
    {
              
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
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
