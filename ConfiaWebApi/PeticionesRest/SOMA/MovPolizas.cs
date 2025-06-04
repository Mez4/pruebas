using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.MovPolizas
{

    public class MovimientosCont
    {
        public int CuentaOrigenID { set; get; }
        public DateTime FechaCaptura { set; get; }
        public decimal Importe { set; get; }
        public int MovimientoID { set; get; }
        public string NumeroCuenta { set; get; }
        public string NumeroCuentaDestino { set; get; }
        public string Observaciones { set; get; }
        public string Producto { set; get; }
        public string TipoMovimiento { set; get; }
        public int TipoMovimientoID { set; get; }

    }

    public class ContabilizacionDePolizas
    {
        public List<MovimientosCont> movsContabilizar { set; get; }

    }
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int MovimientoPolizaID { get; set; }
    }

    public class Add
    {
        [Range(minimum: 0, maximum: 99999999)]
        public int movimientoPoliza { get; set; }

        [Required]
        [MaxLength(255)]
        public String descripcion { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int cuenta { get; set; }

        [MaxLength(255)]
        public String referencia { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int estatus { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public decimal debe { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public decimal haber { get; set; }

    }
    public class Imprimir
    {
        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int polizaId { get; set; }
    }
    public class Update
    {

        [MaxLength(255)]
        public String descripcion { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int cuenta { get; set; }

        [MaxLength(255)]
        public String referencia { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int estatus { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public decimal debe { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public decimal haber { get; set; }
    }

    public class ObtPolizaCon
    {
        [Required]
        // [Range(minimum: 0, maximum: 99999999)]
        public string FechaInicial { get; set; }

        [Required]
        // [Range(minimum: 0, maximum: 99999999)]
        public string FechaFinal { get; set; }

        [Required]
        // [Range(minimum: 0, maximum: 99999999)]
        public int Producto { get; set; }

        // [Range(minimum: 0, maximum: 99999999)]
        public Nullable<int> TipoMovID { get; set; }

        // [Range(minimum: 0, maximum: 99999999)]
        public Nullable<int> CtaBancoID { get; set; }

    }
}