using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.EstadosPais{
    public class Get{
        [Range(minimum:0,maximum:9999)]
        public int estadoPaisId {get; set;}
    }
    public class Add{
        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string estadoPaisNombre{get; set;}

        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string abreviatura{get; set;}

        [Required]
        [MinLength(3)]
        [MaxLength(3)]
        public string estadoPaisCodigo{get; set;}
    }
    public class Update{
        [Range(minimum:0,maximum:9999)]
        public int estadoPaisId {get; set;}

        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string estadoPaisNombre{get; set;}

        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string abreviatura{get; set;}

        [Required]
        [MinLength(3)]
        [MaxLength(3)]
        public string estadoPaisCodigo{get; set;}
    }
    
}