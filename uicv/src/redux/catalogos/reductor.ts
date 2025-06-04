import { IAccion } from '../../interfaces/redux/IAccion'
import * as st from './tipos'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'

// Seguridad por defecto
export const EstadoPorDefecto: ICatalogos = {
    IdentificacionesTipos: { Cargando: false, Error: false },
    Sexos: { Cargando: false, Error: false },
    EstadosCiviles: { Cargando: false, Error: false },
    Escolaridades: { Cargando: false, Error: false },
    Ocupaciones: { Cargando: false, Error: false },
    VialidadesTipo: { Cargando: false, Error: false },
    OrientacionVialidadTipo: { Cargando: false, Error: false },
    ViviendasTipo: { Cargando: false, Error: false },
    EstatusCredito: { Cargando: false, Error: false },
    EstadisDistribuidor: { Cargando: false, Error: false },
    PagareEstatus: { Cargando: false, Error: false },
    Asentamientos: { Cargando: false, Error: false },
    EstadosPais: { Cargando: false, Error: false },
    TipoVivienda: { Cargando: false, Error: false },
    EmpresasExperiencia: { Cargando: false, Error: false },
    Parentescos: { Cargando: false, Error: false },
    StatusProcesos: { Cargando: false, Error: false },
    TipoDistribuidor: { Cargando: false, Error: false },
    Empresas: { Cargando: false, Error: false }
}

