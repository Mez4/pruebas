using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.TiposAclaraciones
{
    public class ActualizarTipoAclaracion
    {
        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public int TipoSolicitudID { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Descripcion { get; set; }
        [Required]
        public string ClaveSolicitud { get; set; }
    }

    public class ActualizarTipoMovimiento
    {
        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public int TipoMovimientoID { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string DescripcionMov { get; set; }
        [Required]
        public string ClaveMovimiento { get; set; }
    }
    public class AltaTipoAclaracion
    {
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Descripcion { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(5)]
        public string ClaveSolicitud { get; set; }
    }

    public class AltaTipoMovimiento
    {
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string DescripcionMov { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(5)]
        public string ClaveMovimiento { get; set; }
    }
    public class ObtenerTipoAclaracion
    {
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Descripcion { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(5)]
        public string ClaveSolicitud { get; set; }
    }
}