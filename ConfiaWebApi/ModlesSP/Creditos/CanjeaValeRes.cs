using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ConfiaWebApi.PeticionesRest.Administracion.Personas;
using DBContext.DBConfia.Creditos;

namespace DBContext.DBConfia.Custom.Creditos
{
    [ExplicitColumns]
    public class CanjeaValeRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("CreditoId")]
        public long CreditoId { get; set; }

        [Column("MovimientoID")]
        public long MovimientoID { get; set; }

        [Column("CajaId")]
        public string CajaId { get; set; }

        [Column("VentaId")]
        public long VentaId { get; set; }

        [Column("CanjeAppId")]
        public long CanjeAppId { get; set; }


        [Column("@TipoDesembolsoID")]
        public long @TipoDesembolsoID { get; set; }

        

        public Creditos_VW Credito { get; set; }

    }


    [ExplicitColumns]
    public class CanjeaValeRes2
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("CreditoId")]
        public long CreditoId { get; set; }

        [Column("MovimientoID")]
        public long MovimientoID { get; set; }

        [Column("CajaId")]
        public string CajaId { get; set; }

        [Column("VentaId")]
        public long VentaId { get; set; }

        [Column("CanjeAppId")]
        public long CanjeAppId { get; set; }


        [Column("@TipoDesembolsoID")]
        public long @TipoDesembolsoID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }



        public Creditos_VW Credito { get; set; }

    }

    [ExplicitColumns]
    public class AgregarProductoCreditoRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("CreditoId")]
        public long CreditoId { get; set; }

        [Column("MovimientoID")]
        public long MovimientoID { get; set; }

        [Column("CajaId")]
        public string CajaId { get; set; }

        [Column("VentaId")]
        public long VentaId { get; set; }

        [Column("CanjeAppId")]
        public long CanjeAppId { get; set; }

        [Column("@TipoDesembolsoID")]
        public long @TipoDesembolsoID { get; set; }

        public CreditosCaja_VW Credito { get; set; }
    }

    [ExplicitColumns]
    public class DatosValeRes
    {
        [Column("CanjeAppId")]
        public long CanjeAppId { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("DistribuidorID")]
        public long DistribuidorID { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("ClienteID")]
        public long ClienteID { get; set; }

        [Column("SerieId")]
        public long SerieId { get; set; }

        [Column("Folio")]
        public long Folio { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }

        [Column("Plazos")]
        public int Plazos { get; set; }

        [Column("TipoDesembolsoID")]
        public Int16 TipoDesembolsoID { get; set; }

        [Column("valeDigital")]
        public bool valeDigital { get; set; }

        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }

        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }

        [Column("VentaId")]
        public long VentaId { get; set; }

        [Column("personasDatosBancariosID")]
        public long? personasDatosBancariosID { get; set; }

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("EstatusCodigo")]
        public string EstatusCodigo { get; set; }

    }

    [ExplicitColumns]
    public class CompraTiendita
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("CreditoId")]
        public int CreditoId { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("CajaId")]
        public int CajaId { get; set; }

        [Column("ClienteId")]
        public int ClienteId { get; set; }


        [Column("@TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }

        [Column("@PersonaID")]
        public int PersonaID { get; set; }
    }
}
