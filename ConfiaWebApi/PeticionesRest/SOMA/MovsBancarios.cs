using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.MovBancarios
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CatTipoMovID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CatTipoMovID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaBancoID { get; set; }

        [Required]
        [MaxLength(36)]
        [MinLength(1)]
        public string UsuarioID { get; set; }


        [Required]
        [MaxLength(100)]
        [MinLength(1)]
        public string Concepto { get; set; }

        [Required]
        public bool Conciliado { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int Consecutivo { get; set; }


        [Required]
        [MaxLength(100)]
        [MinLength(1)]
        public string Beneficiario { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public Int64 PolizaID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public Int64 CreditoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public Int64 PersonaID { get; set; }


    }

    public class Update : Add
    {

    }
}
