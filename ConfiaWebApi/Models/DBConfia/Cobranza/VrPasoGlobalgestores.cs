using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.VR_Paso_GlobalGestores")]
    [ExplicitColumns]
    // No primary key detected
    public class VR_Paso_GlobalGestores
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("NombreProducto")]
        public string NombreProducto { get; set; }
      
        
        [Column("Referencia")]
        public int? Referencia { get; set; }
      
        
        [Column("NombreCliente")]
        public string NombreCliente { get; set; }
      
        
        [Column("SucursalCartera")]
        public string SucursalCartera { get; set; }
      
        
        [Column("ImporteT")]
        public decimal? ImporteT { get; set; }
      
        
        [Column("SaldoAct")]
        public decimal? SaldoAct { get; set; }
      
        
        [Column("SaldoAtr")]
        public decimal? SaldoAtr { get; set; }
      
        
        [Column("DiasAtr")]
        public int? DiasAtr { get; set; }
      
        
        [Column("Atrasos")]
        public int? Atrasos { get; set; }
      
        
        [Column("VR_GestorID")]
        public int? VR_GestorID { get; set; }
      
        
        [Column("NombreGestor")]
        public string NombreGestor { get; set; }
      
        
        [Column("LineaCreditoTipoID")]
        public int? LineaCreditoTipoID { get; set; }
      
        
        [Column("FhUltimoPago")]
        public DateTime? FhUltimoPago { get; set; }
      
        
        [Column("FhAsignaGestor")]
        public DateTime? FhAsignaGestor { get; set; }
      
        
        [Column("EstatusCartera")]
        public string EstatusCartera { get; set; }
      
        
        [Column("CobradoPorGestor")]
        public decimal? CobradoPorGestor { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("FechaAlta")]
        public DateTime? FechaAlta { get; set; }
      
        
        [Column("FechaBaja")]
        public DateTime? FechaBaja { get; set; }
      
        
        [Column("Nocda")]
        public Int64? Nocda { get; set; }
      
        
        [Column("NombreTitularCredito")]
        public string NombreTitularCredito { get; set; }
      
        
        [Column("telCel")]
        public string telCel { get; set; }
      
        
        [Column("telCasa")]
        public string telCasa { get; set; }
      
        
        [Column("direccion")]
        public string direccion { get; set; }
      
        
        [Column("CoordinacionNombre")]
        public string CoordinacionNombre { get; set; }
      
        
        [Column("SucursalCarteraAnt")]
        public string SucursalCarteraAnt { get; set; }
      
        
        [Column("CV_GestorID")]
        public int? CV_GestorID { get; set; }
      
        
        [Column("CV_SucursalID")]
        public int? CV_SucursalID { get; set; }
      
        
        [Column("SistemaId")]
        public int? SistemaId { get; set; }
      
        
        [Column("SistemaDsc")]
        public string SistemaDsc { get; set; }


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
