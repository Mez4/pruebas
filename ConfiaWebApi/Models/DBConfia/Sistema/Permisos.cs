using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.Permisos")]
    [ExplicitColumns]
    [PrimaryKey("PermisoID")]
    public class Permisos
    {
              
        
        [Column("PermisoID")]
        public int PermisoID { get; set; }
      
        
        [Column("PantallaID")]
        public int PantallaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Especial")]
        public bool Especial { get; set; }
      
        
        [Column("RestUrl")]
        public string RestUrl { get; set; }
      
        
        [Column("RestMetodo")]
        public string RestMetodo { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("PermisoHeader")]
        public bool? PermisoHeader { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Sistema.Pantallas>> CH__Permisos_Pantallas(DBConfiaContext parContext)
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Roles_Permisos>> PA__Seguridad___Roles_Permisos___PermisoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles_Permisos>("WHERE PermisoID = @PermisoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales>> PA__Seguridad___Usuarios_PermisosEspeciales___PermisoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales>("WHERE PermisoID = @PermisoID", this).ToListAsync();
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
