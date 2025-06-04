using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Pagos.CodigoAutorizacion
{
    public class Get
    {
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int AutorizacionTipoID { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public int UsuarioIDUtiliza { get; set; }

        public long Referencia { get; set; }

        public string Observaciones { get; set; }

    }

    public class Update
    {
        [Required]
        public long CodigoAutorizacionID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int AutorizacionTipoID { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public string UsuarioIDUtiliza { get; set; }

        public long Referencia { get; set; }

        public string Observaciones { get; set; }

    }

    public class Cancel
    {
        [Required]
        public long CodigoAutorizacionID { get; set; }
    }
}
