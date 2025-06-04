using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal
{
    public class Sucursales
    {
        public int AnalistaID { set; get; }

        public int SucursalID { set; get; }

        public int Estatus { set; get; }
    }
    public class guardarSucursalesAnalista
    {
        [Required]
        public List<Sucursales> Sucursales { set; get; }
    }
}