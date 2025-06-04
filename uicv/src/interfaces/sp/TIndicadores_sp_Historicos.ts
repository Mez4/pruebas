/**
 * Type used in this stored procedures:
 * Indicadores.sp_Historicos_Cobranza_CeroDias
 * Indicadores.sp_Historicos_Cobranza_DiasAtraso
 */
type Tsp_HiTIndicadores_sp_Historicos = {
    Fecha: string
    SucursalId: number
    Sucursal: string
    GrupoID: number
    CoordinadorID: number
    Coordinador: string
    DistribuidorID: number
    Distribuidor: string
    DistribuidorEstatus: string
    DistribuidorVR: string
    TipoPago: string
    Vencido: number
    CobranzaPA: number
    CobranzaPP: number
    CobranzaPI: number
    CobranzaPT: number
    CobranzaSP: number
    CobranzaFinal: number
    Pendiente: number
    Saldo: number
    DiasAtraso: number
    Porc_CobranzaPA: number
    Porc_CobranzaPP: number
    Porc_CobranzaPI: number
    Porc_CobranzaPT: number
    Porc_CobranzaSP: number
    Porc_CobranzaFinal: number
    Porc_Pendiente: number
    Porc_Peso: number
    Peso_CobranzaPA: number
    Peso_CobranzaPP: number
    Peso_CobranzaPI: number
    Peso_CobranzaPT: number
    Peso_CobranzaSP: number
    Peso_CobranzaFinal: number
    Peso_Pendiente: number
    Dvs_Vencido: number
    Dvs_CobranzaPA: number
    Dvs_CobranzaPP: number
    Dvs_CobranzaPI: number
    Dvs_CobranzaPT: number
    Dvs_CobranzaSP: number
    Dvs_CobranzaFinal: number
    Dvs_Pendiente: number
}

export default Tsp_HiTIndicadores_sp_Historicos