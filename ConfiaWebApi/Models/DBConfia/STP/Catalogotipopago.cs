using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.CatalogoTipoPago")]
    [ExplicitColumns]
    [PrimaryKey("Clave", AutoIncrement=false)]
    public class CatalogoTipoPago
    {
              
        
        [Column("TipoPagoID")]
        public int TipoPagoID { get; set; }
      
        
        [Column("Clave")]
        public int Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
