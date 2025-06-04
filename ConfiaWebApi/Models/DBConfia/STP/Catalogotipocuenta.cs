using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.CatalogoTipoCuenta")]
    [ExplicitColumns]
    [PrimaryKey("Clave", AutoIncrement=false)]
    public class CatalogoTipoCuenta
    {
              
        
        [Column("TipoCuentaID")]
        public int TipoCuentaID { get; set; }
      
        
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
