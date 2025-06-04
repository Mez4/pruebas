using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.EstadoCivil
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
        [MaxLength(1)]
        public string EstadoCivilID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string EstadoCivil { get; set; }

    }

    public class Update
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string EstadoCivilID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string EstadoCivil { get; set; }
    }
}
