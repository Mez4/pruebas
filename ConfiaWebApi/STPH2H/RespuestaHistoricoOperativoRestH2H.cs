// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
using System.Collections.Generic;

public class lst
{
    public string claveRastreo { get; set; }
    public string conceptoPago { get; set; }
    public string cuentaBeneficiario { get; set; }
    public string cuentaOrdenante { get; set; }
    public string empresa { get; set; }
    public string estado { get; set; }
    public int fechaOperacion { get; set; }
    public string folioOrigen { get; set; }
    public string idCliente { get; set; }
    public int idEF { get; set; }
    public int institucionContraparte { get; set; }
    public int institucionOperante { get; set; }
    public int medioEntrega { get; set; }
    public double monto { get; set; }
    public string nombreBeneficiario { get; set; }
    public string nombreCEP { get; set; }
    public string nombreOrdenante { get; set; }
    public int prioridad { get; set; }
    public int referenciaNumerica { get; set; }
    public string rfcCEP { get; set; }
    public string rfcCurpBeneficiario { get; set; }
    public string rfcCurpOrdenante { get; set; }
    public string sello { get; set; }
    public int tipoCuentaBeneficiario { get; set; }
    public int tipoCuentaOrdenante { get; set; }
    public int tipoPago { get; set; }
    public string topologia { get; set; }
    public long tsAcuseBanxico { get; set; }
    public long tsCaptura { get; set; }
    public int tsEntrega { get; set; }
    public long tsLiquidacion { get; set; }
    public string usuario { get; set; }
}

public class ResultadoHistoricoOperativo
{
    public int id { get; set; }
    public List<lst> lst { get; set; }
}

public class RespuestaHistoricoOperativo
{
    public ResultadoHistoricoOperativo resultado { get; set; }
}

