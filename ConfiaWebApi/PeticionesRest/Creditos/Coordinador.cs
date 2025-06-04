using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Coordinador
{
    public class Get
    {
        public int Id { get; set; }

        public int SucursalID { get; set; }

    }

    public class Add
    {
        public int PersonaID { get; set; }
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public int ClasificadorGrupoID { get; set; }
    }
    public class Update
    {
        public int SucursalID { get; set; }
        public int CoordinadorID { get; set; }
        public int ClasificadorGrupoID { get; set; }
    }
}