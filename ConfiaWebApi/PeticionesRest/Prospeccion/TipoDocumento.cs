using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumento
{
    public class get
    {
      [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
        
    }

    public class updateCapturaObligatoria
    {
        public int TipoDocumentoID { get; set; }

        [Required]
        public bool CapturaObligatoria { get; set; }

        [Required]
        public Int64 CatalogoTipoDocumentoID { get; set; }

    }

    public class add
    {
        
        [Required]
        public int CatalogoTipoDocumentoID { get; set; }
        
        [Required]
        public int Orden { get; set; }
        
        [Required]
        public bool Activo { get; set; }
    }

    public class update
    {
        [Required]
        public int TipoDocumentoID { get; set; }
    

        [Required]
        public int CatalogoTipoDocumentoID { get; set; }

        [Required]
        public int Orden { get; set; }
        [Required]
        public bool Activo { get; set; }

    }
}
