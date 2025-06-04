using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.sp_Referencias
{
    public class GetReferencias
    {
           public string TipoRefrencia { get; set; }
           public string Prospecto { get; set; }  
           public string Referencia { get; set;  }
           public string parentesco { get; set; }  
           public Int64 celular { get; set; } 
           public string domicilio { get; set; } 
           public int edad { get; set; }
    
    }
    public class GetParams 
    {
     public int SolicitudMesaCreditoID { get; set; }
     public int TipoPersonaid { get; set; }
     public int Tipo { get; set; }
    }
    public class GetReferenciasInsert 
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }
}
