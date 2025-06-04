using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.Movimientos
{
    public class movPol
    {
        public int cuentaContableId { set; get; }

        public string referencia { get; set; }

        public int debeNumero { get; set; }

        public int haberNumero { get; set; }

        public string descripcion { get; set; }

    }
    public class AdmMovs
    {
        [Required]
        public int periodoSeleccionado { get; set; }

        public int tipoOperacion { get; set; }

        public bool tipoMovTransfiere { get; set; }
        public List<movPol> movimientosPoliza { set; get; }
        public int movimientoID { get; set; }

        public string usuarioID { get; set; }

        public int sucursalID { get; set; }

        public int tipoMovimientoID { get; set; }

        public decimal importe { get; set; }

        public string fechaCaptura { get; set; }

        public int cuentaDestinoID { get; set; }

        public int cuentaID { get; set; }

        public int estatus { get; set; }

        public string concepto { get; set; }

        public string fecha { get; set; }

        public string referenciaMovs { get; set; }

    }

    public class DetalleDNI
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999999999999)]
        public int MovimientoID { get; set; }
    }

    public class Add
    {

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int cuentaID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int sucursalId { get; set; }


        [Range(minimum: 0, maximum: 9999)]
        public int? cuentaDestinoID { get; set; }


        [Required]
        public DateTime fechaAfectacion { get; set; }


        [Required]
        public DateTime fechaCaptura { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 999999999)]

        public decimal importe { get; set; }


        [Required]
        [MinLength(5)]
        [MaxLength(80)]
        public string observaciones { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int tipoMovimientoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int productoId { get; set; }

        public string? ObservacionesUsuario { get; set; }


        public Int64? refAPL { get; set; }


        public int? gastoSucursal { get; set; }


        public Int64? movimientoIdTraspaso { get; set; }


        public string cancelacionObservacion { get; set; }


        public Int64? cancelacionUsuario { get; set; }


        public decimal? cancelacionImporte { get; set; }


        public DateTime? cancelacionFhRegistro { get; set; }


        public int? cancelacionTipMovimiento { get; set; }


        public Int64? polizaId { get; set; }

        [Required]
        [MaxLength(1)]
        public string estatus { get; set; }


        public bool? contabilizado { get; set; }


        public int? cajaId { get; set; }

        public int CatEstatusMovID { get; set; }
    }

    public class Update : Add
    {

    }
}
