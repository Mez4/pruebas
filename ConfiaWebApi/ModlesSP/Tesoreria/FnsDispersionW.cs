using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class FnsDispersionW
    {
        /*  [Column("regresa")]
         public int regresa { get; set; }

         [Column("msj")]
         public string msj { get; set; } */

        /*    [Column("idT")]
           public int idT { get; set; }


           [Column("sucursal")]
           public string sucursal { get; set; }


           [Column("bovedaId")]
           public int bovedaId { get; set; }
    */
        [Column("creditoid")]
        public string creditoid { get; set; }


        [Column("nombre_BENEFICIARIO")]
        public string nombre_BENEFICIARIO { get; set; }

        [Column("rfc_CURP_BENEFICIARIO")]
        public string rfc_CURP_BENEFICIARIO { get; set; }


        [Column("concepto_PAGO")]
        public string concepto_PAGO { get; set; }

        [Column("tipo_CUENTA_BENEFICIARIO")]
        public string tipo_CUENTA_BENEFICIARIO { get; set; }

        [Column("cuenta_BENEFICIARIO")]
        public string cuenta_BENEFICIARIO { get; set; }

        [Column("clave")]
        public string clave { get; set; }

        [Column("referencia_NUMERICA")]
        public string referencia_NUMERICA { get; set; }

        [Column("email_BENEFICIARIO")]
        public string email_BENEFICIARIO { get; set; }

        [Column("monto")]
        public string monto { get; set; }

        [Column("tipo_PAGO")]
        public string tipo_PAGO { get; set; }

        [Column("institucion_CONTRAPARTE")]
        public string institucion_CONTRAPARTE { get; set; }

        [Column("institucion_OPERANTE")]
        public string institucion_OPERANTE { get; set; }

        [Column("empresa")]
        public string empresa { get; set; }

        [Column("clave_RASTREO")]
        public string clave_RASTREO { get; set; }










    }
}
