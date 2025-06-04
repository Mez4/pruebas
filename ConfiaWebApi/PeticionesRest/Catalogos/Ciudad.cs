using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.Ciudad
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(4)]
        [MaxLength(64)]
        public string ciudadEstadoNombre { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int estadoPaisId { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int ciudadEstadoId { get; set; }

        [Required]
        [MinLength(4)]
        [MaxLength(64)]
        public string ciudadEstadoNombre { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int estadoPaisId { get; set; }
    }
}
