using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.RespuestasPersonalizadas.RENAPO.DatosCURP
{
    public class GetInfo
    {
        public string birthdate { get; set; }
        public string curp { get; set; }
        public string entity_birth { get; set; }
        public string mothers_maiden_name { get; set; }
        public string names { get; set; }
        public string paternal_surname { get; set; }
        public string probation_document { get; set; }
        public ProbationDocumentData probation_document_data { get; set; }
        public bool renapo_valid { get; set; }
        public string sex { get; set; }
        public string status_curp { get; set; }
        public string transaction_id { get; set; }
    }

    public class ProbationDocumentData
    {
        public string anioReg { get; set; }
        public string claveEntidadRegistro { get; set; }
        public string claveMunicipioRegistro { get; set; }
        public string entidadRegistro { get; set; }
        public string foja { get; set; }
        public string libro { get; set; }
        public string municipioRegistro { get; set; }
        public string numActa { get; set; }
        public string tomo { get; set; }
    }
}
