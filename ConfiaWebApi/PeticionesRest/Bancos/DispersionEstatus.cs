using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.DispersionEstatus
{
    public class Get
    {
        [Range(minimum: 0, maximum: 255)]
        public int DispersionEstatusID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string DispersionDesc { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int DispersionEstatusID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string DispersionDesc { get; set; }

    }
}
