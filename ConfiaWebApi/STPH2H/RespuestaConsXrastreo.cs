// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
using System.Collections.Generic;

public class OrdenPago
{
    public int causaDevolucion { get; set; }
    public string claveRastreo { get; set; }
    public string conceptoPago { get; set; }
    public string folioOrigen { get; set; }
    public string cuentaBeneficiario { get; set; }
    public string cuentaOrdenante { get; set; }
    public string empresa { get; set; }
    public string estado { get; set; }
    public int fechaOperacion { get; set; }
    public int idEF { get; set; }
    public int institucionContraparte { get; set; }
    public int institucionOperante { get; set; }
    public int medioEntrega { get; set; }
    public decimal monto { get; set; }
    public string nombreBeneficiario { get; set; }
    public string nombreCEP { get; set; }
    public string nombreOrdenante { get; set; }
    public int prioridad { get; set; }
    public int referenciaNumerica { get; set; }
    public string rfcCEP { get; set; }
    public string rfcCurpBeneficiario { get; set; }
    public string rfcCurpOrdenante { get; set; }
    public int tipoCuentaBeneficiario { get; set; }
    public int tipoCuentaOrdenante { get; set; }
    public string sello { get; set; }
    public int tipoPago { get; set; }
    public string topologia { get; set; }
    public long tsCaptura { get; set; }
    public long tsLiquidacion { get; set; }
    public string urlCEP { get; set; }
    public string usuario { get; set; }
}

public class resultadoConXrastreo
{
    public int id { get; set; }
    public OrdenPago ordenPago { get; set; }
}

public class RespuestaConsXrastreo
{
    public resultadoConXrastreo resultado { get; set; }
}

