using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
//using DBContext.DBConfia.Catalogos;


namespace ConfiaWebApi.PeticionesRest.General.PersonaDatosBancarios
{

    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int personaID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int datoTipoID { get; set; }

        public int CreditoId { get; set; }

        public string datoBancario { get; set; }

        public string telefonia { get; set; }

        public int cveBancoRef { get; set; }


        public int personasDatosBancariosID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int personaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int cveBancoRef { get; set; }

        public string TelefonoMovil { get; set; }

        [Required]
        public List<DatosBancariosTipos> DatosBancarios { get; set; }

        //public Dictionary<int, string> Datos { get; set; }
    }

    public class AddReplace
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int personaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int cveBancoRef { get; set; }

        [Required]
        public string TelefonoMovil { get; set; }

        [Required]
        public int UsuarioModificaID { get; set; }

        [Required]
        public List<DatosBancariosTipos> DatosBancarios { get; set; }

        //public Dictionary<int, string> Datos { get; set; }

    }

    public class DatosBancariosTipos
    {
        public int datoTipoID { get; set; }

        public string datoBancario { get; set; }
    }

    public class addDatosBancarios
    {
        //     pdb.personasDatosBancariosID
        //   ,pdb.personaID
        //   ,pdb.datoTipoID
        //   ,pdb.cveBancoRef
        //   ,pdb.datoBancario
        //   ,pdb.fechaRegistro
        //   ,pdb.activo
        [Required]
        public long personaID { get; set; }
        public int datoTipoID { get; set; }
        // [Required]
        // [Range(minimum: 0, maximum: 99999)]
        public int cveBancoRef { get; set; }

        public string datoBancario { get; set; }
        // public DateTime fechaRegistro { get; set; }
        //  public bool activo { get; set; }
        // [Required]
        // public List<DatosBancariosTipos> DatosBancarios { get; set; } 

        //public Dictionary<int, string> Datos { get; set; }

    }

    public class rmDatosBancarios
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int personasDatosBancariosID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int personaID { get; set; }

        public int cveBancoRef { get; set; }
    }

    public class bloquearCliente
    {
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long ClienteID { get; set; }
    }
}
