using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Gerente
{
    public class Add
    {
        public int UsuarioID { get; set; }
        public List<int?> SucursalesIDs { get; set; }
    }
    public class Update
    {
        public List<int?> SucursalesIDs { get; set; }
        public int GerenteID { get; set; }
        public int UsuarioID { get; set; }
        public int ProductoID { get; set; }
    }
}
