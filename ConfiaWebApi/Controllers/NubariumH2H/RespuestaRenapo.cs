 public class DatosDocProbatorio
    {
        public string entidadRegistro { get; set; }
        public string tomo { get; set; }
        public string claveMunicipioRegistro { get; set; }
        public string anioReg { get; set; }
        public string claveEntidadRegistro { get; set; }
        public string foja { get; set; }
        public string numActa { get; set; }
        public string libro { get; set; }
        public string municipioRegistro { get; set; }
    }

    public class RespuestaRenapo
    {
        public string estatus { get; set; }
        public string codigoValidacion { get; set; }
        public string curp { get; set; }
        public string nombre { get; set; }
        public string apellidoPaterno { get; set; }
        public string apellidoMaterno { get; set; }
        public string sexo { get; set; }
        public string fechaNacimiento { get; set; }
        public string paisNacimiento { get; set; }
        public string estadoNacimiento { get; set; }
        public int docProbatorio { get; set; }
        public DatosDocProbatorio datosDocProbatorio { get; set; }
        public string estatusCurp { get; set; }
        public string codigoMensaje { get; set; }
    }