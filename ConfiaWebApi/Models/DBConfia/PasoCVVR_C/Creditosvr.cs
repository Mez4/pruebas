using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_C
{
    [TableName("PasoCVVR_C.Creditosvr")]
    [ExplicitColumns]
    // No primary key detected
    public class Creditosvr
    {
              
        
        [Column("fecha")]
        public DateTime? fecha { get; set; }
      
        
        [Column("NoCda")]
        public int? NoCda { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("Plazos")]
        public int? Plazos { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("Abonos")]
        public decimal? Abonos { get; set; }
      
        
        [Column("saldo")]
        public decimal? saldo { get; set; }
      
        
        [Column("Sal_atrasado")]
        public decimal? Sal_atrasado { get; set; }
      
        
        [Column("DiasAtr")]
        public int? DiasAtr { get; set; }
      
        
        [Column("fechaRegistro")]
        public DateTime? fechaRegistro { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }


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
