/**
 * Type used in this stored procedures:
 * Indicadores.sp_Historicos_Cobranza_CeroDias
 * Indicadores.sp_Historicos_Cobranza_DiasAtraso
 */
type TIndicadores_sp_ColocacionImproductivo = {
    Fecha: string
    SucursalId: number
    Sucursal: string
    GrupoID: number
    CoordinadorID: number
    Coordinador: string
    DistribuidorID: number
    Distribuidor: string
    DistribuidorVR: string
    TipoPago: string
    Limite: number
    Disponible: number
    Porc_Disponible: number
    Colocacion: number
    Bono: number
    ColocacionAnterior: number
}

export default TIndicadores_sp_ColocacionImproductivo