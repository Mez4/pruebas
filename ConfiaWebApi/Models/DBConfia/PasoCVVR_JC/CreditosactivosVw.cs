using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_JC
{
    [TableName("PasoCVVR_JC.CreditosActivos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CreditosActivos_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribCV")]
        public Int64? DistribCV { get; set; }
      
        
        [Column("NombreDistribuidor")]
        public string NombreDistribuidor { get; set; }
      
        
        [Column("SucursalVale")]
        public string SucursalVale { get; set; }
      
        
        [Column("SucursalValeID")]
        public int? SucursalValeID { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("NombreCliente")]
        public string NombreCliente { get; set; }
      
        
        [Column("Nocda")]
        public int? Nocda { get; set; }
      
        
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
