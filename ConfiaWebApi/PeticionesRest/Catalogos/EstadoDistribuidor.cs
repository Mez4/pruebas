using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.EstadoDistribuidor
{
    public class Get
    {
        [MaxLength(1)]
        [MinLength(1)]
        public string EstadoCoordinadorId { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string EstadoCoordinadorId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Color { get; set; }
    }
}