using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.AppGestion.AppGestion
{
    public class getDetalle
    {
        [Required]
        //[StringLength(15, MinimumLength = 15)]
        public string nombreDelIndicador { get; set; }
    }
}
