using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProspectosDatosSocioeconomicos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProspectosDatosSocioeconomicos_VW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("TipoViviendaID")]
        public Int64? TipoViviendaID { get; set; }
      
        
        [Column("TipoVivienda")]
        public string TipoVivienda { get; set; }
      
        
        [Column("numeroPersonasHabitan")]
        public int? numeroPersonasHabitan { get; set; }
      
        
        [Column("valorAproximado")]
        public decimal? valorAproximado { get; set; }
      
        
        [Column("TieneOtraVivienda")]
        public bool? TieneOtraVivienda { get; set; }
      
        
        [Column("TipoOtraViviendaID")]
        public Int64? TipoOtraViviendaID { get; set; }
      
        
        [Column("TipoViviendaOtra")]
        public string TipoViviendaOtra { get; set; }
      
        
        [Column("valorAproximadoOtra")]
        public decimal? valorAproximadoOtra { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("DireccionOtraVivienda")]
        public string DireccionOtraVivienda { get; set; }
      
        
        [Column("ingresoSueldo")]
        public decimal? ingresoSueldo { get; set; }
      
        
        [Column("gananciasDV")]
        public decimal? gananciasDV { get; set; }
      
        
        [Column("ingresoConyuge")]
        public decimal? ingresoConyuge { get; set; }
      
        
        [Column("otrosIngresos")]
        public decimal? otrosIngresos { get; set; }
      
        
        [Column("ingresoTotal")]
        public decimal? ingresoTotal { get; set; }
      
        
        [Column("AlimetacionEgreso")]
        public decimal? AlimetacionEgreso { get; set; }
      
        
        [Column("TarjetasEgreso")]
        public decimal? TarjetasEgreso { get; set; }
      
        
        [Column("RentaPagoViviendaEgreso")]
        public decimal? RentaPagoViviendaEgreso { get; set; }
      
        
        [Column("ServiciosDomesticosEgreso")]
        public decimal? ServiciosDomesticosEgreso { get; set; }
      
        
        [Column("OtroEgreso")]
        public decimal? OtroEgreso { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("EgresoTotal")]
        public decimal? EgresoTotal { get; set; }
      
        
        [Column("tieneAutoMoto")]
        public bool? tieneAutoMoto { get; set; }
      
        
        [Column("tieneExperiencia")]
        public bool? tieneExperiencia { get; set; }
      
        
        [Column("tieneDependientes")]
        public bool? tieneDependientes { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("DistribuidorTiposID")]
        public int DistribuidorTiposID { get; set; }
      
        
        [Column("DistribuidorTipos")]
        public string DistribuidorTipos { get; set; }
      
        
        [Column("OtraViviendaCodigoPostal")]
        public int? OtraViviendaCodigoPostal { get; set; }


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
