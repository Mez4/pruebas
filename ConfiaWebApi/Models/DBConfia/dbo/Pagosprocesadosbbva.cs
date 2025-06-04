using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.PagosProcesadosBBVA")]
    [ExplicitColumns]
    // No primary key detected
    public class PagosProcesadosBBVA
    {
              
        
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
      
        
        [Column("PagosProcesadoID")]
        public Int64? PagosProcesadoID { get; set; }
      
        
        [Column("SistemaID")]
        public Int64? SistemaID { get; set; }


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
