using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposDesembolso")]
    [ExplicitColumns]
    [PrimaryKey("TipoDesembolsoID")]
    public class TiposDesembolso
    {
              
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("FormatoImpresionExtra")]
        public bool FormatoImpresionExtra { get; set; }
      
        
        [Column("datoTipoID")]
        public int datoTipoID { get; set; }
      
        
        [Column("RequiereDatosBancarios")]
        public bool? RequiereDatosBancarios { get; set; }
      
        
        [Column("EsEnApp")]
        public bool? EsEnApp { get; set; }
      
        
        [Column("iconoDesembolsoTipo")]
        public string iconoDesembolsoTipo { get; set; }
      
        
        [Column("Modificable")]
        public bool? Modificable { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Bancos.CuentasDesembolsosTipos>> PA__Bancos___CuentasDesembolsosTipos___tipoDesembolsoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasDesembolsosTipos>("WHERE TipoDesembolsoID = @tipoDesembolsoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___TipoDesembolsoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE TipoDesembolsoID = @TipoDesembolsoID", this).ToListAsync();
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
