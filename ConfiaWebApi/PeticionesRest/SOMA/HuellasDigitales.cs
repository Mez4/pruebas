using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.HuellasDigitales
{
    public class ValidarHuellaVsBD
    {
        public String Image64 { set; get; }
        public int ProductoID { set; get; }
        public String Curp { set; get; }
        public int SucursalID { set; get; }
    }
    public class Post
    {
        public Int64 PersonaID { set; get; }
        public DateTime FechaRegistro { set; get; }

        // [Required]
        public Int64 UsuarioRegistro { set; get; }

        // [Required]
        public int ProductoID { set; get; }

        // [Required]
        public int SucursalID { set; get; }

        [Required]
        public byte[] ArrayBits { set; get; }

        public string Image64 { set; get; }

        // [Required]
        public string Curp { set; get; }
    }

    public class Get
    {
        public string Image64 { set; get; }

        public int ProductoID { set; get; }

        public int SucursalID { set; get; }
    }
}
