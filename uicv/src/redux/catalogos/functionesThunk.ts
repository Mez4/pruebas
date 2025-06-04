// Importar las acciones comunes de redux
import * as sa from './acciones'
import axios from 'axios'
import { GetServerUrl } from '../../global/variables'
import { IEstado } from '../../interfaces/redux/IEstado'

/** Tipos de identificaciones */
export const IndeitifacionesTipos = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.IdentificacionesTipos?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            if (state.Catalogos.TipoVivienda.Cargando === false)
                dispatch(sa.IdentificaiconesTiposQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Catalogos/IdentificacionesTipos/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.IdentificaiconesTiposOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.IdentificaiconesTiposError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const Sexos = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Sexos?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.SexosTiposQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/sexo/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.SexosTiposOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.SexosTiposError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const EstadosCiviles = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.EstadosCiviles?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EstadosCivilTiposQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/estadocivil/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.EstadosCivilTiposOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EstadosCivilTiposError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const Escolaridades = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Escolaridades?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EscolaridadesQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/escolaridad/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.EscolaridadesOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EscolaridadesError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const Ocupaciones = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Ocupaciones?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.OcupacionesQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/ocupacion/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.OcupacionesOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.OcupacionesError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const VialidadesTipo = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.VialidadesTipo?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.VialidadesTipoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/tipovialidad/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.VialidadesTipoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.VialidadesTipoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })


/** Tipos de identificaciones */
export const OrientacionVialidadesTipo = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.OrientacionVialidadTipo?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.OrientacionVialidadesTipoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/tipoorientacionvialidad/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.OrientacionVialidadesTipoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.OrientacionVialidadesTipoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const ViviendasTipo = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.ViviendasTipo?.Cargando)
                return

            // console.log('state viviendas: ', state.Catalogos.ViviendasTipo)

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.ViviendasTipoQuery())

            // console.log('despues de dispatch')

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/tipovivienda/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    console.log('tipovivienda: ', respuesta)

                    if (respuesta.data === undefined)
                        throw "No data"

                    // despachar a redux
                    dispatch(sa.ViviendasTipoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.ViviendasTipoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const EstatusCredito = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.ViviendasTipo?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EstatusCreditoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/EstatusCredito/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.EstatusCreditoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EstatusCreditoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

export const EstatusArchivo = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.ViviendasTipo?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EstatusCreditoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Archivo/Archivo/getEstatus`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.EstatusCreditoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EstatusCreditoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })
export const PagareEstatus = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.PagareEstatus?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.PagareEstatusQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/PagareEstatus/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.PagareEstatusOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.PagareEstatusError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

export const Asentamientos = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Asentamientos?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.AsentamientoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}catalogos/Asentamiento/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.AsentamientoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.AsentamientoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const EstadosPais = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.EstadosPais?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EstadosPaisTiposQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Catalogos/EstadosPais/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {
                    // despachar a redux
                    dispatch(sa.EstadosPaisTiposOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EstadosPaisTiposError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const TiposViviendas = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.TipoVivienda?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.TipoViviendaQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Prospeccion/TipoVivienda/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.TipoViviendaOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.TipoViviendaError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const EmpresasExperiencia = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.EmpresasExperiencia?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.EmpresasExperienciaQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Prospeccion/EmpresasExperiencia/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.EmpresasExperienciaOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.EmpresasExperienciaError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const Empresas = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Empresas?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.CatalogoEmpresasQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}General/Empresa/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.CatalogoEmpresasOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.CatalogoEmpresasError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos de identificaciones */
export const Parentesco = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.Parentescos?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.ParentescoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Prospeccion/Parentesco/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.ParentescoOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.ParentescoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** StatusProceso */
export const StatusProceso = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.StatusProcesos?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.StatusProcesoQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Prospeccion/StatusProceso/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.StatusProcesoOk(respuesta?.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta?.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.StatusProcesoError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/** Tipos Distribuidores */
export const TiposDistribuidores = (valores: {}) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any, getState: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Obtenemos el estado general de la aplicacion
            let state: IEstado = getState()
            if (state.Catalogos.TipoDistribuidor?.Cargando)
                return

            // Despachamos la promesa para obtener el usuario
            dispatch(sa.TipoDistribuidorQuery())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Catalogos/DistribuidoresTipos/get`, valores, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.oidc.user.access_token}` } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.TipoDistribuidorOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.TipoDistribuidorError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })
