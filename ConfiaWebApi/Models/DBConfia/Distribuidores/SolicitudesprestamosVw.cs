using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesPrestamos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudesPrestamos_VW
    {
              
        
        [Column("SolicitudPrestamoPersonalID")]
        public int SolicitudPrestamoPersonalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("ContratoID")]
        public Int64? ContratoID { get; set; }
      
        
        [Column("PrestamoSolicitado")]
        public decimal PrestamoSolicitado { get; set; }
      
        
        [Column("PrestamoAutorizado")]
        public decimal? PrestamoAutorizado { get; set; }
      
        
        [Column("PlazoSolicitado")]
        public int? PlazoSolicitado { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("UsuarioSolicitoID")]
        public int? UsuarioSolicitoID { get; set; }
      
        
        [Column("UsuarioSolicito")]
        public string UsuarioSolicito { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("UsuarioAutorizoID")]
        public int? UsuarioAutorizoID { get; set; }
      
        
        [Column("UsuarioAutorizo")]
        public string UsuarioAutorizo { get; set; }
      
        
        [Column("FechaAutorizacion")]
        public DateTime? FechaAutorizacion { get; set; }
      
        
        [Column("UsuarioCanceloID")]
        public int? UsuarioCanceloID { get; set; }
      
        
        [Column("UsuarioCancelo")]
        public string UsuarioCancelo { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("MotivoCancelacion")]
        public string MotivoCancelacion { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }
      
        
        [Column("UsuarioModifica")]
        public string UsuarioModifica { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("personaAcepta")]
        public string personaAcepta { get; set; }
      
        
        [Column("FechaAceptacion")]
        public DateTime? FechaAceptacion { get; set; }


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
            [TableName("Distribuidores.RespHuellas")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RespHuellas
    {
              
        
        [Column("LectorHuellas")]
        public bool LectorHuellas { get; set; }
    }
      
}
