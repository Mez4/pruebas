using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CondicionesDetalle_VW2")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CondicionesDetalle_VW2
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CondicionesID")]
        public int CondicionesID { get; set; }
      
        
        [Column("RenglonId")]
        public int RenglonId { get; set; }
      
        
        [Column("DistribuidorNivelId")]
        public int DistribuidorNivelId { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("DistribuidorNivelOrigen")]
        public string DistribuidorNivelOrigen { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("PlazosMinimos")]
        public int PlazosMinimos { get; set; }
      
        
        [Column("PlazosMaximos")]
        public int PlazosMaximos { get; set; }
      
        
        [Column("ImporteMinimo")]
        public decimal ImporteMinimo { get; set; }
      
        
        [Column("ImporteMaximo")]
        public decimal ImporteMaximo { get; set; }
      
        
        [Column("ImporteMaximo1erCanje")]
        public decimal ImporteMaximo1erCanje { get; set; }
      
        
        [Column("ImporteMaximo2doCanje")]
        public decimal ImporteMaximo2doCanje { get; set; }
      
        
        [Column("ImporteMinimo1erCanje")]
        public decimal? ImporteMinimo1erCanje { get; set; }
      
        
        [Column("ImporteMinimo2doCanje")]
        public decimal? ImporteMinimo2doCanje { get; set; }
      
        
        [Column("ImporteMinimo3erCanje")]
        public decimal? ImporteMinimo3erCanje { get; set; }
      
        
        [Column("PorcTasaPlazo")]
        public decimal PorcTasaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal SeguroPlazo { get; set; }
      
        
        [Column("PorcIVA")]
        public decimal PorcIVA { get; set; }
      
        
        [Column("fhModificacion")]
        public DateTime? fhModificacion { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("PlazosFijos")]
        public int PlazosFijos { get; set; }
      
        
        [Column("PorcTasaMensual")]
        public decimal PorcTasaMensual { get; set; }
      
        
        [Column("PorcTasaAnual")]
        public decimal PorcTasaAnual { get; set; }
      
        
        [Column("PagoXMilMinimo")]
        public decimal PagoXMilMinimo { get; set; }
      
        
        [Column("PagoXMilMaximo")]
        public decimal PagoXMilMaximo { get; set; }
      
        
        [Column("PlazosEspeciales")]
        public bool PlazosEspeciales { get; set; }
      
        
        [Column("CapitalCorte")]
        public decimal? CapitalCorte { get; set; }
      
        
        [Column("PorcCreditosActivosMax")]
        public decimal PorcCreditosActivosMax { get; set; }
      
        
        [Column("ImporteMaximo3erCanje")]
        public decimal? ImporteMaximo3erCanje { get; set; }
      
        
        [Column("CostoAnualTotal")]
        public decimal? CostoAnualTotal { get; set; }


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
