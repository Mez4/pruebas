using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogBuroConsolidado_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class LogBuroConsolidado_VW
    {
              
        
        [Column("UsuarioIDConsolida")]
        public int UsuarioIDConsolida { get; set; }
      
        
        [Column("PersonaIDConsolida")]
        public Int64 PersonaIDConsolida { get; set; }
      
        
        [Column("NombreUsuarioConsolida")]
        public string NombreUsuarioConsolida { get; set; }
      
        
        [Column("FHConsolida")]
        public DateTime FHConsolida { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("EstatusBuroCredito")]
        public string EstatusBuroCredito { get; set; }


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
