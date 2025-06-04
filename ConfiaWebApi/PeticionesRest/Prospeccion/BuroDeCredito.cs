using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.BuroDeCredito
{
    public class updateConfirmarBuroDeCredito
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }
    public class updateValidarBuroDeCredito
    {
        public int ProspectoID { get; set; }

        public int BuroInternoEstatusID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class ArchivarProspecto
    {
        public int ProspectoID { get; set; }
        public string Motivo { get; set; }
        public int TipoArchivadoID { get; set; }

    }
}
