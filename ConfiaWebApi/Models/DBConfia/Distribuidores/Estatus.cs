using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Estatus")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidoresEstatusID", AutoIncrement=false)]
    public class Estatus
    {
              
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }
      
        
        [Column("PuedeCanjear")]
        public bool PuedeCanjear { get; set; }
      
        
        [Column("AsignaUsuario")]
        public bool AsignaUsuario { get; set; }
      
        
        [Column("Especial")]
        public bool Especial { get; set; }
      
        
        [Column("Convenio")]
        public bool Convenio { get; set; }
      
        
        [Column("Orden")]
        public int Orden { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortes>> PA__Cortes___RelacionCortes___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesHistorico>> PA__Cortes___RelacionCortesHistorico___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesHistorico>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> PA__Distribuidores___Distribuidores___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Dictamen>> PA__Prospeccion___Dictamen___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Dictamen>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___DistribuidoresEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
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
