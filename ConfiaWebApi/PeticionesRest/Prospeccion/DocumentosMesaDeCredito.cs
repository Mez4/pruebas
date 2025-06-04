using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito
{
    public class      getDocumentos
    {
        public int ProspectoID { get; set; }
    }

    public class GetVerDocumentos
    {
        public int DocumentoID { get; set; }
    }

    public class updateAutorizaDocumeto
    {
        public int DocumentoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
       
    }

    public class updateRechazaDocumento
    {
        public int DocumentoID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateProceso
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateValidarDocumentos
    {
        public int ProspectoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateConfirmarDocumentos
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }
}
