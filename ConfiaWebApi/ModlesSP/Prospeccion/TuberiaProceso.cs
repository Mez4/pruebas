using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class TuberiaProceso
    {
          [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
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


        [Column("PersonaAnalistaID")]
        public Int64? PersonaAnalistaID { get; set; }
      
        
        [Column("NombreAnalista")]
        public string NombreAnalista { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("EstatusConsultaBuroDesc")]
        public string EstatusConsultaBuroDesc { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("MontoDictaminado")]
        public decimal? MontoDictaminado { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("EnMesa")]
        public int EnMesa { get; set; }
      
        
        [Column("FechaEnMesa")]
        public DateTime? FechaEnMesa { get; set; }
      
        
        [Column("FechaAsignacion")]
        public DateTime? FechaAsignacion { get; set; }
      
        
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
      
        
        [Column("ObservacionRevisionDocumentos")]
        public string ObservacionRevisionDocumentos { get; set; }
      
        
        [Column("RevisionBuro")]
        public int RevisionBuro { get; set; }
      
        
        [Column("ColorRevisionBuro")]
        public string ColorRevisionBuro { get; set; }
      
        
        [Column("ObservacionRevicionBuro")]
        public string ObservacionRevicionBuro { get; set; }
      
        
        [Column("RevisionRefTitular")]
        public int RevisionRefTitular { get; set; }
      
        
        [Column("ColorRevisionRefTitular")]
        public string ColorRevisionRefTitular { get; set; }
      
        
        [Column("ObservacionRevisionRefTitular")]
        public string ObservacionRevisionRefTitular { get; set; }
      
        
        [Column("RevisionRefAval")]
        public int RevisionRefAval { get; set; }
      
        
        [Column("ColorRevisionRefAval")]
        public string ColorRevisionRefAval { get; set; }
      
        
        [Column("ObservacionRevisionRefAval")]
        public string ObservacionRevisionRefAval { get; set; }
      
        
        [Column("VerificaTitular")]
        public int VerificaTitular { get; set; }
      
        
        [Column("ColorVerificaTitular")]
        public string ColorVerificaTitular { get; set; }
      
        
        [Column("ObservacionVerificaTitular")]
        public string ObservacionVerificaTitular { get; set; }
      
        
        [Column("VerificaAval")]
        public int VerificaAval { get; set; }
      
        
        [Column("ColorVerificaAval")]
        public string ColorVerificaAval { get; set; }
      
        
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
      
        
        [Column("ObservacionDictamen")]
        public string ObservacionDictamen { get; set; }
      
        
        [Column("Consolidacion")]
        public int Consolidacion { get; set; }
      
        
        [Column("ColorConsolidacion")]
        public string ColorConsolidacion { get; set; }
      
        
        [Column("ObservacionConsolidacion")]
        public string ObservacionConsolidacion { get; set; }


        [Column("Filtro")]
        public int Filtro { get; set; }

        [Column("regresa")]

        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

    
    }
}
