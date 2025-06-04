using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.SucursalesProteccion
{
    public class Get
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroIDVista { get; set; }



    }

    public class Add
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroID { get; set; }


        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        public List<int> ProductosIDS { get; set; }



    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalProteccionID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        public DateTime FechaCaptura { get; set; }

        public DateTime FechaModifica { get; set; }

    }
}