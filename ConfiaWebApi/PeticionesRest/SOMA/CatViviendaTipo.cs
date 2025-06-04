using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatViviendaTipo
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public string ViviendaTipiId { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string ViviendaTipo { get; set; }
        [Required]
        public bool Activa { get; set; }

    }

    public class Update : Add
    {


    }
}
