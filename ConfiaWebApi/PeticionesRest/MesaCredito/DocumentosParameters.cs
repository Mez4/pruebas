using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito
{
    public class DocumentosParameters
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int documentoTipoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int carpetaId { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string url { get; set; }

        [Required]
        public DateTime fechaAlta { get; set; }

        [Required]
        public DateTime fechaMod { get; set; }

        [Required]
        public DateTime fechaBaja { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int usuarioID { get; set; }

        [Required]
        public bool activo { get; set; }
    }
}
