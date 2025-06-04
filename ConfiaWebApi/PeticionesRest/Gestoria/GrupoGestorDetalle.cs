using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.Distribuidores;

namespace ConfiaWebApi.PeticionesRest.Gestoria.GrupoGestorDetalle
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public Int64 DistribuidorID { get; set; }

        public int ProductoID { get; set; }

        public int SucursalID { get; set; }
    }

    public class GetDistribuidores
    {
        public int GrupoID { get; set; }
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public int tipoUsuario { get; set; }
    }

    public class AddMany
    {
        [Required]
        public int UsuarioID { get; set; }

        [Required]
        public List<int> Distribuidores { get; set; }

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
        public Int64 DistribuidorID { get; set; }

        public bool Estatus { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioModificoID { get; set; }

        public DateTime FechaModificacion { get; set; }
    }

    public class Traspasar
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int GrupoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int GrupoDestinoID { get; set; }

        [Required]
        public List<int> Distribuidores { get; set; }

        [Required]
        public int SucursalID { get; set; }
        [Required]
        public int tipotraspaso { get; set; }
        [Required]
        public string motivo { get; set; }
    }
}
