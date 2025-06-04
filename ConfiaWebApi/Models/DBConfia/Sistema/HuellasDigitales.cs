using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.HuellasDigitales")]
    [ExplicitColumns]
    [PrimaryKey("Curp,ProductoID", AutoIncrement=false)]
    public class HuellasDigitales
    {
        [Column("PersonaID")]
        public Int64 PersonaID { set; get; }


        [Column("FechaRegistro")]
        public DateTime FechaRegistro { set; get; }


        [Column("UsuarioRegistro")]
        public Int64 UsuarioRegistro { set; get; }


        [Column("ProductoID")]
        public int ProductoID { set; get; }

        [Column("SucursalID")]
        public int SucursalID { set; get; }

        [Column("Image64")]
        public string Image64 { set; get; }

        [Column("Curp")]
        public string Curp { set; get; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
