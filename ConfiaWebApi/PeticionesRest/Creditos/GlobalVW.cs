using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.GlobalVW
{
    public class Get
    {
        [Range(0, 9999999999)]
        public int? DirectorID { get; set; }

        [Range(0, 9999999999)]
        public int? ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int? ClienteID { get; set; }

        [Range(0, 9999999999)]
        public int? SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int? ZonaID { get; set; }

        [Range(0, 9999999999)]
        public int? GrupoID { get; set; }

        [Range(0, 9999999999)]
        public int? UsuarioID { get; set; }

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

        [Range(1, 9999)]
        public int? Tipo { get; set; }

        [Range(0, 3)]
        public int? tipoDias { get; set; }
    }

    public class GetAclaraciones
    {

        public int DistribuidorID { get; set; }
    }


}
