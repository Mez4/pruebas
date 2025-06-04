using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales
{
    public class getAll
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CorresponsalID;
    }

    public class AgregarCorresponsales
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CorresponsalID { get; set;}

        [Required]
        public string Nombre { get; set;}

        [Required]
        public string TipoConciliacion { get; set;}

        [Range(minimum: 0, maximum: 9999)]
        public int TipoComisionID { get; set;}

        [Required]
        public bool Activo { get; set;}

        [Required]
        public decimal MontoCorte { get; set;}

        [Required]
        public decimal MontoFijo { get; set;}

        public DateTime? Modificado { get; set;}
    }

    public class ActualizarCorresponsales : AgregarCorresponsales {}

    public class AgregarCorresponsalesTipoComiison {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoComisionID { get; set; }

        [Required]
        public string TipoComision { get;set; }

        [Required]
        public bool TipoPorcentaje { get;set; }

        [Required]
        public bool TipoMontoFijo { get; set; }

        [Required]
        public bool TipoMontoCorte { get; set; }
    }

    public class ActualizarCorresponsalesTipoComiison : AgregarCorresponsalesTipoComiison {}
}