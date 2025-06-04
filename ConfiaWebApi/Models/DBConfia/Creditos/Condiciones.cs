using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Condiciones")]
    [ExplicitColumns]
    [PrimaryKey("CondicionesID,ProductoID", AutoIncrement=false)]
    public class Condiciones
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CondicionesID")]
        public int CondicionesID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("ModificoFecha")]
        public DateTime ModificoFecha { get; set; }
      
        
        [Column("ModificoUsuarioId")]
        public int ModificoUsuarioId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS1C82417F(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ModificoUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS50EAB86C(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE RegistroUsuarioId = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Creditos.CondicionesDetalle>> PA__Creditos___CondicionesDetalle___CondicionesID__ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesDetalle>("WHERE CondicionesID = @CondicionesID AND ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesSucursal>> PA__Creditos___CondicionesSucursal___ProductoID__CondicionesID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesSucursal>("WHERE ProductoID = @ProductoID AND CondicionesID = @CondicionesID", this).ToListAsync();
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
