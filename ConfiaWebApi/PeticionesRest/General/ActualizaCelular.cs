using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.ActualizaCelular
{
    public class update
    {
        public int DistribuidorID { get; set; }
        public string Celular { get; set; }
        public int UsuarioIDModifica { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class updateRFC
    {
        public int PersonaID { get; set; }
        public string RFC { get; set; }
        public int UsuarioIDModifica { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class updateCurp
    {
        public int PersonaID { get; set; }
        public string Curp { get; set; }
        public int UsuarioIDModifica { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class updateNombre
    {
        public int PersonaID { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public int UsuarioIDModifica { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

}
