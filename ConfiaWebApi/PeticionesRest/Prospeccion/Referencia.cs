using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Referencia
{
    public class AddReferencia
    {
        [Required]
        public int prospectoID { get; set; }
        public int TipoPersona { get; set; }
        public string Nombre { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string Parentezco { get; set; }
        public int Edad { get; set; }
        public string Celular { get; set; }
        public string Domicilio { get; set; }
    }

    public class saveReferencia
    {
        [Required]
        public int prospectoID { get; set; }
        public int TipoPersona { get; set; }
        public string Nombre { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string Parentesco { get; set; }
        public int Edad { get; set; }
        public string Celular { get; set; }
        public string Domicilio { get; set; }
        public int ReferenciaID { get; set; }
    }

    public class getByAval
    {
        public int AvalID { get; set; }
    }

    public class getByReferenciaID{
        public int ReferenciaID { get; set; }
    }

    public class AddReferenciaAval
    {
        [Required]
        public int PersonaID { get; set; }
        public int TipoPersonaID { get; set; }
        public string Nombre { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string parentesco { get; set; }
        public int Edad { get; set; }
        public string Celular { get; set; }
        public string Domicilio { get; set; }
    }

    public class UpdateReferenciaAval
    {
        [Required]
        public int ReferenciaID { get; set; }
        public int PersonaID { get; set; }
        public int TipoPersonaID { get; set; }
        public string Nombre { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string parentesco { get; set; }
        public int Edad { get; set; }
        public string Celular { get; set; }
        public string Domicilio { get; set; }
    }
}
