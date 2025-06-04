import { IAccion } from '../../interfaces/redux/IAccion'
import * as st from './tipos'

export const IdentificaiconesTiposQuery = () => ({ type: st.CATALOGOS__IDENTIFICACIONES_QUERY })
export const IdentificaiconesTiposOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__IDENTIFICACIONES_OK })
export const IdentificaiconesTiposError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__IDENTIFICACIONES_ERROR })

export const SexosTiposQuery = () => ({ type: st.CATALOGOS__SEXOS_QUERY })
export const SexosTiposOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__SEXOS_OK })
export const SexosTiposError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__SEXOS_ERROR })

export const EstadosCivilTiposQuery = () => ({ type: st.CATALOGOS__ESTADO_CIVIL_QUERY })
export const EstadosCivilTiposOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_CIVIL_OK })
export const EstadosCivilTiposError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_CIVIL_ERROR })

export const EscolaridadesQuery = () => ({ type: st.CATALOGOS__ESCOLARIDADES_QUERY })
export const EscolaridadesOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESCOLARIDADES_OK })
export const EscolaridadesError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESCOLARIDADES_ERROR })

export const OcupacionesQuery = () => ({ type: st.CATALOGOS__OCUPACIONES_QUERY })
export const OcupacionesOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__OCUPACIONES_OK })
export const OcupacionesError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__OCUPACIONES_ERROR })

export const VialidadesTipoQuery = () => ({ type: st.CATALOGOS__VIALIDADES_TIPO_QUERY })
export const VialidadesTipoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__VIALIDADES_TIPO_OK })
export const VialidadesTipoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__VIALIDADES_TIPO_ERROR })

export const OrientacionVialidadesTipoQuery = () => ({ type: st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_QUERY })
export const OrientacionVialidadesTipoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_OK })
export const OrientacionVialidadesTipoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ORIENTACION_VIALIDADES_TIPO_ERROR })

export const ViviendasTipoQuery = () => ({ type: st.CATALOGOS__VIVIENDAS_TIPO_QUERY })
export const ViviendasTipoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__VIVIENDAS_TIPO_OK })
export const ViviendasTipoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__VIVIENDAS_TIPO_ERROR })

export const EstatusCreditoQuery = () => ({ type: st.CATALOGOS__ESTATUS_CREDITO_QUERY })
export const EstatusCreditoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTATUS_CREDITO_OK })
export const EstatusCreditoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTATUS_CREDITO_ERROR })

export const EstadoDistribuidorQuery = () => ({ type: st.CATALOGOS__ESTADO_DISTRIBUIDOR_QUERY })
export const EstadoDistribuidorOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_DISTRIBUIDOR_OK })
export const EstadoDistribuidorError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_DISTRIBUIDOR_ERROR })

export const PagareEstatusQuery = () => ({ type: st.CATALOGOS__PAGARE_ESTATUS_QUERY })
export const PagareEstatusOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__PAGARE_ESTATUS_OK })
export const PagareEstatusError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__PAGARE_ESTATUS_ERROR })

export const AsentamientoQuery = () => ({ type: st.CATALOGOS__ASENTAMIENTO_QUERY })
export const AsentamientoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ASENTAMIENTO_OK })
export const AsentamientoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ASENTAMIENTO_ERROR })

export const EstadosPaisTiposQuery = () => ({ type: st.CATALOGOS__ESTADO_PAIS_QUERY })
export const EstadosPaisTiposOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_PAIS_OK })
export const EstadosPaisTiposError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__ESTADO_PAIS_ERROR })

export const TipoViviendaQuery = () => ({ type: st.CATALOGOS__TIPO_VIVIENDA_QUERY })
export const TipoViviendaOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__TIPO_VIVIENDA_OK })
export const TipoViviendaError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__TIPO_VIVIENDA_ERROR })

export const EmpresasExperienciaQuery = () => ({ type: st.CATALOGOS__EMPRESAS_EXPERIENCIA_QUERY })
export const EmpresasExperienciaOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__EMPRESAS_EXPERIENCIA_OK })
export const EmpresasExperienciaError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__EMPRESAS_EXPERIENCIA_ERROR })

export const ParentescoQuery = () => ({ type: st.CATALOGOS__PARENTESCO_QUERY })
export const ParentescoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__PARENTESCO_OK })
export const ParentescoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__PARENTESCO_ERROR })

export const StatusProcesoQuery = () => ({ type: st.CATALOGOS__STATUSPROCESO_QUERY })
export const StatusProcesoOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__STATUSPROCESO_OK })
export const StatusProcesoError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__STATUSPROCESO_ERROR })

export const TipoDistribuidorQuery = () => ({ type: st.CATALOGOS__TIPO_DISTRIBUIDOR_QUERY })
export const TipoDistribuidorOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__TIPO_DISTRIBUIDOR_OK })
export const TipoDistribuidorError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__TIPO_DISTRIBUIDOR_ERROR })

export const CatalogoEmpresasQuery = () => ({ type: st.CATALOGOS__EMPRESAS_QUERY })
export const CatalogoEmpresasOk = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__EMPRESAS_OK })
export const CatalogoEmpresasError = (Payload: any): IAccion => ({ Payload, type: st.CATALOGOS__EMPRESAS_ERROR })