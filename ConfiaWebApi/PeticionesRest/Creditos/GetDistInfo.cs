using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.GetDistInfo
{

   public class GetDistribuidorInfo
    {

        [Range(0, 9999999999)]
        public int DistribuidorID { get; set; }

        
    }

}
