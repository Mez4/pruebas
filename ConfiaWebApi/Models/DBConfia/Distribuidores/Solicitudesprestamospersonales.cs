using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesPrestamosPersonales")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudPrestamoPersonalID")]
    public class SolicitudesPrestamosPersonales
    {


        [Column("SolicitudPrestamoPersonalID")]
        public int SolicitudPrestamoPersonalID { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("SucursalID")]
        public int SucursalID { get; set; }


        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }


        [Column("ContratoID")]
        public Int64? ContratoID { get; set; }


        [Column("PrestamoSolicitado")]
        public decimal PrestamoSolicitado { get; set; }


        [Column("PrestamoAutorizado")]
        public decimal? PrestamoAutorizado { get; set; }


        [Column("EstatusID")]
        public int EstatusID { get; set; }


        [Column("UsuarioSolicitoID")]
        public int? UsuarioSolicitoID { get; set; }


        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }


        [Column("UsuarioAutorizoID")]
        public int? UsuarioAutorizoID { get; set; }


        [Column("FechaAutorizacion")]
        public DateTime? FechaAutorizacion { get; set; }


        [Column("UsuarioCanceloID")]
        public int? UsuarioCanceloID { get; set; }


        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }


        [Column("MotivoCancelacion")]
        public string MotivoCancelacion { get; set; }


        [Column("Observaciones")]
        public string Observaciones { get; set; }


        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }


        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }


        [Column("SolicitudPersonalDocumentoID")]
        public int? SolicitudPersonalDocumentoID { get; set; }


        [Column("PlazoSolicitado")]
        public int? PlazoSolicitado { get; set; }


        [Column("Interes")]
        public int? Interes { get; set; }


        [Column("InteresFinal")]
        public decimal? InteresFinal { get; set; }


        [Column("ContratoPlanPagos")]
        public Int64? ContratoPlanPagos { get; set; }


        [Column("PrestamoPersonal")]
        public bool? PrestamoPersonal { get; set; }


        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }


        [Column("UsuarioAceptaID")]
        public int? UsuarioAceptaID { get; set; }


        [Column("FechaAceptacion")]
        public DateTime? FechaAceptacion { get; set; }

        [Column("SPEI")]
        public bool? SPEI { get; set; }

        [Column("CambioEfectivo")]
        public bool? CambioEfectivo { get; set; }

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
