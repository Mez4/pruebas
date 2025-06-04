using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Gestores")]
    [ExplicitColumns]
    [PrimaryKey("GestorID")]
    public class Gestores
    {
              
        
        [Column("GestorID")]
        public int GestorID { get; set; }
      
        
        [Column("Gestor")]
        public string Gestor { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("UsuarioRegistro")]
        public int? UsuarioRegistro { get; set; }
      
        
        [Column("UsuarioModifico")]
        public int? UsuarioModifico { get; set; }


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
