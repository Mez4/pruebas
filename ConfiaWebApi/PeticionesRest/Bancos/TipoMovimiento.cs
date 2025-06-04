using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.TipoMovimiento
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
        [MaxLength(4)]
        public string CveMovimientoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string TipoMovimiento { get; set; }

        public bool Cargo { get; set; } = true;

        public bool usuario { get; set; } = true;
    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(4)]
        public string CveMovimientoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string TipoMovimiento { get; set; }


        public bool Cargo { get; set; } = true;

        public bool usuario { get; set; } = true;
    }
}
