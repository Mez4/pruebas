using System;
using NPoco;

namespace ConfiaWebApi.ModlesSP.Cortes
{
    [ExplicitColumns]
    public class RelacionCortesRecalculooRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }
    }

    [ExplicitColumns]
    public class ParteArribaRelacion
    {
        [Column("CreditoID")]
        public int CreditoID { get; set; }

        [Column("TipoCreditoID")]
        public int TipoCreditoID { get; set; }

        [Column("FechaCanje")]
        public DateTime FechaCanje { get; set; }

        [Column("FechaVencimiento")]
        public DateTime FechaVencimiento { get; set; }

        [Column("ValeCanje")]
        public Int64 ValeCanje { get; set; }

        [Column("ClienteID")]
        public int ClienteID { get; set; }

        [Column("Plazos")]
        public int Plazos { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("EsPersonal")]
        public bool EsPersonal { get; set; }

        [Column("NoPago")]
        public int NoPago { get; set; }

        [Column("CapitalPendiente")]
        public decimal CapitalPendiente { get; set; }

        [Column("CapitalAbonado")]
        public decimal CapitalAbonado { get; set; }

        [Column("TienditaPendiente")]
        public decimal TienditaPendiente { get; set; }

        [Column("PorcentajeTienditaSobreCapital")]
        public decimal PorcentajeTienditaSobreCapital { get; set; }

        [Column("InteresPendiente")]
        public decimal InteresPendiente { get; set; }

        [Column("InteresAbonado")]
        public decimal InteresAbonado { get; set; }

        [Column("IvaPendiente")]
        public decimal IvaPendiente { get; set; }

        [Column("IvaAbonado")]
        public decimal IvaAbonado { get; set; }

        [Column("SeguroPendiente")]
        public decimal SeguroPendiente { get; set; }

        [Column("SeguroAbonado")]
        public decimal SeguroAbonado { get; set; }

        [Column("CargoPendiente")]
        public decimal CargoPendiente { get; set; }

        [Column("CargoAbonado")]
        public decimal CargoAbonado { get; set; }

        [Column("ManejoCuentaPendiente")]
        public decimal ManejoCuentaPendiente { get; set; }

        [Column("ManejoCuentaAbonado")]
        public decimal ManejoCuentaAbonado { get; set; }

        [Column("SaldoPlazo")]
        public decimal SaldoPlazo { get; set; }

        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }
    }

    [ExplicitColumns]
    public class RelacionesCortesData
    {
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }

        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }

        [Column("DistribuidorNivelIDOrigen")]
        public int? DistribuidorNivelIDOrigen { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }

        [Column("fechaCorte")]
        public string fechaCorte { get; set; }

        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }

        [Column("ContratoCIE")]
        public string ContratoCIE { get; set; }

        [Column("refBancomer")]
        public string refBancomer { get; set; }

        [Column("refOxxo")]
        public string refOxxo { get; set; }

        [Column("refSPEI")]
        public string refSPEI { get; set; }

        [Column("refSoriana")]
        public string refSoriana { get; set; }
    }


    [ExplicitColumns]
    public class MonederoSocia
    {
        [Column("CreditoID")]
        public string SucursalID { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("ID")]
        public string ID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("DiasAtraso")]
        public string DiasAtraso { get; set; }

        [Column("Cartera")]
        public string Cartera { get; set; }

        [Column("Pactado")]
        public string Pactado { get; set; }

        [Column("Pagado")]
        public string Pagado { get; set; }

        [Column("PorcLiquidacion")]
        public string PorcLiquidacion { get; set; }

        [Column("Monedero")]
        public string Monedero { get; set; }

        [Column("FechaCorte")]
        public string FechaCorte { get; set; }

        [Column("Nivel")]
        public string Nivel { get; set; }

    }

}
