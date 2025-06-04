using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.RentaLocalDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID")]
    public class RentaLocalDetalle
    {
              
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("Nombre_suc")]
        public string Nombre_suc { get; set; }
      
        
        [Column("Monto")]
        public decimal? Monto { get; set; }
      
        
        [Column("Fecha_inicio")]
        public DateTime? Fecha_inicio { get; set; }
      
        
        [Column("Fecha_Fin")]
        public DateTime? Fecha_Fin { get; set; }
      
        
        [Column("EstatusSucursal")]
        public bool EstatusSucursal { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("DiasRestantes")]
        public int? DiasRestantes { get; set; }
      
        
        [Column("DetalleSuc")]
        public string DetalleSuc { get; set; }
      
        
        [Column("ContratoID")]
        public int ContratoID { get; set; }
      
        
        [Column("DocContrato")]
        public string DocContrato { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__RentaLoca(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalId = @SucursalID", this).ToListAsync();
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
