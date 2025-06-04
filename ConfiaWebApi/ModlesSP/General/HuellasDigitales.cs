using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.General.HuellasDigitales
{
    public class ValidarHuellas
    {
        [Column("PersonaID")]
        public Int64 PersonaID { set; get; }

        [Column("FechaRegistro")]
        public DateTime FechaRegistro { set; get; }

        // [Required]
        [Column("UsuarioRegistro")]
        public Int64 UsuarioRegistro { set; get; }

        // [Required]
        [Column("ProductoID")]
        public int ProductoID { set; get; }

        // [Required]
        [Column("SucursalID")]
        public int SucursalID { set; get; }

        [Column("ArrayBits")]
        public byte[] ArrayBits { set; get; }

        [Column("Image64")]
        public string Image64 { set; get; }

        // [Required]
        [Column("Curp")]
        public string Curp { set; get; }
    }
}
