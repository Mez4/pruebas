using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.TipoDesembolsoSucursal
{
    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        public List<int> TipoDesembolsoIds { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ProductoID { get; set; }
    }

}
