using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.PeriodosConBalance")]
    [ExplicitColumns]
    // View, no primary key needed
    public class PeriodosConBalance
    {
              
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("ReAbierto")]
        public int? ReAbierto { get; set; }
      
        
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
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("BalanceTempID")]
        public Int64 BalanceTempID { get; set; }


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
