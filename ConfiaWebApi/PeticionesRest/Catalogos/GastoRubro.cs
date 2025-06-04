using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.GastoRubro
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string gastosRubroDesc { get; set; }

        public bool activo { get; set; } = true;
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int gastosRubrosID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string gastosRubroDesc { get; set; }

        public bool activo { get; set; } = true;
    }
}