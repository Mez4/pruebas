using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.PersonasDatosBancarios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class PersonasDatosBancarios_VW
    {
              
        
        [Column("personaID")]
        public Int64 personaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("datoBancario")]
        public string datoBancario { get; set; }
      
        
        [Column("datoTipoID")]
        public int datoTipoID { get; set; }
      
        
        [Column("datoTipoDesc")]
        public string datoTipoDesc { get; set; }
      
        
        [Column("BancoID")]
        public int BancoID { get; set; }
      
        
        [Column("BancoNombre")]
        public string BancoNombre { get; set; }
      
        
        [Column("Logo")]
        public byte[] Logo { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("fechaRegistro")]
        public DateTime fechaRegistro { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("personasDatosBancariosID")]
        public Int64 personasDatosBancariosID { get; set; }


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
