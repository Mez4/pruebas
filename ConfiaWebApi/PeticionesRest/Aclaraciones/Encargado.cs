using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Encargado
{
    public class BusquedaEncargado
    {
        [Required]
        public string Nombre { get; set; }
    }
    public class obtenerEncargado
    {
        [Required]
        public int EncargadoID { get; set; }
    }
    public class ActualizarEncargado
    {
        public int EncargadoID { get; set; }
        public int MesaAclaracionID { get; set; }
        public bool Activo { get; set; }
    }
    public class AltaEncargado
    {
        [Required]
        public int EncargadoID { get; set; }

        [Required]
        public bool Activo { get; set; }
        [Required]
        public int PersonaID { get; set; }
    }
}