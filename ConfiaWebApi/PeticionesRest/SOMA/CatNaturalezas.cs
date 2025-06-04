using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatNaturalezas
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaID { get; set; }
    }

    public class Add
    {

        [Required]
        [MinLength(1)]
        [MaxLength(40)]
        public string Descripcion { get; set; }

    }

    public class Update : Add
    {
        // [Required]


    }
}
