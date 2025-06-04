using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spCambiarDireccion
    {
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }


        [Column("Sexo")]
        public string Sexo { get; set; }


        [Column("CURP")]
        public string CURP { get; set; }


        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }


        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }


        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }


        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }


        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }


        [Column("RFC")]
        public string RFC { get; set; }


        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }


        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }


        [Column("DireccionID")]
        public Int64? DireccionID { get; set; }

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

    }
}
