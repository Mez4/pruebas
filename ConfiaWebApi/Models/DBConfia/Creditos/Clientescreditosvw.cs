using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ClientesCreditosVw")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ClientesCreditosVw
    {
              
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }


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
