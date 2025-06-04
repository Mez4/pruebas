using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.MovimeintosCuentas
{
    [ExplicitColumns]
    // View, no primary key needed
    public class MovimeintosCuentas
    {

        [Column("UsuarioID")]
        public Int64 UsuarioID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }


        [Column("CuentaID")]
        public int CuentaID { get; set; }


        [Column("SucursalId")]
        public int SucursalId { get; set; }

        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }

        [Column("CuentaDestinoID")]
        public int? CuentaDestinoID { get; set; }


        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }


        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }


        [Column("Importe")]
        public decimal Importe { get; set; }


        [Column("Observaciones")]
        public string Observaciones { get; set; }


        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }


        [Column("ProductoId")]
        public int? ProductoId { get; set; }


        [Column("RefApl")]
        public Int64? RefApl { get; set; }


        [Column("gastoSucursal")]
        public int? gastoSucursal { get; set; }


        [Column("movimientoIdTraspaso")]
        public Int64? movimientoIdTraspaso { get; set; }


        [Column("cancelacionObservacion")]
        public string cancelacionObservacion { get; set; }


        [Column("cancelacionUsuario")]
        public Int64? cancelacionUsuario { get; set; }


        [Column("cancelacionImporte")]
        public decimal? cancelacionImporte { get; set; }


        [Column("cancelacionFhRegistro")]
        public DateTime? cancelacionFhRegistro { get; set; }


        [Column("cancelacionTipMovimiento")]
        public int? cancelacionTipMovimiento { get; set; }


        [Column("PolizaId")]
        public Int64? PolizaId { get; set; }


        [Column("Estatus")]
        public string Estatus { get; set; }


        [Column("Contabilizado")]
        public bool? Contabilizado { get; set; }


        [Column("CajaId")]
        public int? CajaId { get; set; }


        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }

        [Column("NombrePersonaRegistro")]
        public string NombrePersonaRegistro { get; set; }

        [Column("PeriodoID")]
        public int PeriodoID { get; set; }


        [Column("ObservacionesUsuario")]
        public string ObservacionesUsuario { get; set; }


        [Column("CatEstatusMovID")]
        public int CatEstatusMovID { get; set; }


        [Column("CreditoID")]
        public int CreditoID { get; set; }

        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }

        [Column("cancelacionUsuarioNombre")]
        public string cancelacionUsuarioNombre { get; set; }

        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }


        [Column("MovimientoBoveda")]
        public bool MovimientoBoveda { get; set; }


        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }


        [Column("EstDsc")]
        public string EstDsc { get; set; }


        [Column("Distribuidor")]
        public string Distribuidor { get; set; }


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }

        [Column("bitAplicado")]
        public bool? bitAplicado { get; set; }

        [Column("bitAplicadoResto")]
        public bool? bitAplicadoResto { get; set; }

        [Column("restoDNI")]
        public decimal? restoDNI { get; set; }

        [Column("FechaBalance")]
        public DateTime? FechaBalance { get; set; }
        
        [Column("BalanceID")]
        public int? BalanceID { get; set; }

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
