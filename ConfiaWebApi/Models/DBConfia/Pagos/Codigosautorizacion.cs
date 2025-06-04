using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.CodigosAutorizacion")]
    [ExplicitColumns]
    [PrimaryKey("CodigoAutorizacionID")]
    public class CodigosAutorizacion
    {
              
        
        [Column("CodigoAutorizacionID")]
        public Int64 CodigoAutorizacionID { get; set; }
      
        
        [Column("AutorizacionTipoID")]
        public int AutorizacionTipoID { get; set; }
      
        
        [Column("FHGeneracion")]
        public DateTime FHGeneracion { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("CODIGO")]
        public string CODIGO { get; set; }
      
        
        [Column("Cancelado")]
        public bool Cancelado { get; set; }
      
        
        [Column("Utilizado")]
        public bool Utilizado { get; set; }
      
        
        [Column("FHUtilizacion")]
        public DateTime? FHUtilizacion { get; set; }
      
        
        [Column("Referencia")]
        public Int64 Referencia { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("UsuarioIDUtiliza")]
        public int? UsuarioIDUtiliza { get; set; }
      
        
        [Column("USUGenera")]
        public int USUGenera { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSA0DBE350(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE USUGenera = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS8695F9F9(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDUtiliza = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Pagos.CodigosAutorizacionDetalle>> PA__Pagos___CodigosAutorizacionDetalle___CodigoAutorizacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.CodigosAutorizacionDetalle>("WHERE CodigoAutorizacionID = @CodigoAutorizacionID", this).ToListAsync();
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
