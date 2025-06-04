using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeries
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        public string serie { get; set; }
        [Required]
        public string serieDesc { get; set; }
        [Required]
        public bool activo { get; set; }
        [Required]
        public int ProductoID { get; set; }
        [Required]
        public int ValeraSeriesTiposID { get; set; }
    }

    public class Update
    {
        [Required]
        public int serieId { get; set; }
        [Required]
        public string serie { get; set; }
        [Required]
        public string serieDesc { get; set; }
        [Required]
        public bool activo { get; set; }
        [Required]
        public int ProductoID { get; set; }
        [Required]
        public int ValeraSeriesTiposID { get; set; }
    }
}
