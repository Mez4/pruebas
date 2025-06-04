using Org.BouncyCastle.Crypto.Tls;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string documentosTipoNombre { get; set; }
        public bool soloIMG { get; set; }
        public bool activo { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string claveDoc { get; set; }
        public int ordenSistema { get; set; } 
    }

    public class Update
    {
        [Required]
        [Range(minimum:1, maximum:9999)]
        public int documentosTipoId { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string documentosTipoNombre { get; set; }
        public bool soloIMG { get; set; }
        public bool activo { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(12)]
        public string claveDoc { get; set; }
        public int ordenSistema { get; set; }
    }
}
