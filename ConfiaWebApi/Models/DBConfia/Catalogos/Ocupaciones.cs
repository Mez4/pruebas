using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.Ocupaciones")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class Ocupaciones
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("Ocupacion")]
        public string Ocupacion { get; set; }
      
        
        [Column("PuestoFinanciera")]
        public bool? PuestoFinanciera { get; set; }
      
        
        [Column("EsPromotor")]
        public bool? EsPromotor { get; set; }
      
        
        [Column("EsCoordinador")]
        public bool? EsCoordinador { get; set; }
      
        
        [Column("EsCajero")]
        public bool? EsCajero { get; set; }
      
        
        [Column("EsGestor")]
        public bool? EsGestor { get; set; }
      
        
        [Column("EsDirector")]
        public bool? EsDirector { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Empleos>> PA__General___Empleos___OcupacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empleos>("WHERE Id = @OcupacionID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionLaboral>> PA__Prospeccion___InformacionLaboral___OcupacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionLaboral>("WHERE Id = @OcupacionID", this).ToListAsync();
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
