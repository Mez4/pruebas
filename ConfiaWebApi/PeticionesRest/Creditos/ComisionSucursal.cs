using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.ComisionSucursal
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        public List<int> SucursalesIds { get; set; }

    }

    public class Update
    {

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }
    }

    public class GuardarComisionesCsv
    {
        public int UsuarioID { get; set; }

        [Required]
        public string ComisionesList { get; set; }
    }    
}
