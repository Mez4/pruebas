using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.PeticionesRest.Creditos.TienditaCodigos
{
    public class Get
    {
        public int Id { get; set; }
    }

    public class Add
    {
        public int SKU { get; set; }
        public int Descuento { get; set; }
        public int SucursalID { get; set; }
        public int DistribuidorID { get; set; }
        public int ClienteID    { get; set; }
        public string Motivo { get; set; }


    }

    public class Update
    {
        public int CodigoID { get; set; }

        public int Descuento { get; set; }
    }

    public class Activar
    {
        public int CodigoID { get; set; }
    }

    public class Descuento
    {
        public int id { get; set; }
    }

    public class ValidarCodigo
    {
        public string Codigo { get; set; }

        public Int64 DistribuidorID { get; set; }

        public Int64? ClienteID { get; set; }
        
        public Int64 SKU { get; set; }
    }
    
}
