using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosInicialesMigracion")]
    [ExplicitColumns]
    [PrimaryKey("SaldoInicialID")]
    public class SaldosInicialesMigracion
    {
              
        
        [Column("SaldoInicialID")]
        public int SaldoInicialID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Caja")]
        public decimal Caja { get; set; }
      
        
        [Column("Boveda")]
        public decimal? Boveda { get; set; }
      
        
        [Column("ODP")]
        public decimal? ODP { get; set; }


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
