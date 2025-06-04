using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.GruposUsuarios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class GruposUsuarios_VW
    {
              
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("EsttGrupo")]
        public bool EsttGrupo { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }


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
