using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Conekta
{
    public class CajaRecibida
    {
        public int cajaTipoOperacionID { set; get; }
        public bool activa { set; get; }
        public int cajaId { set; get; }
        public int tipoMovID { set; get; }
        public int cuentaBancoID { set; get; }

    }

    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

    }

    public class Agregar
    {
        public List<CajaRecibida> tipoOperacion { set; get; }

    }

    public class Actualizar : Agregar
    {



    }
}