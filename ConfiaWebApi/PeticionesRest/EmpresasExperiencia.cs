using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.EmpresasExperiencia
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class add
    {
        public string Descripcion { get; set; }

        public bool Activo { get; set; }
    }

    public class update
    {
        [Required]
        public int EmpresaExperienciaID { get; set; }

        [Required]
        public string Descripcion { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
}