// Generar el reductor por defecto
const Reductor = (Estado: ICatalogos = EstadoPorDefecto, Accion: IAccion): ICatalogos => {

    // Iteramos los tipos de acciones
    switch (Accion.type) {

        // Funciones para los tipos de identificaion
        case st.CATALOGOS__IDENTIFICACIONES_QUERY: return { ...Estado, IdentificacionesTipos: { Error: false, Cargando: true } }
        case st.CATALOGOS__IDENTIFICACIONES_OK: return { ...Estado, IdentificacionesTipos: { Datos: Accion.Payload, Error: false, Cargando: false } }
        case st.CATALOGOS__IDENTIFICACIONES_ERROR: return { ...Estado, IdentificacionesTipos: { Error: true, Cargando: false } }

        // Funciones para los sexos
        case st.CATALOGOS__SEXOS_QUERY: return { ...Estado, Sexos: { Error: false, Cargando: true } }
        case st.CATALOGOS__SEXOS_OK: return { ...Estado, Sexos: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__SEXOS_ERROR: return { ...Estado, Sexos: { Error: true, Cargando: false } }

        // Funciones para los estados civiles
        case st.CATALOGOS__ESTADO_CIVIL_QUERY: return { ...Estado, EstadosCiviles: { Error: false, Cargando: true } }
        case st.CATALOGOS__ESTADO_CIVIL_OK: return { ...Estado, EstadosCiviles: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ESTADO_CIVIL_ERROR: return { ...Estado, Sexos: { Error: true, Cargando: false } }

        // Funciones para los escolaridades
        case st.CATALOGOS__ESCOLARIDADES_QUERY: return { ...Estado, Escolaridades: { Error: false, Cargando: true } }
        case st.CATALOGOS__ESCOLARIDADES_OK: return { ...Estado, Escolaridades: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ESCOLARIDADES_ERROR: return { ...Estado, Escolaridades: { Error: true, Cargando: false } }

        // Funciones para los ocupaciones
        case st.CATALOGOS__OCUPACIONES_QUERY: return { ...Estado, Ocupaciones: { Error: false, Cargando: true } }
        case st.CATALOGOS__OCUPACIONES_OK: return { ...Estado, Ocupaciones: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__OCUPACIONES_ERROR: return { ...Estado, Ocupaciones: { Error: true, Cargando: false } }

        // Funciones para los tipos de vialidad
        case st.CATALOGOS__VIALIDADES_TIPO_QUERY: return { ...Estado, VialidadesTipo: { Error: false, Cargando: true } }
        case st.CATALOGOS__VIALIDADES_TIPO_OK: return { ...Estado, VialidadesTipo: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__VIALIDADES_TIPO_ERROR: return { ...Estado, VialidadesTipo: { Error: true, Cargando: false } }

        // Funciones para los tipos de oriendacion de vialidad
        case st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_QUERY: return { ...Estado, OrientacionVialidadTipo: { Error: false, Cargando: true } }
        case st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_OK: return { ...Estado, OrientacionVialidadTipo: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_ERROR: return { ...Estado, OrientacionVialidadTipo: { Error: true, Cargando: false } }

        // Funciones para los tipos de vivienda
        case st.CATALOGOS__VIVIENDAS_TIPO_QUERY: return { ...Estado, ViviendasTipo: { Error: false, Cargando: true } }
        case st.CATALOGOS__VIVIENDAS_TIPO_OK: return { ...Estado, ViviendasTipo: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__VIVIENDAS_TIPO_ERROR: return { ...Estado, ViviendasTipo: { Error: true, Cargando: false } }

        // Funciones para los tipos de vivienda
        case st.CATALOGOS__ESTATUS_CREDITO_QUERY: return { ...Estado, EstatusCredito: { Error: false, Cargando: true } }
        case st.CATALOGOS__ESTATUS_CREDITO_OK: return { ...Estado, EstatusCredito: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ESTATUS_CREDITO_ERROR: return { ...Estado, EstatusCredito: { Error: true, Cargando: false } }

        // Funciones para el estatus pagare
        case st.CATALOGOS__PAGARE_ESTATUS_QUERY: return { ...Estado, PagareEstatus: { Error: false, Cargando: true } }
        case st.CATALOGOS__PAGARE_ESTATUS_OK: return { ...Estado, PagareEstatus: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__PAGARE_ESTATUS_ERROR: return { ...Estado, PagareEstatus: { Error: true, Cargando: false } }

        case st.CATALOGOS__ASENTAMIENTO_QUERY: return { ...Estado, Asentamientos: { Error: false, Cargando: true } }
        case st.CATALOGOS__ASENTAMIENTO_OK: return { ...Estado, Asentamientos: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ASENTAMIENTO_ERROR: return { ...Estado, Asentamientos: { Error: true, Cargando: false } }

        // Funciones para los estados pais
        case st.CATALOGOS__ESTADO_PAIS_QUERY: return { ...Estado, EstadosPais: { Error: false, Cargando: true } }
        case st.CATALOGOS__ESTADO_PAIS_OK: return { ...Estado, EstadosPais: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__ESTADO_PAIS_ERROR: return { ...Estado, EstadosPais: { Error: true, Cargando: false } }

        // Funciones para los tipos de vivienda en prospeccion
        case st.CATALOGOS__TIPO_VIVIENDA_QUERY: return { ...Estado, TipoVivienda: { Error: false, Cargando: true } }
        case st.CATALOGOS__TIPO_VIVIENDA_OK: return { ...Estado, TipoVivienda: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__TIPO_VIVIENDA_ERROR: return { ...Estado, TipoVivienda: { Error: true, Cargando: false } }
        // Por defecto, regresar el estado vacio

        // Funciones para las empresas experiencia en prospeccion
        case st.CATALOGOS__EMPRESAS_EXPERIENCIA_QUERY: return { ...Estado, EmpresasExperiencia: { Error: false, Cargando: true } }
        case st.CATALOGOS__EMPRESAS_EXPERIENCIA_OK: return { ...Estado, EmpresasExperiencia: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__EMPRESAS_EXPERIENCIA_ERROR: return { ...Estado, EmpresasExperiencia: { Error: true, Cargando: false } }

        // Funciones para las empresas experiencia en prospeccion
        case st.CATALOGOS__PARENTESCO_QUERY: return { ...Estado, Parentescos: { Error: false, Cargando: true } }
        case st.CATALOGOS__PARENTESCO_OK: return { ...Estado, Parentescos: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__PARENTESCO_ERROR: return { ...Estado, Parentescos: { Error: true, Cargando: false } }

        // Funciones para los statusProcesos
        case st.CATALOGOS__STATUSPROCESO_QUERY: return { ...Estado, StatusProcesos: { Error: false, Cargando: true } }
        case st.CATALOGOS__STATUSPROCESO_OK: return { ...Estado, StatusProcesos: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__STATUSPROCESO_ERROR: return { ...Estado, StatusProcesos: { Error: true, Cargando: false } }

        // Funciones para los tipos de socia en prospeccion
        case st.CATALOGOS__TIPO_DISTRIBUIDOR_QUERY: return { ...Estado, TipoDistribuidor: { Error: false, Cargando: true } }
        case st.CATALOGOS__TIPO_DISTRIBUIDOR_OK: return { ...Estado, TipoDistribuidor: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__TIPO_DISTRIBUIDOR_ERROR: return { ...Estado, TipoDistribuidor: { Error: true, Cargando: false } }

        // Funciones para las empresas experiencia en prospeccion
        case st.CATALOGOS__EMPRESAS_QUERY: return { ...Estado, Empresas: { Error: false, Cargando: true } }
        case st.CATALOGOS__EMPRESAS_OK: return { ...Estado, Empresas: { Error: false, Cargando: false, Datos: Accion.Payload } }
        case st.CATALOGOS__EMPRESAS_ERROR: return { ...Estado, Empresas: { Error: true, Cargando: false } }

        // Por defecto, regresar el estado vacio
        default:
            return Estado
    }
}
export default Reductor