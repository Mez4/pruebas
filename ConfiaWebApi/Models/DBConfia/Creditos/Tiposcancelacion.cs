using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.TiposCancelacion")]
    [ExplicitColumns]
    [PrimaryKey("TipoCancelacionID")]
    public class TiposCancelacion
    {
              
        
        [Column("TipoCancelacionID")]
        public int TipoCancelacionID { get; set; }
      
        
        [Column("TipoCancelacion")]
        public string TipoCancelacion { get; set; }


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
