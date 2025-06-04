using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Bitacora_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Bitacora_VW
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("UsuarioNombre")]
        public string UsuarioNombre { get; set; }
      
        
        [Column("PersonaLogueadaID")]
        public int PersonaLogueadaID { get; set; }
      
        
        [Column("PersonaLogueadaNombre")]
        public string PersonaLogueadaNombre { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("GestorNombre")]
        public string GestorNombre { get; set; }
      
        
        [Column("EncargadoID")]
        public Int64? EncargadoID { get; set; }
      
        
        [Column("EncargadoNombre")]
        public string EncargadoNombre { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorNombre")]
        public string DistribuidorNombre { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaNombre")]
        public string MesaCobranzaNombre { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }


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
