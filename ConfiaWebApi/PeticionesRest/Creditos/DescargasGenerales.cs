using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.DescargasGenerales
{
    public class Get
    {
        public int ID { get; set; }

        public string NombreDocumento { get; set; }

        public string Archivo { get; set; }

        public bool Activo { get; set; }
    }
}