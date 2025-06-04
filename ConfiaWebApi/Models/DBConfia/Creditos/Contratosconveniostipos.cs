using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ContratosConveniosTipos")]
    [ExplicitColumns]
    [PrimaryKey("convenioTipoID")]
    public class ContratosConveniosTipos
    {
              
        
        [Column("convenioTipoID")]
        public int convenioTipoID { get; set; }
      
        
        [Column("convenioDesc")]
        public string convenioDesc { get; set; }
      
        
        [Column("factorBonificacion")]
        public decimal factorBonificacion { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("porcBonificacion")]
        public decimal? porcBonificacion { get; set; }
      
        
        [Column("validaSaldo")]
        public bool validaSaldo { get; set; }
      
        
        [Column("saldoMin")]
        public decimal saldoMin { get; set; }
      
        
        [Column("saldoMax")]
        public decimal saldoMax { get; set; }
      
        
        [Column("plazosFijos")]
        public int plazosFijos { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___convenioTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE convenioTipoID = @convenioTipoID", this).ToListAsync();
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
