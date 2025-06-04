using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Directores")]
    [ExplicitColumns]
    [PrimaryKey("DirectorID", AutoIncrement=false)]
    public class Directores
    {
              
        
        [Column("DirectorID")]
        public Int64 DirectorID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("LineaCreditoPersonal")]
        public decimal LineaCreditoPersonal { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int? PagareEstatusId { get; set; }
      
        
        [Column("PagareCantidad")]
        public decimal? PagareCantidad { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64 CreacionPersonaID { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("IdentificadorAnterior")]
        public string IdentificadorAnterior { get; set; }
      
        
        [Column("FechaUltimoCredito")]
        public DateTime? FechaUltimoCredito { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int CreacionUsuarioID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__CREACION_PERSONAS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CreacionPersonaID = @PersonaID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE DirectorID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS77DC26C0(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CreacionUsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.PagareEstatus>> CH__PAGARE_ESTATUS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.PagareEstatus>("WHERE PagareEstatusId = @pagareEstatusId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Zonas>> CH__Directore(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @ZonaID", this).ToListAsync();
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
