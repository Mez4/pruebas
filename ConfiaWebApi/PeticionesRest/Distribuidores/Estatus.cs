using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.Estatus
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public long DistribuidorID { get; set; }

        [Required]
        public string DistribuidoresEstatusID { get; set; }
    }
}
