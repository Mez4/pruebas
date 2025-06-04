using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.CuentaDesembolsoTipo
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int cuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int tipoDesembolsoId { get; set; }

        public bool activo { get; set; } = true;
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int cuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int tipoDesembolsoId { get; set; }

        public bool activo { get; set; } = true;
    }
}
