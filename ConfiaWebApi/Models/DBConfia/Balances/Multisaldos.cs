using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldos")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoID")]
    public class MultiSaldos
    {
              
        
        [Column("MultiSaldoID")]
        public Int64 MultiSaldoID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime? FechaCaptura { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("PMultiSaldoID")]
        public int? PMultiSaldoID { get; set; }
      
        
        [Column("CierreDiario")]
        public bool CierreDiario { get; set; }


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
