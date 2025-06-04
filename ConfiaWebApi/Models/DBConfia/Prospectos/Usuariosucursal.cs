using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.UsuarioSucursal")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class UsuarioSucursal
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idUsuario")]
        public int idUsuario { get; set; }
      
        
        [Column("idSucursal")]
        public int idSucursal { get; set; }


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
