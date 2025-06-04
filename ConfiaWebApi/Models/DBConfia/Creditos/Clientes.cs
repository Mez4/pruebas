using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Clientes")]
    [ExplicitColumns]
    [PrimaryKey("ClienteID", AutoIncrement=false)]
    public class Clientes
    {
              
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("LineaCreditoPersonal")]
        public decimal LineaCreditoPersonal { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int PagareEstatusId { get; set; }
      
        
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
      
        
        [Column("AltaEnApp")]
        public bool? AltaEnApp { get; set; }
      
        
        [Column("CanjeaVale")]
        public bool? CanjeaVale { get; set; }
      
        
        [Column("FrenteINE")]
        public string FrenteINE { get; set; }
      
        
        [Column("ReversoINE")]
        public string ReversoINE { get; set; }


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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE ClienteID = @PersonaID", this).ToListAsync();
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___ClienteID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE ClienteID = @ClienteID", this).ToListAsync();
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
