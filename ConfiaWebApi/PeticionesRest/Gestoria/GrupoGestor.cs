using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Gestoria.GrupoGestor
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }

        [Range(minimum: 0, maximum: 9999999)]
        public Int64 GestorID { get; set; }

        [Range(minimum: 0, maximum: 99999)]

        public int GrupoID { get; set; }

        public bool Permiso { get; set; }

        public int DistribuidorID { get; set; }
    }


    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public Int64 GestorID { get; set; }

        public bool Estatus { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int ClasificadorGrupoID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioCreoID { get; set; }

        public DateTime FechaCreacion { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int GrupoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public Int64 GestorID { get; set; }

        public bool Estatus { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ClasificadorGrupoID { get; set; }

        public int? UsuarioModificoID { get; set; }

        public DateTime? FechaModificacion { get; set; }
    }
}
