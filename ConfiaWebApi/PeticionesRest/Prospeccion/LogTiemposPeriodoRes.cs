/* using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; */
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.LogTiemposPorPantalla
{
	
	public class Info
    {
        [Required]
        public int ProspectoID { get; set; }
		 
        public int res { get; set; }

       
        public string msj { get; set; }
	
		
	}
}