using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Parentesco
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
}
