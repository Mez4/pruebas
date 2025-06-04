using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Gerentes")]
    [ExplicitColumns]
    [PrimaryKey("GerenteID")]
    public class Gerentes
    {
              
        
        [Column("GerenteID")]
        public Int64 GerenteID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }


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
