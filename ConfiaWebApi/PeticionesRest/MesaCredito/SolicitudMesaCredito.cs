using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito
{
    public class Get
    {
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string EstatusValidacion { get; set; }

        public string FechaHoraRegistro { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 PersonaID { get; set; }

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
        public int GrupoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 CreditoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 PersonaRegistraID { get; set; }
    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int SolicitudMesaCreditoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 PersonaID { get; set; }

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
        public int GrupoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 CreditoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64 PersonaRegistraID { get; set; }
    }


    public class Respuesta
    {

        public int SolicitudMesaCreditoID { get; set; }
        public string Nombre { get; set; }
        public string Producto { get; set; }
        public string Sucursal { get; set; }
        public string UsuarioRegistra { get; set; }
        public DateTime FechaHoraRegistro { get; set; }
        public DateTime FechaHoraResolucion { get; set; }
        public string EstatusValidacion { get; set; }
        public string Grupo { get; set; }
        public int CreditoID { get; set; }
        public string PersonaRegistra { get; set; }


    }

}
