using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraEstatus
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        public string ValeraEstatusID { get; set; }
        [Required]
        public string ValeraEstatus { get; set; }
        [Required]
        public bool PuedeCanjear { get; set; }
        [Required]
        public bool AsignaUsuario { get; set; }
        [Required]
        public int Orden { get; set; }
    }

    public class Update
    {
        [Required]
        public string ValeraEstatusID { get; set; }
        [Required]
        public string ValeraEstatus { get; set; }
        [Required]
        public bool PuedeCanjear { get; set; }
        [Required]
        public bool AsignaUsuario { get; set; }
        [Required]
        public int Orden { get; set; }
    }
}
