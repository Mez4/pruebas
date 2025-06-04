using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.Banco
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
        [MaxLength(150)]
        public string Nombre { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int ArchivoDispersionID { get; set; }

        //[MaxLength(255)]
        //public string LogoImg { get; set; }

        public IFormFile Logo { get; set; }

        [Required]
        public bool Activo { get; set; } = false;

        public bool EsBanco { get; set; } = false;

    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int BancoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string Nombre { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int ArchivoDispersionID { get; set; }

        //public string LogoImg { get; set; }

        public IFormFile Logo { get; set; }

        [Required]
        public bool Activo { get; set; } = false;

        public bool EsBanco { get; set; } = false;

    }
}
