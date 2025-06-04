using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.TemporalAplicadorCV")]
    [ExplicitColumns]
    [PrimaryKey("IDTemp")]
    public class TemporalAplicadorCV
    {
              
        
        [Column("IDTemp")]
        public Int64 IDTemp { get; set; }
      
        
        [Column("RMPMXPagoID")]
        public Int64? RMPMXPagoID { get; set; }
      
        
        [Column("TRANSACTION_ID")]
        public string TRANSACTION_ID { get; set; }
      
        
        [Column("TRANSACTION_DATE")]
        public string TRANSACTION_DATE { get; set; }
      
        
        [Column("AUTHORIZATION")]
        public string AUTHORIZATION { get; set; }
      
        
        [Column("REFERENCE")]
        public string REFERENCE { get; set; }
      
        
        [Column("fHRegistro")]
        public DateTime? fHRegistro { get; set; }
      
        
        [Column("CVDistribuidorID")]
        public Int64? CVDistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("AMOUNT")]
        public decimal? AMOUNT { get; set; }
      
        
        [Column("AMOUNT_MN")]
        public decimal? AMOUNT_MN { get; set; }
      
        
        [Column("PagoTotal")]
        public decimal? PagoTotal { get; set; }
      
        
        [Column("GenPPI")]
        public bool? GenPPI { get; set; }
      
        
        [Column("PagoIgualado")]
        public bool? PagoIgualado { get; set; }
      
        
        [Column("MontoCPT")]
        public decimal? MontoCPT { get; set; }
      
        
        [Column("EstatusPago")]
        public string EstatusPago { get; set; }
      
        
        [Column("MontoDNI")]
        public decimal? MontoDNI { get; set; }
      
        
        [Column("FechaTraduccion")]
        public DateTime? FechaTraduccion { get; set; }


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
