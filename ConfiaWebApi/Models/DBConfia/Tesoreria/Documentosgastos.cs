using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.DocumentosGastos")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoID")]
    public class DocumentosGastos
    {
              
        
        [Column("DocumentoID")]
        public Int64 DocumentoID { get; set; }
      
        
        [Column("SolicitudGastoID")]
        public int SolicitudGastoID { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public Int64 SolicitudDetalleID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Autorizado")]
        public bool Autorizado { get; set; }
      
        
        [Column("Cotizacion")]
        public bool Cotizacion { get; set; }
      
        
        [Column("FechaSubida")]
        public DateTime FechaSubida { get; set; }


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
