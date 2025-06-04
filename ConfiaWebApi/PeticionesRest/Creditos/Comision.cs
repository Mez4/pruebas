using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Comision
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }
    }
    public class GetComisionOrigen
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }
    }

    public class GetCondicionesFiltro
    {
        public int ProductoID { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Descripcion { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ConvenioID { get; set; }
    }

    public class Update
    {

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Descripcion { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ConvenioID { get; set; }
    }

    public class TraspasoTabulador
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        public int ComisionesID { get; set; }

        public int ComisionesDestinoID { get; set; }
    }

    public class TraspasoTabuladorOrigen
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        public int ComisionesID { get; set; }

        public int ComisionesDestinoID { get; set; }

        public int DistribuidorNivelID { get; set; }

        //public int DistribuidorNivelDestinoID { get; set; }

        public List<int> NivelesDestinoIds { get; set; }
    }
}
