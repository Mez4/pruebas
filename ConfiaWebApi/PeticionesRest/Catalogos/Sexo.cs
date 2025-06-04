using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Catalogos.Sexos
{
    public class get
    {
        public string id { get; set; }
    }

    public class add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }
        [Required]
        public string Sexo { get; set; }
    }

    public class update
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }
        [Required]
        public string Sexo { get; set; }
    }
}
