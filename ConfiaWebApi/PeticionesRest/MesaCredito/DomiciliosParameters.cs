using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito
{
    public class DomiciliosParameters
    {
       
        public int idPersona { get; set; }

       
        public int idTipoPersona { get; set; }

       
        public string calle { get; set; }

      
        public string numeroInterior { get; set; }

      
        public string numeroExterior { get; set; }

       
        public string colonia { get; set; }

        
        public string localidad { get; set; }

       
        public string cp { get; set; }


       
        public string municipio { get; set; }

       
        public string estado { get; set; }
    }
}
