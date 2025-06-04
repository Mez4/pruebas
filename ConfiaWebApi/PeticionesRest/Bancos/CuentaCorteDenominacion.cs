using System.ComponentModel.DataAnnotations;


namespace ConfiaWebApi.PeticionesRest.Bancos.CuentaCorteDenominacion
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
        [MaxLength(64)]
        public string denomicacionDesc { get; set; }

        [Required]
        public decimal factor { get; set; }

        public bool activo { get; set; } = true;
    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int denominacionId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string denomicacionDesc { get; set; }

        [Required]
        public decimal factor { get; set; }

        public bool activo { get; set; } = true;
    }
}
