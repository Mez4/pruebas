using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Arqueos")]
    [ExplicitColumns]
    [PrimaryKey("ArqueoID")]
    public class Arqueos
    {
              
        
        [Column("ArqueoID")]
        public int ArqueoID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("UsuarioRealiza")]
        public string UsuarioRealiza { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }


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
