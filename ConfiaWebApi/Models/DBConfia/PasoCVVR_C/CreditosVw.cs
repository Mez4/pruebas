using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_C
{
    [TableName("PasoCVVR_C.Creditos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Creditos_VW
    {
              
        
        [Column("DistribuidorCV")]
        public Int64? DistribuidorCV { get; set; }
      
        
        [Column("ClienteVR")]
        public string ClienteVR { get; set; }
      
        
        [Column("ClienteCV")]
        public Int64 ClienteCV { get; set; }
      
        
        [Column("Credito")]
        public int? Credito { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Abonos")]
        public decimal? Abonos { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("Sal_atrasado")]
        public decimal? Sal_atrasado { get; set; }
      
        
        [Column("DiasAtr")]
        public int? DiasAtr { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("ColorEstatus")]
        public string ColorEstatus { get; set; }


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
