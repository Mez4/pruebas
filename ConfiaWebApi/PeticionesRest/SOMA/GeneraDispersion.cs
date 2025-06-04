using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.GeneraDispersion
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int TipoDesembolsoID { get; set; }

        [Range(0, 9999999999)]
        public int? ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int? ClienteID { get; set; }

        [Range(0, 9999999999)]
        public int? SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int? ZonaID { get; set; }

        [Range(0, 9999999999)]
        public int? EmpresaId { get; set; }

        [Range(0, 9999999999)]
        public int? DistribuidorID { get; set; }

        [Range(0, 9999999999)]
        public int? CoordinadorID { get; set; }

        [Range(0, 9999999999)]
        public int? ContratoID { get; set; }

        [MinLength(0)]
        [MaxLength(1)]
        public string EstatusID { get; set; }

        [Range(0, 9999999999)]
        public int? DistribuidorNivelID { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int UsuarioID { get; set; }

    }


}
