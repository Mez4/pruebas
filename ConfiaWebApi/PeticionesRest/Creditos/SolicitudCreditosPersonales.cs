using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.SolicitudCreditosPersonales
{
    public class Aceptar
    {
        public int SolicitudCreditosPersonalesID { get; set; }

        public bool Estatus { get; set; }

        public int ProductoID { get; set; }

        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long Folio { get; set; }

        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long SerieId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ClienteId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        public int CajaID { get; set; }

        public int Capital { get; set; }
        public int Plazos { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        public long? MovimientoID { get; set; }

        public bool PrestamoNomina { get; set; } = false;

        public long VentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }
        public int CuentaId { get; set; }
        public string JsonTda { get; set; }

        public long personasDatosBancariosID { get; set; }
    }

    public class Rechazar
    {
        public int SolicitudCreditosPersonalesID { get; set; }

        public bool Estatus { get; set; }
    }

//Para Prestamo Personal 
    public class AceptarPrestamoPersonal
    {
        public int regresa { get; set; }

        public string msj { get; set; }

        public int CreditoId { get; set; }

        public long MovimientoID { get; set; }

        public int CajaId { get; set; }

        public int ClienteId { get; set; }

        public int TipoDesembolsoID { get; set; }
        
        public long PersonaID { get; set; }
    }
}