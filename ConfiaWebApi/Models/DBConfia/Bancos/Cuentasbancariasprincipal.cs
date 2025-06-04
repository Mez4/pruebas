using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CuentasBancariasPrincipal")]
    [ExplicitColumns]
    [PrimaryKey("CuentaBancariaPrincipalID")]
    public class CuentasBancariasPrincipal
    {
              
        
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("EsReal")]
        public bool EsReal { get; set; }
      
        
        [Column("BancoID")]
        public int BancoID { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("TipoCuentaBancoID")]
        public int TipoCuentaBancoID { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }


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
