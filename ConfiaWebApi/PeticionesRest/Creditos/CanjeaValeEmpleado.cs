using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CanjeaValeEmpleado
{

    public class Add
    {

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int EmpleadoId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

       
        public string Motivo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Interes { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Manejocta { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double IVA { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Plazos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

    }

    public class Update
    {

        [Required]
        [Range(minimum: 1, maximum: 9999999999999)]
        public int CreditoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int EmpleadoId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }


        public string Motivo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Interes { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double Manejocta { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public double IVA { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Plazos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

    }
}
