using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraTrackingEstatus
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        public string TrackingEstatus { get; set; }
        [Required]
        public string Color { get; set; }
        [Required]
        public string Descripcion { get; set; }
    }

    public class Update
    {
        [Required]
        public int ValeraTrackingEstatusID { get; set; }
        [Required]
        public string TrackingEstatus { get; set; }
        [Required]
        public string Color { get; set; }
        [Required]
        public string Descripcion { get; set; }
    }
}
