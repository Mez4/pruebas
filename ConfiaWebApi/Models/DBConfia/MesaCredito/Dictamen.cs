using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Dictamen")]
    [ExplicitColumns]
    // No primary key detected
    public class Dictamen
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("AnalistaID")]
        public int? AnalistaID { get; set; }
      
        
        [Column("SolicitudCreditoID")]
        public int? SolicitudCreditoID { get; set; }
      
        
        [Column("MontoCredito")]
        public decimal? MontoCredito { get; set; }
      
        
        [Column("ClasificacionCredito")]
        public string ClasificacionCredito { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("FechaDictamen")]
        public DateTime? FechaDictamen { get; set; }
      
        
        [Column("Estatus")]
        public bool? Estatus { get; set; }


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
