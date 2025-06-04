using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.ConciliacionV2")]
    [ExplicitColumns]
    [PrimaryKey("ConciliacionID")]
    public class ConciliacionV2
    {
              
        
        [Column("ConciliacionID")]
        public int ConciliacionID { get; set; }
      
        
        [Column("FechaConsulta")]
        public DateTime FechaConsulta { get; set; }
      
        
        [Column("FechaOperativa")]
        public string FechaOperativa { get; set; }
      
        
        [Column("UsuarioConsulta")]
        public Int64 UsuarioConsulta { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.STP.ConciliacionV2Detalle>> PA__STP___ConciliacionV2Detalle___ConciliacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.STP.ConciliacionV2Detalle>("WHERE ConciliacionID = @ConciliacionID", this).ToListAsync();
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
