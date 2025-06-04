using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AsignaGestorHistorial")]
    [ExplicitColumns]
    [PrimaryKey("AsignaGestorID")]
    public class AsignaGestorHistorial
    {
              
        
        [Column("AsignaGestorID")]
        public int AsignaGestorID { get; set; }
      
        
        [Column("FechaHoraAsignacion")]
        public DateTime FechaHoraAsignacion { get; set; }
      
        
        [Column("EncargadoPersonaAsignaID")]
        public Int64 EncargadoPersonaAsignaID { get; set; }
      
        
        [Column("EncargadoUsuarioAsignaID")]
        public int EncargadoUsuarioAsignaID { get; set; }
      
        
        [Column("PersonaGestorAsignadoID")]
        public Int64 PersonaGestorAsignadoID { get; set; }
      
        
        [Column("UsuarioGestorAsignadoID")]
        public int UsuarioGestorAsignadoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }


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
