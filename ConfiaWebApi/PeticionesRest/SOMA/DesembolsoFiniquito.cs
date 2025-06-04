using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.DesembolsoFiniquito
{
    public class Get  
    {
        [Range(minimum: 0, maximum: 9999999)]
        public int SucursalID  { get; set; }

        [Range(minimum: 0, maximum: 9999999)]
        public int SACId { get; set; }

        [Range(minimum: 0, maximum: 9999999)]
        public int CuentaBancoID { get; set; }

        public bool Todos { get; set; } = false;
    }

    public class CambiarCuenta 
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public long SolicitudID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int CuentaBancoID { get; set; }
    }


    public class Desembolsar
    {
        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public long SolicitudID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int TipoDesembolsoID { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaRegistroID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CajaID { get; set; }
    }
}
