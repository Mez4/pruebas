using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesPrestamosPersonalesDocumentos")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoID")]
    public class SolicitudesPrestamosPersonalesDocumentos
    {
              
        
        [Column("DocumentoID")]
        public int DocumentoID { get; set; }
      
        
        [Column("SolicitudPrestamoPersonalID")]
        public int? SolicitudPrestamoPersonalID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Firmado")]
        public bool? Firmado { get; set; }


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
