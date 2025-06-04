import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'

import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoBoveda/Funciones'
import { toast } from 'react-toastify'
import * as FuncionesCuentasBanco from './BancoCuentas/Funciones'
import * as FuncionesBancoNuevo from './BancoBancos/Funciones'
import * as FuncionesCuentaContable from '../CompTesoreria/CatalogoCuentasContables/Funciones'
import { date } from 'yup/lib/locale'
import * as FuncionesCaja from '../CompTesoreria/CatalogoCaja/Funciones'
import ReactTooltip from 'react-tooltip';

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaUnlock, FaPrint } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoBoveda/CForm'
import { CFormCuentasBancos } from './CatalogoBoveda/CFormCuentasBancos'
import { CFormBancoNuevo } from './CatalogoBoveda/CFormBancoNuevo'
import { CFormCuentasContables } from './CatalogoBoveda/CFormCuentasContables'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { DBConfia_Tesoreria } from '../../../../../interfaces_db/DBConfia/Tesoreria'
import { CFormBovedaArqueos } from './CatalogoBoveda/CFormBovedaArqueos'

import { CFormArqueoBoveda } from './CatalogoBoveda/CFormArqueoBoveda'

type EstadoTipo = {
    Habilitar: boolean
    Filtro: string
    Cargando: boolean
    Error: boolean
    Form: any
    CargandoModal: boolean,
    Datos: DBConfia_Tesoreria.ICatalogoBoveda[]
    DatosMostrar: DBConfia_Tesoreria.ICatalogoBoveda[]
    OptionsUsuario: any[]
    OptionsSucursal: any[]
    OptionsCuenta: any[]
    OptionsCuentaBanco: any[]
    OptionsAcumula: any[]
    OptionsBanco: any[]
    OptionsAgrupacion: any[]
    OptionsTipoBanco: any[]
    OptionsArchivosDispersion: any[]
    OptionsBancosNuevos: any[]
    OptionsSucursales: any[],

    OptionsAcumula2: any[]
    OptionsTipo2: any[]
    OptionsNaturaleza2: any[]
    OptionsRubro2: any[]
    OptionsEmpresa2: any[]
    OptionsMoneda2: any[]
    OptionsTipoBanco2: any[]

    OptionsCuentaBancos: any[]

    DatosTabla: any[]
    TotalGeneral: number
    BovedaID: number
    MostrarBoveda: boolean

}

