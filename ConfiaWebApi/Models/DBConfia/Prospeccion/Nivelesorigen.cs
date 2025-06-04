using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.NivelesOrigen")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorNivel", AutoIncrement=false)]
    public class NivelesOrigen
    {
              
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("PorcComisionBase")]
        public decimal? PorcComisionBase { get; set; }
      
        
        [Column("CapitalColocadoMinimo")]
        public decimal? CapitalColocadoMinimo { get; set; }
      
        
        [Column("CapitalColocadoMaximo")]
        public decimal? CapitalColocadoMaximo { get; set; }
      
        
        [Column("ImporteProteccionSaldo")]
        public decimal? ImporteProteccionSaldo { get; set; }
      
        
        [Column("importeMaxCanje")]
        public decimal? importeMaxCanje { get; set; }
      
        
        [Column("maximoPrestamoPersonal")]
        public decimal? maximoPrestamoPersonal { get; set; }
      
        
        [Column("maximoImporteCanjeCliente")]
        public decimal? maximoImporteCanjeCliente { get; set; }
      
        
        [Column("maximoImporteCanjeAval")]
        public decimal? maximoImporteCanjeAval { get; set; }


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
