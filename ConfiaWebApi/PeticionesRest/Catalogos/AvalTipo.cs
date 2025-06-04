using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.AvalTipo
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
        [MaxLength(30)]
        public string avalTipo { get; set; }

        [Required]
        public bool activo { get; set; } = true;

        [Required]
        [MinLength(4)]
        [MaxLength(100)]
        public string color { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int avalTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(30)]
        public string avalTipo { get; set; }

        [Required]
        public bool activo { get; set; } = true;

        [Required]
        [MinLength(4)]
        [MaxLength(100)]
        public string color { get; set; }
    }
}
