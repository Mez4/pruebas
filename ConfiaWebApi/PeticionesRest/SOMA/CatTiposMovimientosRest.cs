using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatTiposMovimientosRest
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public string Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(4)]
        public string CveMovimientoID { get; set; }
        // [Required]
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public string TipoMovimiento { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public bool Cargo { get; set; }

        [Required]
        public bool AceptaDepositos { get; set; }

        [Required]
        public bool AceptaRetiros { get; set; }

        [Required]
        public bool Activa { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int MovAgrupaID { get; set; }

        public bool ManejaEfectivo { get; set; }

    }

    public class Update : Add
    {





    }
}
