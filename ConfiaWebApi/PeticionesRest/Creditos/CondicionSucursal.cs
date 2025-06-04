using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CondicionSucursal
{
    public class Get
    {
        public int ProductoID { get; set; }

        public int SucursalID { get; set; }

        public int CondicionesID { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }

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
        public int CondicionesID { get; set; }

    }
    
    public class GuardarCondicionesCsv
    {
        public int UsuarioID { get; set; }

        [Required]
        public string CondicionesList { get; set; }
    } 
}
