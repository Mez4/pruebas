using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Cajas
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Descripcion { get; set; }

        [Required]
        [Range(1, 999999)]
        public int SucursalID { get; set; }

        [Required]
        public bool Estatus { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(8)]
        [MinLength(1)]
        public string Clave { get; set; }




        public Boolean CanalesCobranza { get; set; }


        public Array tipoOperacion { get; set; }

    }

    public class Actualizar : Agregar
    {

        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

    }

    public class algo
    {
        public string Clave { get; set; }

        public string Descripcion { get; set; }

        public Int64 SolicitudDetalleID { get; set; }

        public int SolicitudGastoID { get; set; }

        public int RubroGastosID { get; set; }


        public decimal Total { get; set; }

        public bool Revisado { get; set; }

        public bool Aceptado { get; set; }

        public string Observaciones { get; set; }
    }
}
