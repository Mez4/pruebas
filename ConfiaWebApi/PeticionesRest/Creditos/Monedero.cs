using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Creditos.Monedero
{
    public class Get
    {
        public int MecanicaID { get; set; }

        public string Descripcion { get; set; }

        public decimal MontoBase { get; set; }

        public decimal MontoRecompensa { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        public int UsuarioIDRegistro { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int UsuarioModificacion { get; set; }

        public DateTime FechaModificacion { get; set; }
    }

    public class GetMecanicaAsignada
    {
        public int ID { get; set; }
        public int MecanicaID { get; set; }

        public int ZonaID { get; set; }

        public int ProductoID { get; set; }

        public int DistribuidorNivelID { get; set; }
    }
}