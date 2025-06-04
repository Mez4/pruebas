using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Condicion
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CondicionesID { get; set; }

    }

    public class GetCondicionesFiltro
    {
        public int ProductoID { get; set; }

    }

    public class GetCondicionOrigen
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }
    }

    public class GetCondicionOrigen2
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }
    }

    public class GetSucursales
    {
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CondicionesID { get; set; }

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

    }

    public class Update
    {

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Descripcion { get; set; }

        public bool Activo { get; set; } = true;

    }

    public class TraspasoTabulador
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        public int CondicionesID { get; set; }

        public int CondicionesDestinoID { get; set; }
    }

    public class TraspasoTabuladorOrigen
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        public int CondicionesID { get; set; }

        public int CondicionesDestinoID { get; set; }

        public int DistribuidorNivelID { get; set; }

        public int DistribuidorNivelDestinoID { get; set; }

        public List<int> NivelesDestinoIds { get; set; }

    }
}
