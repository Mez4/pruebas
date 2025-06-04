using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.NotasRapidas
{
    public class Add
    {
        public int DistribuidorID { get; set; }

        public string Descripcion { get; set; }

        public int TipoNotaID { get; set; }
    }

    public class GetNotasRapidas
    {
        public int DistribuidorID { get; set; }
    }
}