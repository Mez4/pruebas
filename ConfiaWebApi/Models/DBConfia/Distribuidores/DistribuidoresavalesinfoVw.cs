using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.DistribuidoresAvalesInfo_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresAvalesInfo_VW
    {
              
        
        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("Sexo")]
        public string Sexo { get; set; }
      
        
        [Column("CodigoPostal")]
        public int? CodigoPostal { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }


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
