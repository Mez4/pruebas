using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.BalanceTemp")]
    [ExplicitColumns]
    [PrimaryKey("BalanceTempID")]
    public class BalanceTemp
    {


        [Column("BalanceTempID")]
        public Int64 BalanceTempID { get; set; }


        [Column("Nombre")]
        public string Nombre { get; set; }


        [Column("FechaCaptura")]
        public DateTime? FechaCaptura { get; set; }


        [Column("CantidadMovs")]
        public Int64 CantidadMovs { get; set; }


        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }


        [Column("Aceptado")]
        public bool Aceptado { get; set; }


        [Column("ResultadoBalance")]
        public string ResultadoBalance { get; set; }


        [Column("DiferenciaBalance")]
        public string DiferenciaBalance { get; set; }


        [Column("Cartera090")]
        public string Cartera090 { get; set; }


        [Column("Cartera90")]
        public string Cartera90 { get; set; }


        [Column("BalanceVinculado")]
        public Int64? BalanceVinculado { get; set; }


        [Column("Cartera045")]
        public string Cartera045 { get; set; }

        [Column("Cartera0")]
        public string Cartera0 { get; set; }



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
