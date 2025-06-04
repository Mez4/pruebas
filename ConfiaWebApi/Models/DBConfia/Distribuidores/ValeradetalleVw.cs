using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraDetalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ValeraDetalle_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("serieId")]
        public Int64 serieId { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("Folio")]
        public Int64 Folio { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("DigitalFolio")]
        public string DigitalFolio { get; set; }
      
        
        [Column("DigitalImporte")]
        public decimal DigitalImporte { get; set; }
      
        
        [Column("DigitalPlazo")]
        public int DigitalPlazo { get; set; }
      
        
        [Column("DigitalTipoDesembolsoId")]
        public int? DigitalTipoDesembolsoId { get; set; }
      
        
        [Column("AdicProductoId")]
        public int? AdicProductoId { get; set; }
      
        
        [Column("AdicImporte")]
        public decimal AdicImporte { get; set; }
      
        
        [Column("CanjeFecha")]
        public DateTime? CanjeFecha { get; set; }
      
        
        [Column("CanceladoFecha")]
        public DateTime? CanceladoFecha { get; set; }
      
        
        [Column("CanjePersonaID")]
        public Int64? CanjePersonaID { get; set; }
      
        
        [Column("CanceladoPersonaID")]
        public Int64? CanceladoPersonaID { get; set; }
      
        
        [Column("CanceladoUsuarioId")]
        public int? CanceladoUsuarioId { get; set; }
      
        
        [Column("CanjeUsuarioId")]
        public int? CanjeUsuarioId { get; set; }
      
        
        [Column("ValeDigital")]
        public bool ValeDigital { get; set; }
      
        
        [Column("DiasCaducidad")]
        public decimal? DiasCaducidad { get; set; }
      
        
        [Column("FechaExpedicion")]
        public DateTime? FechaExpedicion { get; set; }


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
