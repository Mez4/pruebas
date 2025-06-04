using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudesCredito
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int ID { get; set; }
    }
    public class GetSC
    {
        public int SolicitudMesaCreditoID { get; set; }

        public string Asignado_A { get; set; }

        public string Sucursal { get; set; }

        public string Prospecto { get; set; }



    }
    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int16 PersonaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProspectoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(36)]
        public int UsuarioRegistraID { get; set; }

        [Required]
        public DateTime FechaHoraRegistro { get; set; }

        [Required]
        public DateTime FechaHoraResolucion { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EstatusValidacionID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EstatusAsignacionID { get; set; }
    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int ID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int16 PersonaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProspectoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(36)]
        public int UsuarioRegistraID { get; set; }

        [Required]
        public DateTime FechaHoraRegistro { get; set; }

        [Required]
        public DateTime FechaHoraResolucion { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EstatusValidacionID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EstatusAsignacionID { get; set; }
    }
}
