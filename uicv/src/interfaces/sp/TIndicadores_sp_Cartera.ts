/**
 * Type used in this stored procedures:
 * Indicadores.sp_Historicos_Cartera
 */
type Tsp_HiTIndicadores_sp_Cartera = {
    Fecha: string
    SucursalId: number
    Sucursal: string
    GrupoID: number
    CoordinadorID: number
    Coordinador: string
    ProductoID: number
    Producto: string
    TipoCartera: string
    Cartera: number
    Calidad: number
    Dvs_Cartera: number
}

export default Tsp_HiTIndicadores_sp_Cartera