using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.Asentamientos")]
    [ExplicitColumns]
    [PrimaryKey("AsentamientoID")]
    public class Asentamientos
    {
              
        
        [Column("AsentamientoID")]
        public Int64 AsentamientoID { get; set; }
      
        
        [Column("CodigoPostal")]
        public int CodigoPostal { get; set; }
      
        
        [Column("Asentamiento")]
        public string Asentamiento { get; set; }
      
        
        [Column("Tipo_asenta")]
        public string Tipo_asenta { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("oficina_postal")]
        public string oficina_postal { get; set; }
      
        
        [Column("id_estado")]
        public int? id_estado { get; set; }
      
        
        [Column("id_oficina_postal")]
        public string id_oficina_postal { get; set; }
      
        
        [Column("c_CP")]
        public string c_CP { get; set; }
      
        
        [Column("id_tipo_asentamiento")]
        public int? id_tipo_asentamiento { get; set; }
      
        
        [Column("id_municipio")]
        public int? id_municipio { get; set; }
      
        
        [Column("id_asentamiento")]
        public int? id_asentamiento { get; set; }
      
        
        [Column("zona")]
        public string zona { get; set; }
      
        
        [Column("id_ciudad")]
        public int? id_ciudad { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___AsentamientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Domicilios>> PA__Prospeccion___Domicilios___AsentamientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Domicilios>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionLaboral>> PA__Prospeccion___InformacionLaboral___AsentamientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionLaboral>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionOtraVivienda>> PA__Prospeccion___InformacionOtraVivienda___AsentamientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionOtraVivienda>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Interesados>> PA__Prospeccion___Interesados___AsentamientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
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
