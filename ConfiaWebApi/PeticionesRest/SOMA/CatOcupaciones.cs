using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatOcupaciones
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Ocupacion { get; set; }

    }

    public class Update
    {
        // [Required]
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Ocupacion { get; set; }

    }
}
