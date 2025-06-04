using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.TipoVivienda
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string ViviendaTipo { get; set; }

        public bool Activa { get; set; } = true;
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int ViviendaTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string ViviendaTipo { get; set; }

        public bool Activa { get; set; } = true;
    }
}