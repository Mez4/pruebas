using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.CanjesValeApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CanjesValeApp_VW
    {
              
        
        [Column("valeId")]
        public int valeId { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("cancelado")]
        public string cancelado { get; set; }
      
        
        [Column("fhCancelacion")]
        public DateTime? fhCancelacion { get; set; }
      
        
        [Column("valeraDetalleId")]
        public int valeraDetalleId { get; set; }
      
        
        [Column("nombreCliente")]
        public string nombreCliente { get; set; }
      
        
        [Column("importe")]
        public decimal importe { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("codigoVale")]
        public string codigoVale { get; set; }
      
        
        [Column("canjeId")]
        public Int64 canjeId { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }
      
        
        [Column("creditoId")]
        public int creditoId { get; set; }
      
        
        [Column("Folio")]
        public Int64? Folio { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("codigoValeDig")]
        public string codigoValeDig { get; set; }


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
