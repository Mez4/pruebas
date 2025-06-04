using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Producto
{
    public class BusquedaProducto
    {
        [Required]
        public string Producto { get; set; }
    }

    public class ObtenerProducto
    {
        [Required]
        public string ProductoID { get; set; }
        [Required]
        public string Producto { get; set; }
    }

    public class AddProducto
    {
        [Required]
        public string Producto { get; set; }
        [Required]
        public int ProductoID { get; set; }
    }

    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        public int DirectorID { get; set; }

        public List<int> AccesoProductos { get; set; }
    }

    public class GetProdEmpl
    {
        [Range(minimum: 0, maximum: 9999)]
        public int EmpresaId { get; set; }
    }

    public class GetProdDist
    {
        [Range(minimum: 0, maximum: 9999)]
        public int EmpresaId { get; set; }

    }


    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EmpresaId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Producto { get; set; }

        public bool Activo { get; set; } = true;

        public bool EsOperativo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string TasaTipoId { get; set; }

        public int TipoProductoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(20)]
        public string DiasPago { get; set; }

        [Required]
        public int DiaParaCorte { get; set; }

        [Required]
        public int PrioridadCobranza { get; set; }

        public bool RequiereDistribuidor { get; set; } = false;

        public bool RequiereGrupo { get; set; } = false;

        public bool ValidaDisponible { get; set; } = false;

        public bool Restructura { get; set; } = false;

        public bool GeneraDesembolso { get; set; } = false;

        public bool AplicaComision { get; set; }

        public bool SeguroFinanciado { get; set; } = false;

        public bool Canje { get; set; } = false;

        public bool DesglosarIVA { get; set; } = false;

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int EdadMinima { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int EdadMaxima { get; set; }

        public bool CapitalAlFinal { get; set; } = false;

        public bool CargoFinanciado { get; set; } = false;

        public bool CargoAlInicio { get; set; } = false;

        public bool ActivaCredito { get; set; } = false;

        public bool CreditosLiquidadosReq { get; set; } = false;

        public bool PermisoEspecial { get; set; } = false;

        public bool ValidarCondiciones { get; set; } = false;

        public bool AplicaIVAInteres { get; set; } = false;

        public bool AplicaIVASeguro { get; set; } = false;

        public bool AplicaIVAManejoCuenta { get; set; } = false;

        public int? AdicProductoId { get; set; }

        [Required]
        public int CuentaMaestraId { get; set; }

        public int? CtaCapitalId { get; set; }

        public int? CtaInteresNormalId { get; set; }

        public int? CtaInteresMoraId { get; set; }

        public int? CtaIvaId { get; set; }

        public int? CtaInteresNormDeudorId { get; set; }

        public int? CtaInteresNormAcreedorId { get; set; }

        public int? CtaInteresMoraDeudorId { get; set; }

        public int? CtaInteresMoraAcreedorId { get; set; }

        public IFormFile Logo { get; set; }

        public int? PersonaResponsableID { get; set; }

        public decimal? DiasCaducidadVale { get; set; }

        public decimal? DiasCaducidadFolio { get; set; }


    }


    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int EmpresaId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Producto { get; set; }

        public bool Activo { get; set; } = true;
        public bool EsOperativo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string TasaTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(20)]
        public string DiasPago { get; set; }

        [Required]
        public int DiaParaCorte { get; set; }

        [Required]
        public int PrioridadCobranza { get; set; }

        public bool RequiereDistribuidor { get; set; } = false;

        public bool RequiereGrupo { get; set; } = false;

        public bool AplicaComision { get; set; }

        public bool ValidaDisponible { get; set; } = false;

        public bool Restructura { get; set; } = false;

        public bool GeneraDesembolso { get; set; } = false;

        public bool SeguroFinanciado { get; set; } = false;

        public bool Canje { get; set; } = false;

        public bool DesglosarIVA { get; set; } = false;

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int EdadMinima { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int EdadMaxima { get; set; }

        public bool CapitalAlFinal { get; set; } = false;

        public bool CargoFinanciado { get; set; } = false;

        public bool CargoAlInicio { get; set; } = false;

        public bool ActivaCredito { get; set; } = false;

        public bool CreditosLiquidadosReq { get; set; } = false;

        public bool PermisoEspecial { get; set; } = false;

        public bool ValidarCondiciones { get; set; } = false;

        public bool AplicaIVAInteres { get; set; } = false;

        public bool AplicaIVASeguro { get; set; } = false;

        public bool AplicaIVAManejoCuenta { get; set; } = false;

        public int? AdicProductoId { get; set; }

        [Required]
        public int CuentaMaestraId { get; set; }

        public int? CtaCapitalId { get; set; }

        public int? CtaInteresNormalId { get; set; }

        public int? CtaInteresMoraId { get; set; }

        public int? CtaIvaId { get; set; }

        public int? CtaInteresNormDeudorId { get; set; }

        public int? CtaInteresNormAcreedorId { get; set; }

        public int? CtaInteresMoraDeudorId { get; set; }

        public int? CtaInteresMoraAcreedorId { get; set; }

        public IFormFile Logo { get; set; }

        public int? PersonaResponsableID { get; set; }

        public decimal? DiasCaducidadVale { get; set; }

        public decimal? DiasCaducidadFolio { get; set; }



    }
}
