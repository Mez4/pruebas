import Tsp_HiTIndicadores_sp_Cartera from "../../../../../../../interfaces/sp/TIndicadores_sp_Cartera"
import TIndicadores_sp_ColocacionImproductivo from "../../../../../../../interfaces/sp/TIndicadores_sp_ColocacionImproductivo"
import Tsp_HiTIndicadores_sp_Historicos from "../../../../../../../interfaces/sp/TIndicadores_sp_Historicos"

type TIndicadorSP = {
    Coordinador: Tsp_HiTIndicadores_sp_Historicos
    Cartera: Tsp_HiTIndicadores_sp_Cartera[]
    Cuentas0DiasAtraso: Tsp_HiTIndicadores_sp_Historicos[]
    ColocacionImproductivas: TIndicadores_sp_ColocacionImproductivo[],
    Distribuidoras__1_15__Diasatraso: Tsp_HiTIndicadores_sp_Historicos[]
    Distribuidoras__1_45__Diasatraso: Tsp_HiTIndicadores_sp_Historicos[]
    Distribuidoras__46_90__Diasatraso: Tsp_HiTIndicadores_sp_Historicos[]
}

// Export our default type
export default TIndicadorSP