using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.PeticionesRest.Creditos.ClasificadorGrupo
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string Descripcion { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int ClasificadorGrupoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string Descripcion { get; set; }

    }
}
