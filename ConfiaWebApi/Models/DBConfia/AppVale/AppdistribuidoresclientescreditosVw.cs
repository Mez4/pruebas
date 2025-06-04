using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppDistribuidoresClientesCreditos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppDistribuidoresClientesCreditos_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("MovCli")]
        public int? MovCli { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("PagosAtrasados")]
        public int? PagosAtrasados { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal? Interes { get; set; }
      
        
        [Column("Seguro")]
        public decimal? Seguro { get; set; }
      
        
        [Column("PagoMod")]
        public decimal? PagoMod { get; set; }


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
