using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class BovedasCat
    {


        [Column("BovedaID")]
        public int BovedaID { get; set; }

        [Column("CuentaID")]
        public int CuentaID { get; set; }

        [Column("BancoID")]
        public int BancoID { get; set; }

        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }


        [Column("Clave")]
        public string Clave { get; set; }

        [Column("Activa")]
        public Boolean Activa { get; set; }

        [Column("Cuenta")]
        public string Cuenta { get; set; }

        [Column("NombreCuentaContable")]
        public string NombreCuentaContable { get; set; }

        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }

        [Column("PersonaID")]
        public string PersonaID { get; set; }




    }
}
