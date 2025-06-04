using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosBovedas2")]
    [ExplicitColumns]
    [PrimaryKey("ArqueoBovedaID")]
    public class ArqueosBovedas2
    {
              
        
        [Column("ArqueoBovedaID")]
        public int ArqueoBovedaID { get; set; }
      
        
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
