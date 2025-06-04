using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.sp_Documentos
{
    public class Getsp_Documentos
    {
        public int documentoTipoId { get; set; }

        public int carpetaid { get; set; }
        public string url { get; set; }
    }
    public class Getsp_DocumentosInsert
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }


    public class GetParams 
    {
        public int SolicitudMesaCreditoID { get; set; }

        public int tipo { get; set; }
    }
}
