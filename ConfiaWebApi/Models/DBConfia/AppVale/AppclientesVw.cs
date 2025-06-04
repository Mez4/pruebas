using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppClientes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppClientes_VW
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("primerNombre")]
        public string primerNombre { get; set; }
      
        
        [Column("segundoNombre")]
        public string segundoNombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("edad")]
        public int? edad { get; set; }
      
        
        [Column("telefonoTipo")]
        public string telefonoTipo { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int PagareEstatusId { get; set; }
      
        
        [Column("pagareEstatusDesc")]
        public string pagareEstatusDesc { get; set; }
      
        
        [Column("EsttausId")]
        public bool? EsttausId { get; set; }


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
