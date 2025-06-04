using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Referencias")]
    [ExplicitColumns]
    [PrimaryKey("ReferenciaID")]
    public class Referencias
    {
              
        
        [Column("ReferenciaID")]
        public Int64 ReferenciaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("numeroReferencia")]
        public int numeroReferencia { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("parentesco")]
        public string parentesco { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("domicilio")]
        public string domicilio { get; set; }
      
        
        [Column("edad")]
        public int edad { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.TipoPersona>> CH__TIPO_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoPersona>("WHERE TipoPersonaID = @TipoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

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
