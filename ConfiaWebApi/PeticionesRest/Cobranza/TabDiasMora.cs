using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.TabDiasMora
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }
    }

    public class getInicial
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }
    }

    public class add
    {
        public int idTabMora { get; set; }
        public int ProductoID { get; set; }
        public int limInferiorDias { get; set; }
        public int limSuperiorDias { get; set; }
        public int diasMoraCartera { get; set; }
        public Boolean Activo { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class update
    {
        [Required]
        public int idTabMora { get; set; }

        [Required]
        public int ProductoID { get; set; }

        [Required]
        public int limInferiorDias { get; set; }

        [Required]
        public int limSuperiorDias { get; set; }

        [Required]
        public int diasMoraCartera { get; set; }

        [Required]
        public Boolean Activo { get; set; }

        public int regresa { get; set; }
     
        public string msj { get; set; }
    }
}
