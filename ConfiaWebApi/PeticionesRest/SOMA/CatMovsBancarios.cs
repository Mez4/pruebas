using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatMovsBancarios
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CatTipoMovID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string Clave { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Descripcion { get; set; }

    }

    public class Update
    {
        // [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string Clave { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Descripcion { get; set; }
    }
}
