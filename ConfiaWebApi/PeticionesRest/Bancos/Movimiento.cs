using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.Movimiento
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public int Id { get; set; }
    }

    public class Add
    {
        
    }

    public class Update
    {

    }
}
