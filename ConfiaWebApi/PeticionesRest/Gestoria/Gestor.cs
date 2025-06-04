using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Gestoria.Gestor
{
    public class Get
    {
        public int SucursalID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string Gestor { get; set; }

        public bool Activo { get; set; } = true;

    }

    public class GetGestor
    {

        public Int64 DistribuidorID { get; set; }

        public string NombreCompleto { get; set; }

        public string Nombre { get; set; }

        public DateTime FechaActualiza { get; set; }


        public string NombreGestor { get; set; }


    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int GestorID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string Gestor { get; set; }

        public bool Activo { get; set; } = true;

    }
}
