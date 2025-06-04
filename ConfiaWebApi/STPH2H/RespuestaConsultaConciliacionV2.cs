// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
using System.Collections.Generic;



public class resultadoConsultaConciliacionv2
{
    public string mensaje { get; set; }
    public int estado { get; set; }

    public List<Datos> datos { set; get; }
    public class Datos
    {
        public int idEF { get; set; }
        public string claveRastreo { get; set; }
        public string claveRastreoDevolucion { get; set; }
        public string conceptoPago { get; set; }
        public string cuentaBeneficiario { get; set; }
        public string cuentaOrdenante { get; set; }
        public string empresa { get; set; }
        public string estado { get; set; }
        public int? fechaOperacion { get; set; }
        public int? institucionContraparte { get; set; }
        public int? institucionOperante { get; set; }
        public int medioEntrega { get; set; }
        public double monto { get; set; }
        public string nombreBeneficiario { get; set; }
        public string nombreOrdenante { get; set; }
        public string nombreCep { get; set; }
        public string rfcCep { get; set; }
        public string sello { get; set; }
        public string rfcCurpBeneficiario { get; set; }
        public int? referenciaNumerica { get; set; }
        public string rfcCurpOrdenante { get; set; }
        public int? tipoCuentaBeneficiario { get; set; }
        public int? tipoCuentaOrdenante { get; set; }
        public int? tipoPago { get; set; }
        public long? tsCaptura { get; set; }
        public long? tsLiquidacion { get; set; }
        public int? causaDevolucion { get; set; }
        public string urlCEP { get; set; }

        public bool? conciliado { get; set; }

    }

}

