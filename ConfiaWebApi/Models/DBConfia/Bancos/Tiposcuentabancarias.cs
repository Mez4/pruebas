using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposCuentaBancarias")]
    [ExplicitColumns]
    [PrimaryKey("TipoCuentaBancoID")]
    public class TiposCuentaBancarias
    {
              
        
        [Column("TipoCuentaBancoID")]
        public int TipoCuentaBancoID { get; set; }
      
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }


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
