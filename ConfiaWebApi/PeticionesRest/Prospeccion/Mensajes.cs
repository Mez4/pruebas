using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class getStatusByMensaje
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    
    public class getDocsByStatus
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int idP { get; set; }
    }

    public class checkProceso
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int idP { get; set; }
        [Required]
        public int check { get; set;}
    }

    public class checkDocumuento
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int idP { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int idD { get; set; }

        [Required]
        public int check { get; set; }
    }

    public class add
    {
        [Required]
        public string Mensaje { get; set; }
    }
}
