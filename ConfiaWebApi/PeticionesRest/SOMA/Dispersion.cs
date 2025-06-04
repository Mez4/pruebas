using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.Administracion.Dispersion
{

    public class lArchivoDispersion
    {
        public int consecutivoDia { set; get; }
        public decimal totalDispersion { set; get; }
        public int cantidadMovimientos { set; get; }
        public int estatusArchivoID { set; get; }
        public int catConciliacionID { set; get; }
        public int creditoID { set; get; }
        public string Clave_Rastreo { set; get; }
        public string Concepto_Pago { set; get; }
        public string Cuenta_Benificiario { set; get; }
        public string Email_Beneficiario { set; get; }
        public string Empresa { set; get; }
        public string Institucion_Contraparte { set; get; }
        public string Institucion_Operante { set; get; }
        public decimal Monto { set; get; }
        public string Nombre_Beneficiario { set; get; }
        public string Referencia_Numerica { set; get; }
        public string Rfc_Curp_Benificiario { set; get; }
        public string Tipo_Cuenta_Beneficiario { set; get; }
        public string Tipo_Pago { set; get; }




    }
    public class Save
    {
        public int ProductoID { get; set; }
        public List<lArchivoDispersion> lArchivoDispersion { set; get; }

        public int TipoDesembolsoID { get; set; }


    }

    public class AplicarDisp
    {
        public List<Dispersiones_Aplicar> Dispersiones_Aplicar { set; get; }

    }

    public class Dispersiones_Aplicar
    {
        public string clave_rastreo { set; get; }

        public string estado { set; get; }

        public string cuenta { set; get; }

        public string causa_dev { set; get; }



    }
}
