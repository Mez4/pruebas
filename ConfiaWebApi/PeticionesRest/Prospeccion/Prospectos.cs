using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Prospectos
{
    public class get
    {
        // [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
        public int prospecto { get; set; }

    }
    public class getByProspecto
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProspectoID { get; set; }
    }


    public class updateProcesoRefTitular
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class getByProspectoRefTitular
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProspectoID { get; set; }
    }

    public class updateValidaRefTitular
    {
        public int ReferenciaID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateRechazaRefTitular
    {
        public int ReferenciaID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }


    public class updateVerificaReferenciasTitular
    {
        public int ProspectoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateRechazarReferenciasTitular
    {
        public int ProspectoID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }
    public class activo 
    {
        public int Activo { get; set; }
        public string ActivoDesc { get; set; }
    }
    // public class add
    // {

    //     public string Nombre { get; set; }
    //     public string NombreProspecto { get; set; }
    //     public int PersonaAnalistaID { get; set; }
    //     public string NombreAnalista { get; set; }
    //      public string Descripcion { get; set; }

    // }

    // public class update
    // {
    //     // [Required]
    //     public int ProspectoID { get; set; }
    //     public string Nombre { get; set; }
    //     public string NombreProspecto { get; set; }
    //     public int PersonaAnalistaID { get; set; }
    //     public string NombreAnalista { get; set; }
    //     public string Descripcion { get; set; }

    // }
}
