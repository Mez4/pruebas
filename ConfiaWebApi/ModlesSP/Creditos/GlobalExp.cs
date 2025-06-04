using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class GlobalExp
    {
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }

        [Column("ZonaVale")]
        public string ZonaVale { get; set; }

        [Column("SucursalVale")]
        public string SucursalVale { get; set; }

        [Column("CatGrupos")]
        public string CatGrupos { get; set; }

        [Column("CoordinadorVale")]
        public string CoordinadorVale { get; set; }
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }

        [Column("NombreCom")]
        public string NombreCom { get; set; }

        [Column("LimiteCreditoID")]
        public decimal LimiteCreditoID { get; set; } 
        
        [Column("DisponibleID")]
        public decimal DisponibleID { get; set; } 

        [Column("limiteDeCreditoTDA")]
        public decimal limiteDeCreditoTDA { get; set; } 

        [Column("disponibleTDA")]
        public decimal disponibleTDA { get; set; }

        [Column("Nivel")]
        public string Nivel { get; set; }

        [Column("OrigenIngreso")]
        public string OrigenIngreso { get; set; }

        [Column("ValesDigital")]
        public int ValesDigital { get; set; }

        [Column("SaldoActualID")]
        public decimal SaldoActualID { get; set; }

        [Column("SaldoActualCS")]
        public decimal SaldoActualCS { get; set; }

         [Column("Cartera")]
        public decimal Cartera { get; set; }

         [Column("SaldoPresPer")]
        public decimal SaldoPresPer { get; set; }

         [Column("CredActovps")]
        public int CredActovps { get; set; }

         [Column("NumPrestPer")]
        public int NumPrestPer { get; set; }

         [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }

         [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }

         [Column("PagosAtrasados")]
        public int PagosAtrasados { get; set; }

         [Column("CreditosAtrasados")]
        public int CreditosAtrasados { get; set; }

         [Column("Capital")]
        public decimal Capital { get; set; }

         [Column("Interes")]
        public decimal Interes { get; set; }

        [Column("Seguro")]
        public decimal Seguro { get; set; }

        [Column("PorcColocacionLimite")]
        public decimal PorcColocacionLimite { get; set; }

        [Column("FechaUltimoPago")]
        public DateTime FechaUltimoPago { get; set; }

        [Column("fechaUltimoVale")]
        public DateTime fechaUltimoVale { get; set; }

        [Column("CapitalLiquidado")]
        public decimal CapitalLiquidado { get; set; }

        [Column("CarteraEnRiesgo")]
        public decimal CarteraEnRiesgo { get; set; }

        [Column("EXPEDIENTEDIG")]
        public string EXPEDIENTEDIG { get; set; }

        [Column("NombreGestor")]
        public string NombreGestor { get; set; }

        [Column("CONVENIO")]
        public string CONVENIO { get; set; }

        [Column("PENDIENTE")]
        public string PENDIENTE { get; set; }

        [Column("UltimaRelacionFecha")]
        public DateTime UltimaRelacionFecha { get; set; }

        [Column("NumAvales")]
        public string NumAvales { get; set; }

        [Column("ContrasenaT")]
        public string ContrasenaT { get; set; }

        [Column("lineaTipoDescripcionCS")]
        public string lineaTipoDescripcionCS { get; set; }


        [Column("SaldoEnRiesgoD")]
        public decimal SaldoEnRiesgoD { get; set; }

        [Column("SaldoAtrasadoD")]
        public decimal SaldoAtrasadoD { get; set; }

        [Column("SaldoAtrasadoCS")]
        public decimal SaldoAtrasadoCS { get; set; }

        [Column("Recuperado")]
        public decimal Recuperado { get; set; }

        [Column("UltRelacionImporte")]
        public decimal UltRelacionImporte { get; set; }

        [Column("DiasDesdeUltPago")]
        public int DiasDesdeUltPago { get; set; }

        [Column("PROMOTOR")]
        public string PROMOTOR { get; set; }

        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }

        [Column("FechaPrimerCanje")]
        public DateTime FechaPrimerCanje { get; set; }

        [Column("ventasTotalesTiendita")]
        public decimal ventasTotalesTiendita { get; set; }
    }

}
