using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.MesaAclaracion
{
    public class ObtenerMesaAclaracion
    {
        [Required]
        public int MesaAclaracionID { get; set; }
        public string NombreMesaAclaracion { get; set; }
    }
    public class ActualizarMesaAclaracion
    {
        [Required]
        public int MesaAclaracionID { get; set; }
        [Required]
        public string NombreMesaAclaracion { get; set; }
        [Required]
        public string Clave { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class AltaMesaAclaracion
    {
        [Required]
        public string NombreMesaAclaracion { get; set; }
        [Required]
        public string Clave { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
}
