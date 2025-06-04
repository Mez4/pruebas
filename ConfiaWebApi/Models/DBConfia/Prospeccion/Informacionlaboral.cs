using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.InformacionLaboral")]
    [ExplicitColumns]
    [PrimaryKey("InformacionLaboralID")]
    public class InformacionLaboral
    {
              
        
        [Column("InformacionLaboralID")]
        public Int64 InformacionLaboralID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("OcupacionID")]
        public int OcupacionID { get; set; }
      
        
        [Column("Sueldo")]
        public decimal Sueldo { get; set; }
      
        
        [Column("Antiguedad")]
        public string Antiguedad { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("Calle")]
        public string Calle { get; set; }
      
        
        [Column("NumeroInterior")]
        public string NumeroInterior { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64 AsentamientoID { get; set; }
      
        
        [Column("id_municipio")]
        public int? id_municipio { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("cp")]
        public int? cp { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Catalogos.Asentamientos>> CH__ASENTAMIENTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Asentamientos>("WHERE AsentamientoID = @AsentamientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

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

        public async Task<List<DBContext.DBConfia.Catalogos.Ocupaciones>> CH__OCUPACION(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Ocupaciones>("WHERE OcupacionID = @Id", this).ToListAsync();
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
