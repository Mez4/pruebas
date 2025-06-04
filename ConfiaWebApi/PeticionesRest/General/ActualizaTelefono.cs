using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.ActualizaTelefono
{
    public class update
    {
        public int DistribuidorID { get; set; }
        public string Telefono { get; set; }
        public int UsuarioIDModifica { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }
    }

}
