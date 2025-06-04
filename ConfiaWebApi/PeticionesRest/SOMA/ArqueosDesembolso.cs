using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.ArqueosDesembolso
{
    public class consulta
    {
        public static int TipoHerramientaID { get; internal set; }
        public DateTime FechaInicio { get; set; }
        public int ZonaID { get; set; }
        public int SucursalID { get; set; }
        public int ProductoID { get; set; }
    }

    public class pdf
    {
        public DateTime FechaInicio { get; set; }
        public int ZonaID { get; set; }
        public int SucursalID { get; set; }
        public int ValesCapturados { get; set; }
        public decimal ImporteDesembolsado { get; set; }
        public string Observaciones { get; set; }
        public int ProductoID { get; set; }
    }

    public class TipoUsuarioArqueosDesembolso
    {
        public int usuarioID { get; set; }
        public int tipoUsuario { get; set; }
    }
}