using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Zonas")]
    [ExplicitColumns]
    [PrimaryKey("ZonaID")]
    public class Zonas
    {
              
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int CreacionUsuarioID { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public int? PersonaResponsableID { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Directores>> PA__General___Directores___ZonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE ZonaID = @ZonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> PA__General___Sucursales___ZonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE ZonaID = @ZonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
