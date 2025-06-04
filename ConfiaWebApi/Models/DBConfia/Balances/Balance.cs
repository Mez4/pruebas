using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.Balance")]
    [ExplicitColumns]
    [PrimaryKey("BalanceID")]
    public class Balance
    {
              
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("NombreBalance")]
        public string NombreBalance { get; set; }
      
        
        [Column("SaldoTotalBalance")]
        public decimal SaldoTotalBalance { get; set; }
      
        
        [Column("Periodo")]
        public int Periodo { get; set; }
      
        
        [Column("Anio")]
        public int Anio { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("Cerrado")]
        public bool Cerrado { get; set; }
      
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }
      
        
        [Column("AgrupacionID")]
        public int AgrupacionID { get; set; }


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
