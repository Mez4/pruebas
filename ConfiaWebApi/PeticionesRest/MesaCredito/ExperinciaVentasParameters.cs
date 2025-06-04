using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito
{
    public class ExperinciaVentasParameters
    {
      
        public int idPersona { get; set; }

   
        public int idTipoPersona { get; set; }

        public string nombreEmpresa { get; set; }

      
        public DateTime fechaIngreso { get; set; }


      

        public decimal limiteCredito { get; set; }


   
        public decimal creditoDisponible { get; set; }


        public string status { get; set; }
    }
}
