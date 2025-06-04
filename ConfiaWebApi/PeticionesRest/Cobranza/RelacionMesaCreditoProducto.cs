using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int idRelMesaCredProd { get; set; }
        public int ProductoID { get; set; }
    }

    public class updateActivo
    {
        [Required]
        public int idRelMesaCredProd { get; set; }

        [Required]
        public bool Activo { get; set; }

    }

    public class updateVerifDom
    {
        [Required]
        public int idRelMesaCredProd { get; set; }

        [Required]
        public bool verifDom { get; set; }

    }

    public class updateMonitoreo
    {
        [Required]
        public int idRelMesaCredProd { get; set; }

        [Required]
        public bool Monitoreo { get; set; }

    }

    public class updateCobranza
    {
        [Required]
        public int idRelMesaCredProd { get; set; }

        [Required]
        public bool Cobranza { get; set; }

    }

    public class getMesaCobranza
    {
        [Range(minimum: 0, maximum: 999999)]
        public int MesaCobranzaID { get; set; }
    }

    public class add
    {

        public int idRelMesaCredProd { get; set; }
        public int ProductoID { get; set; }
        public string Producto { get; set; }
        public int idTabMora { get; set; }
        //public int MesaCobranzaID { get; set; }

        public Boolean Activo { get; set; }
        public Boolean verifDom { get; set; }
        public Boolean Monitoreo { get; set; }
        public Boolean Cobranza { get; set; }


        //public int limInferiorDias { get; set; }
        //public int limSuperiorDias { get; set; }

        // public string MesaCobranzaDesc { get; set; }
        // public string Valor { get; set; }
        // public string Clave { get; set; }
        //public Boolean ActivoMesaCobranza { get; set; }

        public int DirectorMesaCobranzaID { get; set; }
        public int MesaCobranzaID{ get; set; }

        public Boolean Coordinador { get; set; }
        public Boolean Legal { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }

    }


    public class update
    {
        public int MesaCobranzaID { get; set; }
        public int DirectorMesaCobranzaID { get; set; }
        public Boolean Activo { get; set; }
        public Boolean verifDom { get; set; }
        public Boolean Monitoreo { get; set; }
        public Boolean Cobranza { get; set; }
        public Boolean Coordinador { get; set; }
        public Boolean Legal { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class getDirectores
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class ValidacionAltaRelacionMesaProducto
    {
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class getTabMora
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class getDistribuidoresDiasAtrasos
    {
        public int idRelMesaCredProd { get; set; }
        public int ProductoID { get; set; }

    }

    public class AsignarGestor
    {
        public int DistribuidorID { get; set; }
        public int GestorId { get; set; }
        public int DiasAtraso { get; set; }
        public int ProductoID { get; set; }
        public int idRelMesaCredProd { get; set; }
        public int MesaCobranzaID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class getReferencias
    {
        public int DistribuidorID { get; set; }
    }

    public class getDocumentos
    {
        public int DistribuidorID { get; set; }
    }

    public class getVerDocumentos
    {
        public int PersonasDocID { get; set; }
    }

    public class BucketGet
    {
        public string url { get; set; }
    }

    public class GetPerfil
    {
        public int? PersonaID { get; set; }
    }

    public class getIne
    {
        public int PersonaID { get; set; }

        public string Clave { get; set; }
    }

    public class getGrupo
    {
        public int GrupoID { get; set; }

    }

    public class getDistribuidores
    {
        public int idRelMesaCredProd { get; set; }
        public int ProductoID { get; set; }
        //public int limInferiorDias { get; set; }
        //public int limSuperiorDias { get; set; }

    }

    public class FiltroDistribuidor
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class getReferenciaAvales
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }
    }

    public class getAsignarDistribuidor
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class getMotivosAsignacion
    {
        public int DistribuidorID { get; set; }
    }

    public class AsignarDistribuidor
    {
        public int DistribuidorID { get; set; }
        public int MesaCobranzaID { get; set; }
        public int MotivoID { get; set; }
        public int DiasAtraso { get; set; }
        public decimal Capital { get; set; }
        public decimal SaldoActual { get; set; }
        public int ProductoID { get; set; }
        public int idRelMesaCredProd { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class getGestorCobranza
    {
        public int idRelMesaCredProd { get; set; }

    }

    public class ValidacionBitMesaCobranza
    {
        public int idRelMesaCredProd { get; set; }

        public int GestorID { get; set; }

        public int Filtro { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class getDirecciones
    {
        public int PersonaID { get; set; }
    }

    public class addDireccion
    {
        public int AsentamientoID { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string identificacionNumero { get; set; }
        public int vialidadTipoId { get; set; }
        public int orientacionVialidadTipoId { get; set; }
        public int viviendaTipoId { get; set; }
        public int DistribuidorID { get; set; }
        public string Nota { get; set; }
        public int GestorID { get; set; }
        public int idRelMesaCredProd { get; set; }
        public string ReferenciasGeograficas { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class getSucursales
    {
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }
    }

    public class ValidacionAsignaGestor
    {
        public int DistribuidorID { get; set; }
        public int MesaCobranzaID { get; set; }
        public int ProductoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class getTipoCobranza
    {
        [Range(minimum: 0, maximum: 999999)]
        public int TipoCobranzaID { get; set; }
    }
}
