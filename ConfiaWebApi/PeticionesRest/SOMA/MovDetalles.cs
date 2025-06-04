using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.MovDetalles
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        [Required]
        public int movimientoDetalleID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public Int64 movimientoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public Int64? creditoID { get; set; }


        [Range(minimum: 0, maximum: 9999999)]
        public int? noPago { get; set; }

        public decimal? importe { get; set; }
        [Required]
        public decimal capital { get; set; }


        [Required]
        public decimal interes { get; set; }


        [Required]
        public decimal comision { get; set; }


        [Required]
        public decimal seguro { get; set; }


        [Required]
        public decimal cargo { get; set; }


        [Required]
        public decimal iva { get; set; }


        [Range(minimum: 0, maximum: 9999999)]
        public int? noPagoCan { get; set; }


        public decimal? capitalCan { get; set; }


        public decimal? interesCan { get; set; }


        public decimal? comisionCan { get; set; }


        public decimal? seguroCan { get; set; }


        public decimal? cargoCan { get; set; }


        public decimal? ivaCan { get; set; }


        [Range(minimum: 0, maximum: 9999999)]
        public Int64? polizaMovId { get; set; }


    }

    public class Update : Add
    {

    }
}
