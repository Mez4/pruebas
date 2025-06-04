using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle
{
        public class get
        {
            [Range(minimum: 0, maximum: 999999)]
            public int id { get; set; }
        }

    public class add
    {
        //[Required]
        //public int MatrizProcesosID { get; set; }

        [Required]
        public Int64 StatusProcesoID { get; set; }

        [Required]
        public bool CapturaObligatoria { get; set; }

        [Required]
        public bool Notificacion { get; set; }
        
        [Required]
        public bool NotaObligatoria { get; set; }
        
        [Required]
        public bool DictamenObligatorio { get; set; }

    }

    public class updateCapturaObligatoria
    {
        [Required]
        public int MatrizProcesosDetalleID { get; set; }

        [Required]
        public bool CapturaObligatoria { get; set; }

        [Required]
        public Int64 StatusProcesoID { get; set; }

    }

    public class updateNotificacion
    {
        [Required]
        public int MatrizProcesosDetalleID { get; set; }

        [Required]
        public bool Notificacion { get; set; }

        [Required]
        public Int64 StatusProcesoID { get; set; }

    }

    public class updateNotaObligatoria
    {
        [Required]
        public int MatrizProcesosDetalleID { get; set; }

         [Required]
        public bool NotaObligatoria { get; set; }

        [Required]
        public Int64 StatusProcesoID { get; set; }

    }

    public class updateDictamenObligatorio
    {
        [Required]
        public int MatrizProcesosDetalleID { get; set; }

        [Required]
        public bool DictamenObligatorio { get; set; }

        [Required]
        public Int64 StatusProcesoID { get; set; }


    }
}

