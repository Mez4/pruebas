using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.sp_Verifica
{
    public class GetVerifica
    {
        public int ID { get; set; }
        public DateTime fechaNacimiento { get; set; }
        public Int64 telefono { get; set; }
        public Int64 celular { get; set; }
        public string Domicilio_Prospecto { get; set; }
        public string Ocupacion { get; set; }
        public string ExperienciaVentas { get; set; }

    }

    public class GetParams
    {
        public int SolicitudMesaCreditoID { get; set; }
      
        public int Tipo { get; set; }

        public int TipoPersonaid { get; set; }
    }

    public class GetVerificaInsert
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }
}
