using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.CajaTipoOperacion
{
    public class TiposOperaciones
    {
        public int CajaTipoOperacionID { set; get; }
        public bool Activa { set; get; }
        public int CajaID { set; get; }
        public int Id { set; get; }
        public int CuentaBancoId { set; get; }
        public int CuentaBancoIdNueva { set; get; }
        public bool PuedeSacar { get; set; }
        public bool PuedeRecibir { get; set; }


    }
    public class CuentasCaja
    {
        public int CuentaBancoID { set; get; }
        public int Estatus { set; get; }


    }
    public class AgregarCuentas
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }
        public List<CuentasCaja> CuentasCaja { set; get; }

    }
    public class Agregar
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }
        public List<TiposOperaciones> TiposOperaciones { set; get; }

    }
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CajaID { get; set; }

    }



    public class Actualizar : Agregar
    {



    }
}
