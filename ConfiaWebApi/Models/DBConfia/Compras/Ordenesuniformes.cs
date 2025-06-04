using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.OrdenesUniformes")]
    [ExplicitColumns]
    [PrimaryKey("OrdenID")]
    public class OrdenesUniformes
    {
              
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("SolicitudUniformeID")]
        public int? SolicitudUniformeID { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("AutorizadoID")]
        public int? AutorizadoID { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("SolicitanteID")]
        public int? SolicitanteID { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("Cancelada")]
        public bool? Cancelada { get; set; }


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
