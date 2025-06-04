using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AnalistaCobranza")]
    [ExplicitColumns]
    // No primary key detected
    public class AnalistaCobranza
    {
              
        
        [Column("AnalistaCobranzaID")]
        public int? AnalistaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("Activo")]
        public int? Activo { get; set; }
      
        
        [Column("AccesoAppCobranza")]
        public int? AccesoAppCobranza { get; set; }


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
