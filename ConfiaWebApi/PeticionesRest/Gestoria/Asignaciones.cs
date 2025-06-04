using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Gestoria.Asignaciones
{
    public class responsables
    {
        
        public string Nombre { get; set; }

        public bool ?Zonal { get; set; }
    }

    public class Add
    {
        
        public int ResponsableId { get; set; }

        public bool ?Zonal { get; set; }
        public int ?ZonalID { get; set; }
        public int ?Id { get; set; }
        public int ?GestorID { get; set; }
    }
}
