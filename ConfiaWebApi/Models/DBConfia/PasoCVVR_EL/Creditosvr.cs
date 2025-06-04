using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_EL
{
    [TableName("PasoCVVR_EL.CreditosVR")]
    [ExplicitColumns]
    // No primary key detected
    public class CreditosVR
    {
              
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("Nocda")]
        public int? Nocda { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("MovCli")]
        public string MovCli { get; set; }
      
        
        [Column("CveEnc")]
        public string CveEnc { get; set; }
      
        
        [Column("Plazos")]
        public int? Plazos { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("Abonos")]
        public decimal? Abonos { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("Atrasado")]
        public decimal? Atrasado { get; set; }
      
        
        [Column("DiaAtr")]
        public int? DiaAtr { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
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
