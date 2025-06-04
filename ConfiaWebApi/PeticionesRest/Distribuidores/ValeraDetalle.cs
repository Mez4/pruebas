using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraDetalle
{
    public class getFoliosByValera
    {
        [Required]
        public int ValeraId { get; set; }
    }

    public class cancelFolio
    {
        [Required]
        public int ValeraId { get; set; }

        [Required]
        public int Folio { get; set; }
    }

    public class getVale
    {
        [Required]
        public long SerieId { get; set; }

        [Required]
        public long ValeCanje { get; set; }
    }
}
