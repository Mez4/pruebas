using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.Roles_Pantallas")]
    [ExplicitColumns]
    [PrimaryKey("RolPantallaID")]
    public class Roles_Pantallas
    {
              
        
        [Column("RolPantallaID")]
        public int RolPantallaID { get; set; }
      
        
        [Column("RolID")]
        public int RolID { get; set; }
      
        
        [Column("PantallaID")]
        public int PantallaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Sistema.Pantallas>> CH__RolesPantallas_Pantallas(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas>("WHERE PantallaID = @PantallaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Roles>> CH__RolesPantallas_Roles(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles>("WHERE RolID = @RolID", this).ToListAsync();
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
