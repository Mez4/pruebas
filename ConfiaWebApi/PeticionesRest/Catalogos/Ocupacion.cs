using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.Ocupacion
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
        [MaxLength(55)]
        public string Ocupacion { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(55)]
        public string Ocupacion { get; set; }
    }
}
