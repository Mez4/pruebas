// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
using System.Collections.Generic;



public class resultadoConsultaConciliacion
{
    public string mensaje { get; set; }
    public int total { get; set; }

    public List<Datos> datos { set; get; }


    public class Datos
    {
        public int idEF { set; get; }
        public string claveRastreo { set; get; }
        public string conceptoPago { set; get; }
        public string cuentaBeneficiario { set; get; }
        public string cuentaOrdenante { set; get; }
        public string empresa { set; get; }
        public string estado { set; get; }
        public int fechaOperacion { set; get; }
        public int institucionContraparte { set; get; }
        public int institucionOperante { set; get; }
        public int medioEntrega { set; get; }
        public decimal monto { set; get; }
        public string nombreBeneficiario { set; get; }
        public string nombreOrdenante { set; get; }
        public string nombreCep { set; get; }
        public string rfcCep { set; get; }
        public string sello { set; get; }
        public string rfcCurpBeneficiario { set; get; }
        public int referenciaNumerica { set; get; }
        public string rfcCurpOrdenante { set; get; }
        public int tipoCuentaBeneficiario { set; get; }
        public int tipoCuentaOrdenante { set; get; }
        public int tsCaptura { set; get; }
        public int tsLiquidacion { set; get; }
        public string causaDevolucion { set; get; }
        public string urlCEP { set; get; }

    }

}

