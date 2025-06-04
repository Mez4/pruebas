using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.CredCreditos
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CreditoID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(1, 999999)]
        public Int64 ContratoID { get; set; }

        [Required]
        [Range(1, 999999)]
        public Int64 CreditoID { get; set; }

        [MaxLength(1)]
        [MinLength(1)]
        [Required]
        public string EstatusID { get; set; }

        [Required]
        [Range(1, 99999)]
        public Int64 ClienteID { get; set; }

        [Required]
        [Range(1, 99999)]
        public int Plazos { get; set; }

        [Required]
        [Range(1, 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(1, 99999)]
        public int CondicionesID { get; set; }

        [Required]
        [Range(1, 99999)]
        public int CondicionesRenglonId { get; set; }

        [Required]
        [Range(1, 99999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(1, 99999)]
        public int DistribuidorNivelID { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal Capital { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal Interes { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal ManejoCuenta { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal Seguro { get; set; }
        [Required]
        [Range(1, 9999999)]
        public decimal Cargo { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal IVA { get; set; }

        [Range(1, 9999999)]
        public decimal ImporteTotal { get; set; }

        [Required]
        [Range(1, 9999999)]
        public decimal Abonos { get; set; }

        [Range(1, 9999999)]
        public decimal Comision { get; set; }

        [Range(1, 9999999)]
        public decimal SaldoActual { get; set; }

        [Range(1, 9999999)]
        public int DiasAtraso { get; set; }

        [Required]
        [Range(1, 9999999)]
        public int DiasAtrasoMaximo { get; set; }

        [Required]
        public decimal SaldoAtrasado { get; set; }


        [Required]
        public DateTime FechaHoraRegistro { get; set; }


        public DateTime? FechaHoraDesembolso { get; set; }


        public DateTime? FechaHoraUltimoPago { get; set; }

        [Range(1, 9999999)]
        public Int64? SerieId { get; set; }

        [Range(1, 9999999)]
        public Int64? ValeCanje { get; set; }


        [Required]
        public decimal CapitalPagado { get; set; }


        public decimal? CapitalPendientes { get; set; }


        [MaxLength(999999)]
        [MinLength(1)]
        [Required]
        public int UsuarioIDRegistro { get; set; }

        [Range(1, 9999999)]
        public Int64? MovimientoID { get; set; }


        [Range(1, 9999999)]
        public int PagosAtrasados { get; set; }


        [Range(1, 9999999)]
        public int? TipoDesembolsoID { get; set; }

        [Required]
        public decimal InteresPagado { get; set; }

        [Required]
        public decimal IVAPagado { get; set; }

        [Required]
        public decimal ManejoCuentaPagado { get; set; }

        [Required]
        public decimal SeguroPagado { get; set; }

        [Required]
        public decimal CargoPagado { get; set; }

        public decimal? PorcCapital { get; set; }

        public decimal? PorcInteres { get; set; }

        public decimal? PorcManejoCuenta { get; set; }


        public decimal? PorcCargo { get; set; }


        public decimal? PorcIVA { get; set; }

        public decimal? PorcSeguro { get; set; }

        [Required]
        [Range(1, 9999999)]
        public int MotivoCancelacionID { get; set; }


        [Required]
        public decimal TasaInteres { get; set; }


        [Required]
        public decimal TasaIVA { get; set; }


        [Required]
        public decimal CostoSeguroPlazo { get; set; }

        [Range(1, 9999999)]
        public Int64? DispersionID { get; set; }


        [Required]
        public bool PuedeDispersar { get; set; }


        [Required]
        public decimal CostoSeguroDistribuidorXMil { get; set; }


        public DateTime? PrimerVencimiento { get; set; }


        public DateTime? UltimoVencimiento { get; set; }


        [Required]
        [Range(1, 9999999)]

        public int PlazosAdicionales { get; set; }


        public DateTime? FHGeneracionPlazosAdicionales { get; set; }


        [Range(1, 9999999)]
        public int? LineaAdicionalTipoID { get; set; }


        [Range(1, 9999999)]
        public Int64? referenciaMigracion { get; set; }


        [Required]
        [Range(1, 9999999)]
        public int creditoClasificacionId { get; set; }


        public DateTime? fechaPP { get; set; }



        [Required]
        public decimal primaSeguro { get; set; }


        [Required]
        public decimal capitalPendienteDisponible { get; set; }


        public DateTime? fechaHoraActivacion { get; set; }


        [Required]
        public decimal pagoModa { get; set; }


        [Required]
        [Range(1, 9999999)]
        public Int64 PersonaIDRegistro { get; set; }


        public bool? Reestructura { get; set; }


        [Range(1, 9999999)]
        public Int64? ReestructuraCreditoID { get; set; }


        // ###############################################


    }
    public class Update : Add
    {

    }

    public class UpdatePersona
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CreditoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int PersonaID { get; set; }
    }


}