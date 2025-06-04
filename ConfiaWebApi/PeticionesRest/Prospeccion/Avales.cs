using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Avales
{
    public class getByProspecto
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProspectoID { get; set; }
    }

    public class GetDocs
    {
        public int AvalID { get; set; }
    }

    public class GetDoc
    {
        public int DocumentoID { get; set; }
    }

    public class GetVerDocumentosAvales
    {
        public int DocumentoAvalID { get; set; }
    }
    public class updateConfirmarDocumentosAvales
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateAutorizaDocumetoAval
    {
        public int  DocumentoAvalID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateRechazaDocumetoAval
    {
        public int DocumentoAvalID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateValidarDocumentosAval
    {
        public int ProspectoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class UploadFile
    {
        [Required]
        public string Clave { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public int DocumentoAvalID { get; set; }
        [Required]
        public string NombreDocumento { get; set; }
        [Required]
        public string Orden { get; set; }
        [Required]
        public string PersonaID { get; set; }
        [Required]
        public string Ruta { get; set; }
        [Required]
        public int TipoDocumentoAvalID { get; set; }
        [Required]
        public string TipoPersonaID { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }


          public class updateProcesoAval
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

          public class updateValidaAval
    {
        public int AvalID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
       
    }

     public class updateRechazaAval
    {
        public int AvalID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

         public class updateVerificaAval
    {
        public int ProspectoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
       
    }
          public class updateRechazarAvales
    {
         public int ProspectoID { get; set; }
         public string Nota { get; set; }
         public int regresa { get; set; }
        public string msj { get; set; }
       
    }

        public class getByAvalRefs
    {
        [Range(minimum: 0, maximum: 999999)]
        public int AvalID { get; set; }
    }

        public class updateValidaRefAval
    {
        public int ReferenciaID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

        public class updateRechazaRefAval
    {
        public int ReferenciaID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }


}
