using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.DestinosDeCredito")]
    [ExplicitColumns]
    [PrimaryKey("motivoTipoId")]
    public class DestinosDeCredito
    {
              
        
        [Column("motivoTipoId")]
        public int motivoTipoId { get; set; }
      
        
        [Column("motivoTipoDesc")]
        public string motivoTipoDesc { get; set; }
      
        
        [Column("iconoMotivoTipo")]
        public string iconoMotivoTipo { get; set; }


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
