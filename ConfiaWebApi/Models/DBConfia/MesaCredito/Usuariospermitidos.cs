using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.UsuariosPermitidos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class UsuariosPermitidos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idUsuario")]
        public int idUsuario { get; set; }


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
