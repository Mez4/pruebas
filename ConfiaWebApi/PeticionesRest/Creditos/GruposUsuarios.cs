using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.GruposUsuarios
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int UsuarioID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int GrupoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

        public bool Estatus { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioCreoID { get; set; }

        public DateTime FechaCreacion { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int GrupoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

        public bool Estatus { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioModificoID { get; set; }

        public DateTime FechaModificacion { get; set; }
    }
}
