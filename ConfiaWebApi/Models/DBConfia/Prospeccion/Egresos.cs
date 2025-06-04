using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Egresos")]
    [ExplicitColumns]
    [PrimaryKey("EgresoID")]
    public class Egresos
    {
              
        
        [Column("EgresoID")]
        public Int64 EgresoID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("TipoViviendaID")]
        public Int64 TipoViviendaID { get; set; }
      
        
        [Column("Alimentacion")]
        public decimal Alimentacion { get; set; }
      
        
        [Column("TarjetaCreido")]
        public decimal TarjetaCreido { get; set; }
      
        
        [Column("RentaPagoVivienda")]
        public decimal RentaPagoVivienda { get; set; }
      
        
        [Column("ServiciosDomesticos")]
        public decimal ServiciosDomesticos { get; set; }
      
        
        [Column("Otros")]
        public decimal Otros { get; set; }
      
        
        [Column("EgresoTotal")]
        public decimal EgresoTotal { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.TipoPersona>> CH__TIPO_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoPersona>("WHERE TipoPersonaID = @TipoPersonaID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.TipoVivienda>> CH__TIPO_VIVIENDA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoVivienda>("WHERE TipoViviendaID = @TipoViviendaID", this).ToListAsync();
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
