import Tsp_HiTIndicadores_sp_Cartera from "../../../../../../../interfaces/sp/TIndicadores_sp_Cartera"
import Tsp_HiTIndicadores_sp_Historicos from "../../../../../../../interfaces/sp/TIndicadores_sp_Historicos"

type TIndicadorSP = {

    // Cobranza en la sucursal actual a nivel coordinador
    CobranzaPorCoordinador__DiaCero: Tsp_HiTIndicadores_sp_Historicos[]

    // Cobranza en la sucursal actual a nivel socia
    CobranzaPorDistribuidor__DiaCero: Tsp_HiTIndicadores_sp_Historicos[]

    // Obtenemos la cobranza general
    Distribuidoras: Tsp_HiTIndicadores_sp_Historicos[]
    Distribuidoras__0__Diasatraso: Tsp_HiTIndicadores_sp_Historicos[]

    // Cartera de la sucursal
    DetalleCartera__Sucursal: Tsp_HiTIndicadores_sp_Cartera[]
}

// Export our default type
export default TIndicadorSP