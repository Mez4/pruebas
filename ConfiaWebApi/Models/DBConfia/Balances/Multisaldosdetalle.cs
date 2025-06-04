using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldosDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoDetalleID")]
    public class MultiSaldosDetalle
    {
              
        
        [Column("MultiSaldoDetalleID")]
        public Int64 MultiSaldoDetalleID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("PeriodoID")]
        public string PeriodoID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NombreBanco")]
        public string NombreBanco { get; set; }
      
        
        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SaldoAceptado")]
        public decimal SaldoAceptado { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("Cargos")]
        public decimal Cargos { get; set; }
      
        
        [Column("SaldoSinAceptar")]
        public decimal SaldoSinAceptar { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Impreso")]
        public bool Impreso { get; set; }
      
        
        [Column("MultiSaldoID")]
        public Int64? MultiSaldoID { get; set; }
      
        
        [Column("IDT")]
        public Int64? IDT { get; set; }
      
        
        [Column("Cont")]
        public Int64? Cont { get; set; }


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
