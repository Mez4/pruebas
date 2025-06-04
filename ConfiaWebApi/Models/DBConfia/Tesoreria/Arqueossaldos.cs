using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosSaldos")]
    [ExplicitColumns]
    [PrimaryKey("SaldoArqueoID")]
    public class ArqueosSaldos
    {
              
        
        [Column("SaldoArqueoID")]
        public int SaldoArqueoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("Total")]
        public decimal Total { get; set; }
      
        
        [Column("ArqueoID")]
        public int ArqueoID { get; set; }
      
        
        [Column("CveMovDesc")]
        public string CveMovDesc { get; set; }


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
