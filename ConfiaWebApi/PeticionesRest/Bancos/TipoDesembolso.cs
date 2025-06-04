using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.TipoDesembolso
{
    public class Get
    {
        [Range(minimum: 0, maximum: 255)]
        public int Id { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        public int ProductoID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string TipoDesembolso { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int TipoMovimientoID { get; set; }

        public bool FormatoImpresionExtra { get; set; } = true;

        public bool RequiereDatosBancarios { get; set; } = false;
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string TipoDesembolso { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int TipoMovimientoID { get; set; }

        public bool FormatoImpresionExtra { get; set; } = true;

        public bool RequiereDatosBancarios { get; set; } = false;
    }
}
