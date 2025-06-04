using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    // View, no primary key needed
    public class spProspectosCoordinador
    {
        [Column("regresa")]
        public int regresa { get; set; }
        
        [Column("msj")]
        public string msj { get; set; }

        [Column("fechaCreacion")]
        public DateTime fechaCreacion { get; set; }
      
        
        [Column("PromotorUsuarioID")]
        public int PromotorUsuarioID { get; set; }
      
        
        [Column("PromotorPersonaID")]
        public Int64 PromotorPersonaID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("NombrePila")]
        public string NombrePila { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("NombreProspecto")]
        public string NombreProspecto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("PantallaProcesoID")]
        public int? PantallaProcesoID { get; set; }
      
        
        [Column("PrimerCanje")]
        public Int64? PrimerCanje { get; set; }
      
        
        [Column("ActivoDesc")]
        public string ActivoDesc { get; set; }
      
        
        [Column("AnalistaBuroID")]
        public Int64? AnalistaBuroID { get; set; }
      
        
        [Column("NombreAnalistaBuro")]
        public string NombreAnalistaBuro { get; set; }
      
        
        [Column("PersonaAnalistaID")]
        public Int64? PersonaAnalistaID { get; set; }
      
        
        [Column("NombreAnalista")]
        public string NombreAnalista { get; set; }
      
        
        [Column("AnalistaLlamadasID")]
        public Int64? AnalistaLlamadasID { get; set; }
      
        
        [Column("NombreAnalistaLlamadas")]
        public string NombreAnalistaLlamadas { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("BuroInternoEstatus")]
        public string BuroInternoEstatus { get; set; }
      
        
        [Column("BuroInternoEstatusColor")]
        public string BuroInternoEstatusColor { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("EstatusConsultaBuroDesc")]
        public string EstatusConsultaBuroDesc { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidorTiposID")]
        public int DistribuidorTiposID { get; set; }
      
        
        [Column("DistribuidorTipos")]
        public string DistribuidorTipos { get; set; }
      
        
        [Column("MontoDictaminado")]
        public decimal? MontoDictaminado { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("EnMesa")]
        public int EnMesa { get; set; }
      
        
        [Column("FechaEnMesa")]
        public DateTime? FechaEnMesa { get; set; }
      
        
        [Column("FechaAsignacion")]
        public DateTime? FechaAsignacion { get; set; }
      
        
        [Column("FechaAsignacionBuro")]
        public DateTime? FechaAsignacionBuro { get; set; }
      
        
        [Column("MsjNoLeidosMesa")]
        public int? MsjNoLeidosMesa { get; set; }
      
        
        [Column("MsjNoLeidosSucP")]
        public int? MsjNoLeidosSucP { get; set; }
      
        
        [Column("AsignadoValidado")]
        public int AsignadoValidado { get; set; }
      
        
        [Column("ColorAsignadoValidado")]
        public string ColorAsignadoValidado { get; set; }
      
        
        [Column("ObservacionAsignaValidado")]
        public string ObservacionAsignaValidado { get; set; }
      
        
        [Column("RevisionDocumentos")]
        public int RevisionDocumentos { get; set; }
      
        
        [Column("ColorRevisionDocumentos")]
        public string ColorRevisionDocumentos { get; set; }
      
        
        [Column("ColorRevisionDocumentosDesc")]
        public string ColorRevisionDocumentosDesc { get; set; }
      
        
        [Column("ObservacionRevisionDocumentos")]
        public string ObservacionRevisionDocumentos { get; set; }
      
        
        [Column("RevisionBuro")]
        public int RevisionBuro { get; set; }
      
        
        [Column("ColorRevisionBuro")]
        public string ColorRevisionBuro { get; set; }
      
        
        [Column("ColorRevisionBuroDesc")]
        public string ColorRevisionBuroDesc { get; set; }
      
        
        [Column("ObservacionRevicionBuro")]
        public string ObservacionRevicionBuro { get; set; }
      
        
        [Column("RevisionRefTitular")]
        public int RevisionRefTitular { get; set; }
      
        
        [Column("ColorRevisionRefTitular")]
        public string ColorRevisionRefTitular { get; set; }
      
        
        [Column("ColorRevisionRefTitularDesc")]
        public string ColorRevisionRefTitularDesc { get; set; }
      
        
        [Column("ObservacionRevisionRefTitular")]
        public string ObservacionRevisionRefTitular { get; set; }
      
        
        [Column("RevisionRefAval")]
        public int RevisionRefAval { get; set; }
      
        
        [Column("ColorRevisionRefAval")]
        public string ColorRevisionRefAval { get; set; }
      
        
        [Column("ColorRevisionRefAvalDesc")]
        public string ColorRevisionRefAvalDesc { get; set; }
      
        
        [Column("ObservacionRevisionRefAval")]
        public string ObservacionRevisionRefAval { get; set; }
      
        
        [Column("VerificaTitular")]
        public int VerificaTitular { get; set; }
      
        
        [Column("ColorVerificaTitular")]
        public string ColorVerificaTitular { get; set; }
      
        
        [Column("ColorVerificaTitularDesc")]
        public string ColorVerificaTitularDesc { get; set; }
      
        
        [Column("ObservacionVerificaTitular	")]
        public string ObservacionVerificaTitular	 { get; set; }
      
        
        [Column("VerificaAval")]
        public int VerificaAval { get; set; }
      
        
        [Column("ColorVerificaAval")]
        public string ColorVerificaAval { get; set; }
      
        
        [Column("ColorVerificaAvalDesc")]
        public string ColorVerificaAvalDesc { get; set; }
      
        
        [Column("ObservacionVerificaAval")]
        public string ObservacionVerificaAval { get; set; }
      
        
        [Column("RevisionDocumentosAval")]
        public int RevisionDocumentosAval { get; set; }
      
        
        [Column("ColorRevisionDocumentosAval")]
        public string ColorRevisionDocumentosAval { get; set; }
      
        
        [Column("ObservacionRevisionDocsAval")]
        public string ObservacionRevisionDocsAval { get; set; }
      
        
        [Column("Dictamen")]
        public int Dictamen { get; set; }
      
        
        [Column("ColorDictamen")]
        public string ColorDictamen { get; set; }
      
        
        [Column("ColorDictamenDesc")]
        public string ColorDictamenDesc { get; set; }
      
        
        [Column("ObservacionDictamen")]
        public string ObservacionDictamen { get; set; }
      
        
        [Column("Consolidacion")]
        public int Consolidacion { get; set; }
      
        
        [Column("ColorConsolidacion")]
        public string ColorConsolidacion { get; set; }
      
        
        [Column("ColorConsolidacionDesc")]
        public string ColorConsolidacionDesc { get; set; }
      
        
        [Column("ObservacionConsolidacion")]
        public string ObservacionConsolidacion { get; set; }
      
        
        [Column("NivelOrigen_BuroID")]
        public int? NivelOrigen_BuroID { get; set; }
      
        
        [Column("DistribuidorNivelInternoID")]
        public int? DistribuidorNivelInternoID { get; set; }
      
        
        [Column("Descartado")]
        public bool? Descartado { get; set; }
      
        
        [Column("ObservacionesDescartado")]
        public string ObservacionesDescartado { get; set; }
      
        
        [Column("FechaDescarte")]
        public DateTime? FechaDescarte { get; set; }


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
