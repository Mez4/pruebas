using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.SolicitudReestructurasConvenios")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudRCID")]
    public class SolicitudReestructurasConvenios
    {
              
        
        [Column("SolicitudRCID")]
        public Int64 SolicitudRCID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("QuitaID")]
        public int QuitaID { get; set; }
      
        
        [Column("MontoIntencion")]
        public decimal MontoIntencion { get; set; }
      
        
        [Column("PlazoID")]
        public int PlazoID { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("ProductoID")]
        public Int64 ProductoID { get; set; }
      
        
        [Column("Accion")]
        public int Accion { get; set; }
      
        
        [Column("TipoReestructura")]
        public string TipoReestructura { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Completado")]
        public bool? Completado { get; set; }
      
        
        [Column("TipoHerramientaID")]
        public int TipoHerramientaID { get; set; }
      
        
        [Column("FechaAceptacion")]
        public DateTime? FechaAceptacion { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("ComentariosCancelacion")]
        public string ComentariosCancelacion { get; set; }
      
        
        [Column("ObservacionesAdicionales")]
        public string ObservacionesAdicionales { get; set; }
      
        
        [Column("DNI")]
        public string DNI { get; set; }
      
        
        [Column("PersonaAceptaID")]
        public Int64? PersonaAceptaID { get; set; }
      
        
        [Column("PersonaCancelaID")]
        public Int64? PersonaCancelaID { get; set; }
      
        
        [Column("FechaValidacion")]
        public DateTime? FechaValidacion { get; set; }
      
        
        [Column("PersonaValidaID")]
        public Int64? PersonaValidaID { get; set; }
      
        
        [Column("FechaRechazo")]
        public DateTime? FechaRechazo { get; set; }
      
        
        [Column("PersonaRechazaID")]
        public Int64? PersonaRechazaID { get; set; }
      
        
        [Column("FechaReValidacion")]
        public DateTime? FechaReValidacion { get; set; }
      
        
        [Column("PersonaRevalidaID")]
        public Int64? PersonaRevalidaID { get; set; }
      
        
        [Column("ValidoAnalista")]
        public bool? ValidoAnalista { get; set; }
      
        
        [Column("AnalistaValidaID")]
        public Int64? AnalistaValidaID { get; set; }
      
        
        [Column("FechaValidaAnalista")]
        public DateTime? FechaValidaAnalista { get; set; }


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
