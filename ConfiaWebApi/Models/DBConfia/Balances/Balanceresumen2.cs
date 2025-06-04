using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.BalanceResumen2")]
    [ExplicitColumns]
    [PrimaryKey("BalanceResumenID")]
    public class BalanceResumen2
    {
              
        
        [Column("BalanceResumenID")]
        public Int64 BalanceResumenID { get; set; }
      
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("CtaBancoId")]
        public int CtaBancoId { get; set; }
      
        
        [Column("CtaBancaria")]
        public string CtaBancaria { get; set; }
      
        
        [Column("CtaContable")]
        public string CtaContable { get; set; }
      
        
        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }
      
        
        [Column("SaldoEdoCuenta")]
        public decimal SaldoEdoCuenta { get; set; }
      
        
        [Column("Diferencia")]
        public decimal Diferencia { get; set; }


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
