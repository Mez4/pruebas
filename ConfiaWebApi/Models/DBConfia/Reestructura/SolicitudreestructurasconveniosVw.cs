using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.SolicitudReestructurasConvenios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudReestructurasConvenios_VW
    {
              
        
        [Column("SolicitudRCID")]
        public Int64 SolicitudRCID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("Accion")]
        public int Accion { get; set; }
      
        
        [Column("TipoReestructura")]
        public string TipoReestructura { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }
      
        
        [Column("Quincenas")]
        public int? Quincenas { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("PorcientoQuita")]
        public int? PorcientoQuita { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("Completado")]
        public bool? Completado { get; set; }
      
        
        [Column("AnalistaID")]
        public Int64 AnalistaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("FechaAceptacion")]
        public DateTime? FechaAceptacion { get; set; }
      
        
        [Column("PlazoID")]
        public int PlazoID { get; set; }
      
        
        [Column("QuitaID")]
        public int QuitaID { get; set; }
      
        
        [Column("MontoIntencion")]
        public decimal MontoIntencion { get; set; }
      
        
        [Column("ValidoAnalista")]
        public bool? ValidoAnalista { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
