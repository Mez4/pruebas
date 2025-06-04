using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class Global
    {
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("DirectorID")]
        public long DirectorID { get; set; }

        [Column("NombreDirector")]
        public string NombreDirector { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("CountDistribuidor")]
        public int CountDistribuidor { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("GrupoID")]
        public int GrupoID { get; set; }

        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("CoordinadorID")]
        public long CoordinadorID { get; set; }

        [Column("Coordinador")]
        public string Coordinador { get; set; }

        [Column("DistribuidorID")]
        public long DistribuidorID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }

        [Column("DistEstColor")]
        public string DistEstColor { get; set; }

        [Column("LimiteDeCredito")]
        public decimal LimiteDeCredito { get; set; }

        [Column("Disponible")]
        public decimal Disponible { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        [Column("Cartera")]
        public decimal Cartera { get; set; }

        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }

        [Column("CreditosAtrasados")]
        public decimal CreditosAtrasados { get; set; }

        [Column("saldoEnRiesgo")]
        public decimal saldoEnRiesgo { get; set; }

        [Column("Recuperado")]
        public decimal Recuperado { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }

        [Column("Colocado")]
        public decimal Colocado { get; set; }

        [Column("CapLiquidado")]
        public decimal CapLiquidado { get; set; }

        [Column("CarteraEnRiesgo")]
        public decimal CarteraEnRiesgo { get; set; }

        [Column("CortesAtrasados")]
        public int CortesAtrasados { get; set; }

        [Column("Detalle")]
        public List<Global> Detalle { get; set; }

        [Column("Total")]
        public Global Total { get; set; }

    }
}

