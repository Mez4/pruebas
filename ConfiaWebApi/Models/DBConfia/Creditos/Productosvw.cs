using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProductosVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProductosVW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Principal")]
        public bool? Principal { get; set; }
      
        
        [Column("TasaTipoId")]
        public string TasaTipoId { get; set; }
      
        
        [Column("DiasPago")]
        public string DiasPago { get; set; }
      
        
        [Column("DiaParaCorte")]
        public int? DiaParaCorte { get; set; }
      
        
        [Column("PrioridadCobranza")]
        public int? PrioridadCobranza { get; set; }
      
        
        [Column("RequiereDistribuidor")]
        public bool RequiereDistribuidor { get; set; }
      
        
        [Column("RequiereGrupo")]
        public bool RequiereGrupo { get; set; }
      
        
        [Column("ValidaDisponible")]
        public bool ValidaDisponible { get; set; }
      
        
        [Column("Restructura")]
        public bool Restructura { get; set; }
      
        
        [Column("GeneraDesembolso")]
        public bool GeneraDesembolso { get; set; }
      
        
        [Column("SeguroFinanciado")]
        public bool SeguroFinanciado { get; set; }
      
        
        [Column("Canje")]
        public bool Canje { get; set; }
      
        
        [Column("DesglosarIVA")]
        public bool DesglosarIVA { get; set; }
      
        
        [Column("EdadMinima")]
        public int EdadMinima { get; set; }
      
        
        [Column("EdadMaxima")]
        public int EdadMaxima { get; set; }
      
        
        [Column("CapitalAlFinal")]
        public bool CapitalAlFinal { get; set; }
      
        
        [Column("CargoFinanciado")]
        public bool CargoFinanciado { get; set; }
      
        
        [Column("CargoAlInicio")]
        public bool CargoAlInicio { get; set; }
      
        
        [Column("ActivaCredito")]
        public bool ActivaCredito { get; set; }
      
        
        [Column("CreditosLiquidadosReq")]
        public bool CreditosLiquidadosReq { get; set; }
      
        
        [Column("PermisoEspecial")]
        public bool PermisoEspecial { get; set; }
      
        
        [Column("ValidarCondiciones")]
        public bool ValidarCondiciones { get; set; }
      
        
        [Column("FhRegitro")]
        public DateTime FhRegitro { get; set; }
      
        
        [Column("FhMoficiacion")]
        public DateTime FhMoficiacion { get; set; }
      
        
        [Column("AplicaIVAInteres")]
        public bool AplicaIVAInteres { get; set; }
      
        
        [Column("AplicaIVASeguro")]
        public bool AplicaIVASeguro { get; set; }
      
        
        [Column("AplicaIVAManejoCuenta")]
        public bool AplicaIVAManejoCuenta { get; set; }
      
        
        [Column("Logo")]
        public byte[] Logo { get; set; }
      
        
        [Column("AdicProductoId")]
        public int? AdicProductoId { get; set; }
      
        
        [Column("CuentaMaestraId")]
        public int? CuentaMaestraId { get; set; }
      
        
        [Column("UsuarioRegistro")]
        public int? UsuarioRegistro { get; set; }
      
        
        [Column("UsuarioModifico")]
        public int? UsuarioModifico { get; set; }
      
        
        [Column("CtaCapitalId")]
        public int? CtaCapitalId { get; set; }
      
        
        [Column("CtaInteresNormalId")]
        public int? CtaInteresNormalId { get; set; }
      
        
        [Column("CtaInteresMoraId")]
        public int? CtaInteresMoraId { get; set; }
      
        
        [Column("CtaIvaId")]
        public int? CtaIvaId { get; set; }
      
        
        [Column("CtaInteresNormDeudorId")]
        public int? CtaInteresNormDeudorId { get; set; }
      
        
        [Column("CtaInteresNormAcreedorId")]
        public int? CtaInteresNormAcreedorId { get; set; }
      
        
        [Column("CtaInteresMoraDeudorId")]
        public int? CtaInteresMoraDeudorId { get; set; }
      
        
        [Column("CtaInteresMoraAcreedorId")]
        public int? CtaInteresMoraAcreedorId { get; set; }
      
        
        [Column("SerieId")]
        public Int64? SerieId { get; set; }
      
        
        [Column("EmpresaStpID")]
        public int? EmpresaStpID { get; set; }
      
        
        [Column("PrestamoPersonal")]
        public bool? PrestamoPersonal { get; set; }
      
        
        [Column("DescripcionApp")]
        public string DescripcionApp { get; set; }
      
        
        [Column("EsNomina")]
        public bool EsNomina { get; set; }
      
        
        [Column("EmpresaNombre")]
        public string EmpresaNombre { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public Int64 PersonaResponsableID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("empresaRazonSocial")]
        public string empresaRazonSocial { get; set; }
      
        
        [Column("DiasCaducidadFolio")]
        public decimal? DiasCaducidadFolio { get; set; }
      
        
        [Column("DiasCaducidadVale")]
        public decimal? DiasCaducidadVale { get; set; }
      
        
        [Column("TipoProductoID")]
        public int? TipoProductoID { get; set; }
      
        
        [Column("TipoProducto")]
        public string TipoProducto { get; set; }
      
        
        [Column("EsOperativo")]
        public bool? EsOperativo { get; set; }
      
        
        [Column("AplicaComision")]
        public bool? AplicaComision { get; set; }
      
        
        [Column("EsPrestaStar")]
        public bool? EsPrestaStar { get; set; }
      
        
        [Column("Tiendita")]
        public bool? Tiendita { get; set; }


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
