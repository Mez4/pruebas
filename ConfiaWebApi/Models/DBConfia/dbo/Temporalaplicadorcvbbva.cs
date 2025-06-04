using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.TemporalAplicadorCVBBVA")]
    [ExplicitColumns]
    [PrimaryKey("IDTemp")]
    public class TemporalAplicadorCVBBVA
    {
              
        
        [Column("IDTemp")]
        public Int64 IDTemp { get; set; }
      
        
        [Column("PersonaID")]
        public int? PersonaID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("RefPagoID")]
        public Int64? RefPagoID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("FechaPago")]
        public DateTime? FechaPago { get; set; }
      
        
        [Column("FechaIns")]
        public DateTime? FechaIns { get; set; }
      
        
        [Column("FechaArchivo")]
        public DateTime? FechaArchivo { get; set; }
      
        
        [Column("EstatusApp")]
        public string EstatusApp { get; set; }
      
        
        [Column("CorresponsalPagoID")]
        public int? CorresponsalPagoID { get; set; }
      
        
        [Column("EmpresaID")]
        public int? EmpresaID { get; set; }
      
        
        [Column("AplicacionID")]
        public Int64? AplicacionID { get; set; }
      
        
        [Column("FechaAplicacion")]
        public DateTime? FechaAplicacion { get; set; }
      
        
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
      
        
        [Column("MontoDNI")]
        public decimal? MontoDNI { get; set; }


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
