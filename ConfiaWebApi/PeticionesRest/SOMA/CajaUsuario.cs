using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.CajaUsuario
{
    public class Get
    {
        public int ProductoID { get; set; }

        [Range(minimum: 0, maximum: 9999999)]
        public int UsuarioID { get; set; }
    }

    public class GetbySuc
    {
        public int ProductoID { get; set; }

        // [Range(minimum: 0, maximum: 9999999)]
        public int UsuarioID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int SucursalID { get; set; }
    }

     public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

        public bool Activo { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioRegistroID { get; set; }

        public DateTime FechaRegistro { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

        public bool Activo { get; set; }
        
        public bool PuedeDesembolsar { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioModificoID { get; set; }

        public DateTime FechaModifico { get; set; }
    }
}