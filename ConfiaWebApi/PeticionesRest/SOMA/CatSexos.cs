using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatSexos
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public string SexoID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string SexoID { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Sexo { get; set; }

    }

    public class Update
    {
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string SexoID { get; set; }
        // [Required]
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string Sexo { get; set; }

    }
}
