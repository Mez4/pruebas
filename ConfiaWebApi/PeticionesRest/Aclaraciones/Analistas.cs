using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Analistas
{
    public class BusquedaAnalista
    {
        [Required]
        public string Nombre { get; set; }
    }
    public class obtenerAnalista
    {
        [Required]
        public int PersonaID { get; set; }
    }
    public class ActualizarAnalista
    {
        [Required]
        public int AnalistaID { get; set; }
        [Required]
        public int MesaAclaracionID { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class AltaAnalista
    {
        [Required]
        public int AnalistaID { get; set; }
        [Required]
        public int MesaAclaracionID { get; set; }
        [Required]
        public bool Activo { get; set; }
        [Required]
        public int PersonaID { get; set; }
    }
}