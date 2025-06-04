using System.ComponentModel.DataAnnotations;


namespace ConfiaWebApi.PeticionesRest.Bancos.Cuenta
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }

        public int ProductoID { get; set; }

        public int SucursalId { get; set; }       
    }

    public class Add
    {             
        [Range(minimum: 0, maximum: 9999)]
        public int BancoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(30)]
        public string Cuenta { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(80)]
        public string NombreCuenta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int UsuarioId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string DispersionConvenio { get; set; }

        public bool PuedeDispersar { get; set; } = false;

        [MaxLength(255)]
        public string LogoImg { get; set; }

        public bool activa { get; set; } = false;

        public bool global { get; set; } = false;

        public int orden { get; set; }

        public decimal importeEnBalance { get; set; } 

        public decimal importePendienteBalance { get; set; }

    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int BancoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(30)]
        public string Cuenta { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(80)]
        public string NombreCuenta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int UsuarioId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string DispersionConvenio { get; set; }

        public bool PuedeDispersar { get; set; } = false;

        [MaxLength(255)]
        public string LogoImg { get; set; }

        public bool activa { get; set; } = true;

        public bool global { get; set; } = false;

        public int orden { get; set; }

        public decimal importeEnBalance { get; set; }

        public decimal importePendienteBalance { get; set; }

    }
}