type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoBoveda = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto: any = {
        BovedaID: 0,
        Nombre: "",
        Clave: "",
        PersonaID: 0,
        CuentaID: 0,
        Activa: true,
        //BancoID: 0,
        SucursalID: -1,
        NombreResponsble: "",
        NombreCuentaContable: "",
    }
    const DatosDefectoCuentasBancos = {
        cuentaBancoID: 0,
        numeroCuenta: '',
        bancoID: 0,
        cuentaID: 0,
        activo: true,
        puedeDispersar: true,
        dispersionConvenio: '',
        global: true,
        saldoMin: 0,
        saldoMax: 0,
        excedenteSaldo: 0,
        agrupacionID: 0
    }
    const DatosDefectoBancoNuevo = {
        bancoID: 0,
        nombre: '',
        activo: true,
        archivoDispersionID: 0,
        tipoBancoID: 0
    }
    const DatosDefectoCuentaContable = {
        id: 0,
        cuenta: '',
        acumulaCuentaId: 0,
        nombre: '',
        tipoId: 0,
        naturalezaId: 0,
        rubroId: 0,
        empresaId: 0,
        monedaId: 0,
        activa: true,
        fechaRegistro: date,
        tipoBancoID: 0
    }


    const [state, setState] = React.useState<EstadoTipo>({
        OptionsSucursales: [],
        Habilitar: true,
        OptionsBancosNuevos: [],
        Datos: [],
        DatosMostrar: [],
        OptionsCuentaBancos: [],
        Filtro: '',
        DatosTabla: [],
        TotalGeneral: 0.0,
        BovedaID: 0,
        MostrarBoveda: false,
        // nombre: '',
        Cargando: true,
        Error: false,
        CargandoModal: true,
        Form:
        {
            BovedaID: undefined,
            Mostrar: false,
            MostrarCuentasBancos: false,
            Datos: DatosDefecto,
            DatosCuentasBancos: DatosDefectoCuentasBancos,
            MostrarBancoNuevo: false,
            DatosBancoNuevo: DatosDefectoBancoNuevo,
            MostrarCuentaContable: false,
            DatosCuentaContable: DatosDefectoCuentaContable,
            BobedaID: undefined,
            Nuevo: false,
            Id: undefined,
            IdCuentaContable: undefined,
            MostrarArqueos: false,
            IdBoveda: 0

        },
        OptionsUsuario: [],
        OptionsSucursal: [],
        OptionsCuenta: [],
        OptionsCuentaBanco: [],
        OptionsAcumula: [],
        OptionsBanco: [],
        OptionsAgrupacion: [],
        OptionsTipoBanco: [],
        OptionsArchivosDispersion: [],
        OptionsAcumula2: [],
        OptionsTipo2: [],
        OptionsNaturaleza2: [],
        OptionsRubro2: [],
        OptionsEmpresa2: [],
        OptionsMoneda2: [],
        OptionsTipoBanco2: []
    })
    const FNGetSucursales = () => {
        Funciones.FNGetSucursales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var tipo = respuesta.map((valor: any) => {
                        var obj = { value: valor.sucursalId, label: valor.sucursal };
                        return obj
                    });
                    console.log("RESP SUC ,", respuesta)
                    setState(s => ({ ...s, OptionsSucursales: tipo }))
                    console.log("STATE SUCURSALES ,", state.OptionsSucursales)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursales: [] }))

                }
            })
    }

    const [activarDesactivarConcepto, setActivarDesactivarConcepto] = React.useState(false)
    const cerrarModalBancos = () => {
        FnGetCuentaBanco2()
        FnGetCuentaBanco()
        setState({ ...state, Form: { ...state.Form, MostrarCuentasBancos: true, Mostrar: false } })

    }

    const FnGetAcumulaCuentacontable = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula2: acumula }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula2: [] }))
                }
            })
    }
    const FnGetTipo = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetTipos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var tipo = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsTipo2: tipo }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipo2: [] }))
                }
            })
    }
    const FnGetNaturaleza = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetNaturalezas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var naturaleza = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsNaturaleza2: naturaleza }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsNaturaleza2: [] }))
                }
            })
    }
    const FnGetRubro = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetRubros(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var rubro = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsRubro2: rubro }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsRubro2: [] }))
                }
            })
    }
    const FnGetEmpresa = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetEmpresas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var empresa = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsEmpresa2: empresa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsEmpresa2: [] }))
                }
            })
    }

    const FnGetMoneda = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetMonedas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var moneda = respuesta.map((valor: any) => {
                        var obj = { value: valor.monedaId, label: valor.nombreMoneda };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMoneda2: moneda }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMoneda2: [] }))
                }
            })
    }
    const FnGetTipoBanco = () => {
        setState(s => ({ ...s }))
        FuncionesCuentaContable.FNGetTipoBanco(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var tipoBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.tipoBancoID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsTipoBanco2: tipoBanco }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco2: [] }))
                }
            })
    }
    const abrirModalCuentaContable = () => {
        FnGetTipoBanco()
        FnGetMoneda()
        FnGetEmpresa()
        FnGetRubro()
        FnGetNaturaleza()
        FnGetAcumulaCuentacontable()
        FnGetTipo()
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarCuentasBancos: false, MostrarCuentaContable: true
            }
        }))
    }
    const abrirModalBancos = () => {
        GetsCuentasBancos();
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarCuentasBancos: true, Mostrar: true
            }
        }))
    }
    const fnCancelarModalCuentacontable = () => {
        setState({ ...state, Form: { ...state.Form, MostrarCuentasBancos: true, MostrarCuentaContable: false } })
        FnGetCuenta()
    }
    const fnCancelarModalBancos = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarCuentasBancos: false
            }
        }))
        if (state.Form.Id == undefined) {
            FnGetCuentaBanco2()
            FnGetCuentaBanco()
        } else {
            FnGetCuentaBanco3()
        }

    }
    const abrirModalBancoNuevo = () => {
        FNGetTipoBanco()
        FnGetArchivoDispersion()
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarCuentasBancos: false, MostrarBancoNuevo: true
            }
        }))
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => {
        setState({ ...state, Form: { ...state.Form, Mostrar: false } })
        //FNGetLocal();
    }
    const fnCancelarModalBancoNuevo = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form,
                MostrarCuentasBancos: true,
                MostrarBancoNuevo: false,
                DatosDefectoBancoNuevo: DatosDefectoBancoNuevo
            }
        }
        ))
        GetsCuentasBancos()
    }
    const GetsCuentasBancos = () => {
        FnGetCuentaBanco2()
        FnGetBanco()
        FnGetAgrupaciones()
        setState(s => ({
            ...s, Form: {
                ...s.Form,
                MostrarCuentasBancos: true,
                MostrarBancoNuevo: false,

            }
        }
        ))
    }


    const FnGetArchivoDispersion = () => {
        setState(s => ({ ...s }))
        FuncionesBancoNuevo.FNGetArchivoDispersion(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var archivoDispersion = respuesta.map((valor: any) => {
                        var obj = { value: valor.archivoDispersionID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsArchivosDispersion: archivoDispersion }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsArchivosDispersion: [] }))
                }
            })
    }
    const FNGetTipoBanco = () => {
        setState(s => ({ ...s }))
        FuncionesBancoNuevo.FNGetTipoBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var tipoBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.tipoBancoID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsTipoBanco: tipoBanco }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco: [] }))
                }
            })
    }
    const FnGetAgrupaciones = () => {
        setState(s => ({ ...s }))
        FuncionesCuentasBanco.FNGetAgrupaciones(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var agrupacion = respuesta.map((valor: any) => {
                        var obj = { value: valor.agrupacionID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAgrupacion: agrupacion }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAgrupacion: [] }))
                }
            })
    }
    const FnGetBanco = () => {
        setState(s => ({ ...s }))
        FuncionesCuentasBanco.FNGetBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var banco = respuesta.map((valor: any) => {
                        var obj = { value: valor.bancoID, label: valor.nombre, tipoBancoID: valor.tipoBanco.tipoBancoID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsBanco: banco }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsBanco: [] }))
                }
            })
    }

    const FnGetAcumula = (tipoBancoID: any) => {
        setState(s => ({ ...s }))
        FuncionesCuentasBanco.FNGetContable(props.Seguridad, tipoBancoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula: acumula }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula: [] }))
                }
            })
    }
    const eliminarRegistro = (value: any) => {


        let index = state.Form.Datos.cuentasBanco.findIndex((valor: any) => {
            //return valor.cuentaBovedaId === value.cuentaBovedaId
            return valor.cuentaBanco.cuentaBancoID === value.cuentaBanco.cuentaBancoID
        })
        state.Form.Datos.cuentasBanco.splice(index, 1)
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos, Mostrar: true
            }
        }))

    }
    const FnEliminar = (item: any) => {
        setActivarDesactivarConcepto(true)
        Funciones.FNDelete(props.Seguridad, item)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))

                let index = state.Form.Datos.cuentasBanco.findIndex((valor: any) => {
                    return valor.cuentaBanco.cuentaBancoID
                    //return valor.cuentaBanco.cuentaBancoID === respuesta.cuentaBanco.cuentaBancoID
                })
                state.Form.Datos.cuentasBanco.splice(index, 1)
                //setLoading(false)
                toast.success('La cuenta se eliminó correctamente')
                setState(state => ({ ...state, Form: { ...state.Form, Datos: state.Form.Datos, Mostrar: true } }))
                setActivarDesactivarConcepto(false)
            })
        FnGetCuentaBanco2();

    }
    const FNCuentasBancosActivas = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetCuentasActivas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuentas = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuentaBancos: cuentas }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentaBancos: [] }))
                }
            })
    }


    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const FnGetUsuario = (Nombre: string, callback: any) => {

        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        FuncionesCaja.FNGetUsuariosPOST(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var usuario = respuesta.map((valor: any) => {
                        var obj = { value: valor.usuarioID, label: valor.nombre, usuarioId: valor.usuarioID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: usuario }))
                    callback(usuario)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])

                }
            })
    }

    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
                        var obj = { value: valor.sucursalId, label: valor.sucursal };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsSucursal: sucursal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursal: [] }))
                }
            })
    }
    const FnGetCuenta = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuenta = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuenta: cuenta }))
                }
            })
            .catch(() => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuenta: [] }))
                }
            })
    }

    const FNGetBancosNuevos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var banco = respuesta.map((valor: any) => {
                        var obj = { value: valor.BancoID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsBancosNuevos: banco }))
                }
            })
            .catch(() => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsBancosNuevos: [] }))
                }
            })
    }
    //Funcion para obtener los datos de Cuentas contables
    const FnGetCuentaBanco2 = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentasBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuentaBanco2 = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuentaBanco: cuentaBanco2 }))
                }
            })
            .catch(() => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentaBanco: [] }))
                }
            })
    }
    //Funcion para obtener los datos de Cuentas Bancos
    const FnGetCuentaBanco = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentasBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuentaBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({
                        ...s, OptionsCuentaBanco: cuentaBanco, Form: { ...s.Form, Mostrar: true, Id: undefined, Datos: DatosDefecto }
                    }
                    ))
                }
            })
            .catch(() => {

                toast.error('No hay cuentas disponibles para la boveda, debe agregar una nueva cuenta de banco.')
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentaBanco: [] }))
                }
            })
    }
    const FnGetCuentaBanco3 = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentasBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuentaBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({
                        ...s, OptionsCuentaBanco: cuentaBanco, Form: { ...s.Form, Mostrar: true }
                    }
                    ))
                }
            })
            .catch(() => {

                toast.error('No hay cuentas disponibles para la boveda, debe agregar una nueva cuenta de banco.')
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentaBanco: [] }))
                }
            })
    }
    const agregarCuentaBanco = (item: any, bovedaId: any, nombre: any, clave: any, personaId: any, sucursalId: any, cuentaId: any) => {
        let existe = state.Form.Datos.cuentasBanco.find((respuesta: any) => {
            return parseInt(respuesta.cuentaBanco.cuentaBancoID) === parseInt(item.cuentaBanco.cuentaBancoID)
        })

        if (existe === undefined) {
            state.Form.Datos.cuentasBanco.push(item)

            setState(s => ({
                ...s, Form: {
                    ...s.Form, Datos: {
                        bovedaId: bovedaId,
                        nombre: nombre,
                        clave: clave,
                        personaId: personaId,
                        sucursalId: sucursalId,
                        cuentaId: cuentaId,
                        usuarioId: state.Form.Datos.usuarioId,
                        activa: state.Form.Datos.activa,
                        cuentasBanco: state.Form.Datos.cuentasBanco
                    }
                }
            }))
        }
    }
    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'BovedaID', sortable: true, center: true },
            {
                name: 'Nombre', selector: 'NombreBoveda', sortable: false, center: true,
                cell: (props) => <span className="text-center">{props.NombreBoveda}</span>
            },
            { name: 'Clave', selector: 'Clave', sortable: false, center: true },
            {
                name: 'Activa',
                selector: 'Activa',
                sortable: false,
                center: true,
                cell: (props) => <span>{props.Activa ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },
            {
                name: 'Cuenta Banco', selector: 'NombreCuentaContable', sortable: false, center: true,
                cell: (props) => <span className="text-center">{props.NombreCuentaContable}</span>

            },
            {
                name: 'Cerrada', selector: 'Cerrada', sortable: false, center: true,
                cell: (props) => props.Cerrada ? <span className="text-center">Si</span> : <span className="text-center">No</span>,
            },
            { name: 'Sucursal', selector: 'NombreSucursal', sortable: false, center: true },
            {
                name: 'Editar', sortable: false, center: true, style: { display: 'block;' },

                cell: (props) =>
                    <div className="text-center" style={{ overflowX: 'auto', whiteSpace: 'nowrap', }}>
                        {!props.Cerrada && <><button data-tip data-for="btnVer_1_cerrar" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                            //FNAbrirCaja(props.CajaID)
                            alert(props.BovedaID)
                            FNGetTable()
                        }}>
                            <FaUnlock />
                            <ReactTooltip id="btnVer_1_cerrar" type="info" effect="solid">
                                Cerrar bóveda
                            </ReactTooltip>
                        </button>
                        </>}
                        <button className="asstext" type={"button"} onClick={() => {

                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        BovedaID: props.BovedaID,
                                        Nombre: props.NombreBoveda,
                                        Clave: props.Clave,
                                        PersonaID: props.PersonaID,
                                        CuentaID: props.CuentaID,
                                        Activa: props.Activa,
                                        BancoID: props.BancoID,
                                        NombreResponsble: props.NombreResponsble,
                                        NombreCuentaContable: props.NombreCuentaContable,
                                        SucursalID: props.SucursalID
                                    },
                                    Id: props.BovedaID


                                }

                            }))

                            console.log(props)

                        }}>
                            <FaPencilAlt />
                        </button>
                        <button data-tip="true" data-for={`ArqueosImprimir${props.CajaID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s, Form: {
                                    ...s.Form, MostrarArqueos: true,
                                    BovedaID: props.BovedaID
                                },
                            }))
                            //  alert(props.BovedaID)

                        }}>


                            <FaPrint />
                            <ReactTooltip id={`ArqueosImprimir${props.CajaID}`} type="info" effect="solid">
                                Imprimir arqueos
                            </ReactTooltip>
                        </button>
                        {props.Cerrada && <><button data-tip data-for="btnVer_1" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                            //FNAbrirCaja(props.CajaID)
                            // alert(props.CajaID)
                        }}>
                            <FaUnlock />
                            <ReactTooltip id="btnVer_1" type="info" effect="solid">
                                Re-abrir caja
                            </ReactTooltip>
                        </button>
                        </>}
                    </div>

            },
        ]

    React.useEffect(() => {
        FNGetLocal()
        FNGetSucursales()
        //FnGetUsuario()
        FNGetBancosNuevos()
        FNCuentasBancosActivas()
        //FnGetCuenta()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const cbAgregarCuentaBanco = (item: any) => {
        toast.success('La cuenta se agregó correctamente')
        FnGetCuenta()
    }
    const cbAgregar = (item: any) => {
        FNCuentasBancosActivas()
        FNGetLocal()
        toast.success('La bóveda se guardó correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.BovedaID === item.BovedaID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false, MostrarCuentasBancos: false,
            }
        }
        ))
    }
    const fnCancelar2 = () => setState({ ...state, Form: { ...state.Form, MostrarArqueos: false } })


    const fnPrinting = (loading: boolean) => {
        setState(s => ({ ...s, loading: loading }))
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        FnGetCuenta()
        toast.success('La bóveda se actualizó correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.BovedaID === item.BovedaID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false, MostrarCuentasBancos: false,
                Datos: {
                    BovedaID: 0,
                    Nombre: '',
                    Clave: '',
                    PersonaID: 0,
                    BancoID: 0,
                    CuentaID: 0,
                    UsuarioID: '',
                    Activa: true,
                }
            }
        }
        ))
        // FnGetCuentaBanco2();
        //FNGetLocal()
    }

    const FNGetTable = () => {

        setState(s => ({ ...s, CargandoModal: true }))
        Funciones.FNGetDenominaciones(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((res: any) => {
                        res.cantidad = 0
                    })
                    setState(s => ({ ...s, MostrarBoveda: true, CargandoModal: false, Error: false, DatosTabla: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, CargandoModal: false, Error: true, DatosTabla: [] }))
                }
            })
    }
    const calcularTotal = (item: any) => {
        let suma: any
        if (item.total !== undefined) {
            if (item.totalNuevo !== undefined) {
                let index = state.DatosTabla.findIndex((res: any) => {
                    return res.catDenomEfectivoID === item.catDenomEfectivoID
                })
                state.DatosTabla[index] = item
                suma = (state.TotalGeneral + item.total) - item.totalAn
            } else {
                let index = state.DatosTabla.findIndex((res: any) => {
                    return res.catDenomEfectivoID === item.catDenomEfectivoID
                })
                state.DatosTabla[index] = item
                suma = state.TotalGeneral + item.total
            }
            setState(s => ({ ...s, DatosTabla: state.DatosTabla, TotalGeneral: suma }))
        }
    }

    return (
        <div className="row">
            <div className="col-12">

                <Card Title="Catálogo de bóvedas">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar bóveda" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState(s => ({
                                                                ...s, Form: { ...s.Form, Mostrar: true, Id: undefined, Datos: DatosDefecto }
                                                            }
                                                            ))}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"BovedaID"}
                                        defaultSortField={"BovedaID"}
                                        columns={Columns}
                                    />

                                    <ModalWin open={state.Form.MostrarBoveda} xlarge={true} scrollable={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "" : "Captura de cantidades "}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormArqueoBoveda
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                DatosTabla={state.DatosTabla}
                                                fnCancelar={fnCancelar}
                                                optionsSucursal={state.OptionsSucursal}
                                                CargandoModal={state.CargandoModal}
                                                optionsCajas={[]}
                                                calcularTotal={calcularTotal}
                                                TotalGeneral={state.TotalGeneral}
                                                BovedaID={state.BovedaID}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin large={true} open={state.Form.MostrarArqueos} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Imprimir Corte
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormBovedaArqueos
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos2}
                                                Id={state.Form.BovedaID}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar2}
                                                //        DatosDefectoModalDetalle={state.DatosDefectoModalDetalle}
                                                fnPrinting={fnPrinting}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin center={true} large={true} open={state.Form.Mostrar} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Boveda" : "Agregar Boveda"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                fnGetClientes={FnGetUsuario}
                                                key={1}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                agregarCuentaBanco={agregarCuentaBanco}
                                                eliminarRegistro={eliminarRegistro}
                                                fnCancelar={fnCancelar}
                                                abrirModalBancos={abrirModalBancos}
                                                // FnEliminar={() => alert("DOMO")}
                                                FnEliminar={FnEliminar}
                                                activarDesactivarConcepto={activarDesactivarConcepto}
                                                options={state.OptionsUsuario}
                                                options2={state.OptionsSucursales}
                                                options3={state.OptionsCuentaBancos}
                                                OptionsBancosNuevos={state.OptionsBancosNuevos}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin center={true} open={state.Form.MostrarCuentasBancos} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Agregar Cuenta Banco
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormCuentasBancos
                                                key={2}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosCuentasBancos}
                                                cbGuardar={cbAgregarCuentaBanco}
                                                cerrarModalBancos={cerrarModalBancos}
                                                fnCancelarModalBancos={fnCancelarModalBancos}
                                                FnGetAcumula={FnGetAcumula}
                                                optionsBanco={state.OptionsBanco}
                                                optionsAgrupacion={state.OptionsAgrupacion}
                                                optionsCuenta={state.OptionsAcumula}
                                                abrirModalBancoNuevo={abrirModalBancoNuevo}
                                                abrirModalCuentaContable={abrirModalCuentaContable}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin center={true} open={state.Form.MostrarBancoNuevo} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                Agregar Banco

                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormBancoNuevo
                                                key={3}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosBancoNuevo}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                OptionsTipoBanco={state.OptionsTipoBanco}
                                                fnCancelar={fnCancelarModalBancoNuevo}
                                                OptionsArchivosDispersion={state.OptionsArchivosDispersion}

                                            />
                                        </ModalWin.Body>
                                    </ModalWin>


                                    <ModalWin center={true} open={state.Form.MostrarCuentaContable} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Agregar cuenta contable   </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormCuentasContables
                                                key={4}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosCuentaContable}
                                                Id={state.Form.IdCuentaContable}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelarModalCuentacontable}
                                                //FnEliminar={FnEliminar}
                                                //modalEliminar={state.modalEliminar}
                                                options={state.OptionsAcumula2}
                                                options2={state.OptionsTipo2}
                                                options3={state.OptionsNaturaleza2}
                                                options4={state.OptionsRubro2}
                                                options5={state.OptionsEmpresa2}
                                                options6={state.OptionsMoneda2}
                                                options7={state.OptionsTipoBanco2}
                                                options8={state.OptionsSucursal}

                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBoveda)