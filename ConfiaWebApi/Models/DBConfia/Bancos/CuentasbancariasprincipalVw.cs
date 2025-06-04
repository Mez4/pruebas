using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CuentasBancariasPrincipal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasBancariasPrincipal_VW
    {
              
        
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("EsReal")]
        public bool EsReal { get; set; }
      
        
        [Column("CuentaActiva")]
        public bool CuentaActiva { get; set; }
      
        
        [Column("TipoCuentaBancoID")]
        public int? TipoCuentaBancoID { get; set; }
      
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
      
        
        [Column("BancoID")]
        public int? BancoID { get; set; }
      
        
        [Column("BancoNombre")]
        public string BancoNombre { get; set; }
      
        
        [Column("BancoActivo")]
        public bool? BancoActivo { get; set; }


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
