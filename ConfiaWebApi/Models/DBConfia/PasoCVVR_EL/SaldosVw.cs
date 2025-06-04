using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_EL
{
    [TableName("PasoCVVR_EL.Saldos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Saldos_VW
    {
              
        
        [Column("IDClienteVR")]
        public string IDClienteVR { get; set; }
      
        
        [Column("IDClienteCV")]
        public Int64? IDClienteCV { get; set; }
      
        
        [Column("NombreCliente")]
        public string NombreCliente { get; set; }
      
        
        [Column("FechaPrimerCanje")]
        public DateTime? FechaPrimerCanje { get; set; }
      
        
        [Column("FechaUltimoCanje")]
        public DateTime? FechaUltimoCanje { get; set; }
      
        
        [Column("DistribuidorIDVR")]
        public Int64? DistribuidorIDVR { get; set; }
      
        
        [Column("DistribuidorIDCV")]
        public Int64? DistribuidorIDCV { get; set; }
      
        
        [Column("SucursalValeID")]
        public int? SucursalValeID { get; set; }
      
        
        [Column("SucursalVale")]
        public string SucursalVale { get; set; }
      
        
        [Column("Nocda")]
        public int? Nocda { get; set; }
      
        
        [Column("MovCli")]
        public string MovCli { get; set; }
      
        
        [Column("NoCreditos")]
        public int? NoCreditos { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("capital")]
        public decimal? capital { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("Atrasado")]
        public decimal? Atrasado { get; set; }
      
        
        [Column("DiaAtr")]
        public int? DiaAtr { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("FecUltimoPago")]
        public DateTime? FecUltimoPago { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }


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
