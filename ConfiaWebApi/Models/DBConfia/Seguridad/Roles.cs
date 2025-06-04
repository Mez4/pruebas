using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.Roles")]
    [ExplicitColumns]
    [PrimaryKey("RolID")]
    public class Roles
    {
              
        
        [Column("RolID")]
        public int RolID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Icono")]
        public string Icono { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("RequiereProducto")]
        public bool RequiereProducto { get; set; }
      
        
        [Column("SeccionRolID")]
        public int? SeccionRolID { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Seguridad.Roles_Pantallas>> PA__Seguridad___Roles_Pantallas___RolID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles_Pantallas>("WHERE RolID = @RolID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Roles_Permisos>> PA__Seguridad___Roles_Permisos___RolID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles_Permisos>("WHERE RolID = @RolID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_Roles>> PA__Seguridad___Usuarios_Roles___RolID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE RolID = @RolID", this).ToListAsync();
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
