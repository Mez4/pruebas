using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito
{

    public class IngresosParameters
    {
       
        public int idPersona { get; set; }


        public int idTipoPersona { get; set; }

 
        public float ingresoSueldo { get; set; }


        public float gananciasDV { get; set; }

    
        public float ingresoConyuge { get; set; }

 
        public float otrosIngresos { get; set; }

        public float ingresoTotal { get; set; }
    }
}
