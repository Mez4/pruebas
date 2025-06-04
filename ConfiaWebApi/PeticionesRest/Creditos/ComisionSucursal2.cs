using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.ComisionSucursal2
{
    public class Get
    {
        public int ProductoID { get; set; }

        public int SucursalID { get; set; }

        public int ComisionesID { get; set; }

    }

    public class Add
    {
        public int ProductoID { get; set; }

        public int SucursalId { get; set; }

        public int ComisionesID { get; set; }

        // public List<int> SucursalesIds { get; set; }


    }

    public class Update
    {

        public int ProductoID { get; set; }

        public int SucursalId { get; set; }

        public int ComisionesID { get; set; }

    }
}