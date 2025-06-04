using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.ImprimirArqueosDesembolso
{
    public class consulta
    {
        public DateTime FechaInicio { get; set; }
        public int ZonaID { get; set; }
        public int SucursalID { get; set; }
        public int ProductoID { get; set; }
    }

    public class pdf
    {
        public int ArqueosDesembolsoID { get; set; }
        public int ProductoID { get; set; }
        public DateTime Fecha { get; set; }
        public int SucursalID { get; set; }

    }

    public class Cancelacion
    {
        public int ArqueosDesembolsoID { get; set; }

    }
}