using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Bonificaciones
{
    public class ObtenerBonificacion
    {
        [Required]
        public decimal PorcentajeBonificacion { get; set; }
    }
    public class ActualizarBonificacion
    {
        [Required]
        public int BonificacionID { get; set; }
        [Required]
        public decimal PorcentajeBonificacion { get; set; }
    }
    public class AltaBonificacion
    {
        [Required]
        public decimal PorcentajeBonificacion { get; set; }
    }
}