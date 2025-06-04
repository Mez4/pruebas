using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Bancos.CajaAplicaciones
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 CajaAplicacionID { get; set; }
    
    }


    public class Add
    {
        [Range(minimum: 0, maximum: 999999999999)]
        public int ReferenciaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }

        [Required]
        public decimal Importe { get; set; }

        [Required]
        [MaxLength(1)]
        public string EstatusAplicacionID { get; set; }

        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 MovimientoID { get; set; }

        [Required]
        public DateTime FHRegistro { get; set; }

        [Required]
        public DateTime FHPago { get; set; }

        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 CreditoID { get; set; }

        [Required]
        public DateTime FechaComision { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int UsuarioID { get; set; }

        [Required]
        public decimal ImporteBonificacionFija { get; set; }

        [Required]
        public Int16 intentosAplicacion { get; set; }


        [MaxLength(500)]
        public string ultimoErrorAplicacion { get; set;  }




    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 CajaAplicacionID { get; set; }

        [Range(minimum: 0, maximum: 999999999999)]
        public int ReferenciaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }

        [Required]
        public decimal Importe { get; set; }

        [Required]
        [MaxLength(1)]
        public string EstatusAplicacionID { get; set; }

        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 MovimientoID { get; set; }

        [Required]
        public DateTime FHRegistro { get; set; }

        [Required]
        public DateTime FHPago { get; set; }

        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 CreditoID { get; set; }

        [Required]
        public DateTime FechaComision { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int UsuarioID { get; set; }

        [Required]
        public decimal ImporteBonificacionFija { get; set; }

        [Required]
        public Int16 intentosAplicacion { get; set; }


        [MaxLength(500)]
        public string ultimoErrorAplicacion { get; set; }
    }
}
