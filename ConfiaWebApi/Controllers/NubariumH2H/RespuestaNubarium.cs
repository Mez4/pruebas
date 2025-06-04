// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
public class RespuestaNubarium
{
    public string tipo { get; set; }
    public string subTipo { get; set; }
    public string folio { get; set; } = "";
    public string edad { get; set; } = "0";
    public string claveElector { get; set; }
    public string curp { get; set; }
    public string registro { get; set; }
    public string estado { get; set; } = "";
    public string municipio { get; set; } = "";
    public string seccion { get; set; }
    public string localidad { get; set; } = "";
    public string emision { get; set; }
    public string vigencia { get; set; }
    public string fechaNacimiento { get; set; }
    public string primerApellido { get; set; }
    public string segundoApellido { get; set; }
    public string nombres { get; set; }
    public string sexo { get; set; }
    public string calle { get; set; }
    public string colonia { get; set; }
    public string ciudad { get; set; }
    public string codigoValidacion { get; set; }
    public string codigoBarras { get; set; } = "";
    public string mrz { get; set; }
    public string cic { get; set; }
    public string ocr { get; set; }
    public string identificadorCiudadano { get; set; } = "";
    public ValidacionMRZ validacionMRZ { get; set; } = new ValidacionMRZ();
}

public class ValidacionMRZ
{
    public ValidacionMRZ()
    {
        fechaNacimiento = "";
        sexo = "";
        vigencia = "";
        emision = "";
        cic = "";
        nombre = "";
    }
    public string fechaNacimiento { get; set; }
    public string sexo { get; set; }
    public string vigencia { get; set; }
    public string emision { get; set; }
    public string cic { get; set; }
    public string nombre { get; set; }
}



