using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CorresponsalesTipoComision")]
    [ExplicitColumns]
    [PrimaryKey("TipoComisionID")]
    public class CorresponsalesTipoComision
    {
              
        
        [Column("TipoComisionID")]
        public int TipoComisionID { get; set; }
      
        
        [Column("TipoComision")]
        public string TipoComision { get; set; }
      
        
        [Column("TipoPorcentaje")]
        public bool TipoPorcentaje { get; set; }
      
        
        [Column("TipoMontoFijo")]
        public bool TipoMontoFijo { get; set; }
      
        
        [Column("TipoMontoCorte")]
        public bool TipoMontoCorte { get; set; }


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
