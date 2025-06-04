import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoCaja/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'
import ReactTooltip from 'react-tooltip';

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash, FaPrint, FaUnlock, FaEye, FaSearchDollar } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoCaja/CForm'
import { CFormArqueos } from './CatalogoCaja/CFormArqueos'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'
import VerGastos from './CatalogoCaja/VerGastos'
import { FaSackDollar } from 'react-icons/fa6'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { FormateoDinero } from '../../../../../global/variables'




type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoCaja = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefectoModalDetalle = {
        cuenta: '',
        cuentaId: 0,
        referencia: '',
        debe: '',
        haber: '',
        concepto: ''
    }
    const DatosDefecto2 = {
        fecha: new Date(),
        estatus: 0,
        tipo_poliza: '',
        numeroPoliza: 0,
        cuenta: '',
        usuario: '',
        empresa: '',
        concepto: '',
        fechaFinal: new Date(),
        fechaInicial: new Date()
    }
    const DatosDefecto = {
        CajaID: 0,
        Nombre: '',
        Clave: '',
        Descripcion: '',
        Estatus: true,
        UsuarioID: 0,
        SucursalID: 0,
        CuentaID: 0,
        BovedaID: 0,
        ResponsableID: 0,
        CanalesCobranza: false,
        UsuarioIDSeg: 0,

    }
    const Datos: any[] = []
    const Datas: any[] = []
    const DatosMostrar: any[] = []
    const ShowDetail: any[] = []

    const OptionsUsuario: any[] = []
    const OptionsUsuario2: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCuenta: any[] = []
    const OptionsBoveda: any[] = []
    const OptionsArqueos: any[] = []
    const OptionsCuentasDispersan: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,

        Datos, 
        DatosMostrar,
        SaldoRealShow: false,
        SaldoReal: 0,
        Caja: 0,
        Boveda: 0,
        ODP: 0,
        TipoMovimiento:'',
        Total:0,
        SaldoFinal:0,
        Id:0,
        ProductoId:0,
        CajaId:0,
        NombreCaja:'',
        Producto:'',
        Datas,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Datos2: DatosDefecto2,
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            IdCaja: undefined,
            MostrarArqueos: false,
            ShowDetail: false


        },
        OptionsCuentasDispersan,
        OptionsUsuario,
        OptionsUsuario2,

        OptionsSucursal,
        OptionsCuenta,
        OptionsBoveda,
        OptionsArqueos,
        DatosDefectoModalDetalle
    })

    const MySwal = withReactContent(Swal)

    const FNAbrirCaja = (Id: number) => {
        //    setState(s => ({ ...s, Cargando: true, Error: false }))

        Funciones.FNAbrirCaja(props.Seguridad, Id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    // alert(respuesta)
                    cbActualizarCaja(respuesta)

                    //setState(s => ({ ...s, Cargando: false, Error: false }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, }))
                }
            })
    }



    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    /* respuesta.forEach((element: any) => {
                             element.usuario = element.cajaUsuario.usuario
                             element.usuarioID = element.cajaUsuario.usuarioID
                             element.sucursal = element.cajaSucursal.sucursal
                             element.sucursalId = element.cajaSucursal.sucursalId
                             element.nombreBoveda = element.cajaBoveda.nombre
                             element.cuenta = element.cuentaCaja.cuenta
                             element.cuentaId = element.cuentaCaja.id
                     });*/

                    console.log("respuesta", respuesta)

                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    /* respuesta.forEach((element: any) => {  
                         element.usuario = element.cajaUsuario.usuario
                         element.usuarioID = element.cajaUsuario.usuarioID
                         element.sucursal = element.cajaSucursal.sucursal
                         element.sucursalId = element.cajaSucursal.sucursalId
                         element.nombreBoveda = element.cajaBoveda.nombre
                         element.cuenta = element.cuentaCaja.cuenta
                         element.cuentaId = element.cuentaCaja.id
                 });    */
                    setState(s => ({ ...s, Datos: respuesta }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }



    //PRUEBA GENERAR PDF


    //------------------------------------------------------

    const generarPDF3 = (oidc: IOidc,) => {
        setState(s => ({ ...s }))
        axios({
            url: "https://services-tsr.herokuapp.com/api/pdf/corte-caja-pdf/22/2021-08-03/Daniel",
            method: "GET",
            responseType: 'blob',
            headers: {

                'Content-Type': 'application/json',
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => {

                const content = respuesta.headers['content-type'];
                download(respuesta.data, content)

            }).catch(error => console.log(error));
    }

    //------------------------------------------------------

    const FnGetArqueos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetArqueos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {


                    var usuario = respuesta.map((valor: any) => {
                        var fecha = valor.nombre + ' ' + valor.apellidoPaterno + ' ' + valor.apellidoMaterno

                        var obj = { value: valor.ArqueoID, label: fecha };

                        return obj
                    });

                    setState(s => ({ ...s, OptionsArqueos: usuario }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Usuario
    const FnGetUsuario = (Nombre: string, callback: any) => {

        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetUsuariosPOST(props.Seguridad, Datos)
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
    const FnGetUsuario2 = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetUsuariosPOST(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var usuario = respuesta.map((valor: any) => {
                        //var username = valor.nombre + ' ' + valor.apellidoPaterno + ' ' + valor.apellidoMaterno
                        var obj = { value: valor.usuarioID, label: valor.nombre, usuarioId: valor.usuarioID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario2: usuario }))
                    callback(usuario)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario2: [] }))
                    callback([])

                }
            })
    }
    //Funcion para obtener los datos de Tipo de cuenta
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


    //Funcion para obtener los datos de Cuentas contables
    const FnGetCuenta = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuenta = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
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

    const FnGetGastos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentas(props.Seguridad)
            .then((respuesta: any) => {
            })
            .catch(() => {

            })
    }

    const FnGetCuentasDispersan = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentasDispersan(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuenta = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Cuenta };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuentasDispersan: cuenta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentasDispersan: [] }))
                }
            })
    }

    const SaldoReal = (CajaID: number) => {
        setState(s => ({ ...s, SaldoRealShow: true }))
        
        let Datos = {
            CajaID: CajaID
        }
        const Datas:any[] = [] ;
        console.log('Datos',Datos);

        Funciones.FNGetSaldoReal(props.Seguridad, Datos)
            .then((respuesta: any) => {

                console.log('RESPUESTA', respuesta)
                if (isMounted.current === true) {
                    setState(s => ({
                        ...s, SaldoReal: respuesta.SaldoReal,
                        Caja: respuesta.Caja,
                        Boveda: respuesta.Boveda,
                        ODP: respuesta.ODP,
                        TipoMovimiento:respuesta.TipoMovimiento,
                        Total:respuesta.Total,
                        SaldoFinal:respuesta.SaldoFinal,
                        Id:respuesta.Id,
                        ProductoId:respuesta.ProductoId,
                        CajaId:respuesta.CajaId,
                        NombreCaja:respuesta.NombreCaja,
                        Producto:respuesta.Producto,
                        Datas:respuesta

                    }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema: " + error)
                    setState(s => ({ ...s, SaldoReal: 0 }))
                }
            })
    }


    //Funcion para obtener los datos de Bovedas
    const FnGetBoveda = (Sucursal: number) => {
        setState(s => ({ ...s }))
        Funciones.FNGetBovedas(props.Seguridad, Sucursal)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (respuesta.length > 0) {
                        var boveda = respuesta.map((valor: any) => {
                            var obj = { value: valor.BovedaID, label: valor.Boveda };
                            return obj
                        });
                        setState(s => ({ ...s, OptionsBoveda: boveda }))
                    } else {
                        setState(s => ({ ...s, OptionsBoveda: [] }))
                        toast.error("La sucursal no cuenta con bóvedas")
                    }

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema al obtener las bóvedas")
                    setState(s => ({ ...s, OptionsBoveda: [] }))
                }
            })
    }
 
    const Columnas = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Producto Id', selector: 'ProductoId', sortable: false, center: true, 
                }, 
                {   name: 'Id', selector: 'Id', sortable: false, center: true },
                
                {   
                    name: 'Tipo Movimiento', selector: 'TipoMovimiento', sortable: false, center: true ,
                    cell: (props) => <span className="text-center">{props.TipoMovimiento}</span>
                },
                {
                    name: 'Caja Id', selector: 'CajaId', sortable: false, center: true, 
                },
                {
                    name: 'Nombre Caja', selector: 'NombreCaja', sortable: false, center: true, 
                }, 
                {
                    name: 'Total', selector: 'Total', sortable: false, center: true,  
                },
                {
                    name: 'Producto', selector: 'Producto', sortable: false, center: true,  
                },
                {
                    name: 'Saldo Final', selector: 'SaldoFinal', sortable: false, center: true,  
                },

            ]
        return colRet
    }, [])


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CajaID', sortable: false, center: true },
                {
                    name: 'Nombre', selector: 'Nombre', sortable: false, center: true,
                    cell: (props) => <span className="text-center">{props.Nombre}</span>
                },
                /* {
                    name: 'Encargado', selector: 'Encargado', sortable: false, center: true,
                    cell: (props) => <span className="text-center">{props.UsuarioNombre}</span>
                }, */
                { name: 'Clave', selector: 'Clave', sortable: false, center: true },
                {
                    name: 'Cerrada', selector: 'Cerrada', sortable: false, center: true,
                    cell: (props) => props.Cerrada ? <span className="text-center">Si</span> : <span className="text-center">No</span>,
                },
                {
                    name: 'CajaTieneGasto', selector: 'CajaTieneGasto', sortable: false, center: true,
                    cell: (props) => props.CajaTieneGasto ? <span className="text-center">Si</span> : <span className="text-center">No</span>,
                },

                /*  {
                     name: 'Boveda', selector: 'BovedaNombre', sortable: false, center: true,
                     cell: (props) => <span className="text-center">{props.BovedaNombre}</span>
                 }, */
                {
                    name: 'Descripciòn', selector: 'Descripcion', sortable: false, center: true,
                    cell: (props) => <span className="text-center">{props.Descripcion}</span>

                },
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    sortable: false,
                    //cell: (props) => <span>{props.estatus ? "Activo" :  "Inactivo"}</span>
                    cell: (props) => <span>{props.Estatus ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>,
                    center: true
                },
                /*    {
                       name: 'Editar', sortable: false,
                       cell: (props) =>
                           <button className="asstext" type={"button"} onClick={() => {
                               console.log(props)
                               setState(s => ({
                                   ...s,
                                   Form: {
                                       ...s.Form, Mostrar: true,
                                       Datos: {
                                           CajaID: props.CajaID,
                                           Nombre: props.Nombre,
                                           Clave: props.Clave,
                                           Descripcion: props.Descripcion,
                                           Estatus: props.Estatus,
                                           UsuarioID: props.PersonaID,
                                           SucursalID: props.SucursalID,
                                           CuentaID: props.CuentaID,
                                           BovedaID: props.BovedaID,
                                           ResponsableID: props.ResponsableID == null ? 0 : props.ResponsableID,
                                       },
                                       Id: props.CajaID
                                   }
                               }))
   
                           }}>
                               <FaPencilAlt />
                           </button>,
                       center: true
                   }, */

                {
                    name: 'Acciones', sortable: false,
                    center: false,
                    style: { display: 'block;' },

                    cell: (props) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <button data-tip="true" data-for={`ArqueosEditar${props.CajaID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                console.log("Canales cobranza ", props.CanalesCobranza)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form, Mostrar: true,
                                        Datos: {
                                            CajaID: props.CajaID,
                                            Nombre: props.Nombre,
                                            Clave: props.Clave,
                                            Descripcion: props.Descripcion,
                                            Estatus: props.Estatus,
                                            UsuarioID: props.PersonaID,
                                            SucursalID: props.SucursalID,
                                            CuentaID: props.CuentaID,
                                            BovedaID: props.BovedaID,
                                            ResponsableID: props.ResponsableID == null ? 0 : props.ResponsableID,
                                            CanalesCobranza: props.CanalesCobranza,
                                            UsuarioIDSeg: props.UsuarioIDSeg,
                                        },
                                        Id: props.CajaID
                                    }
                                }))

                            }}>
                                <FaPencilAlt />

                                <ReactTooltip id={`ArqueosEditar${props.CajaID}`} type="info" effect="solid">
                                    Editar caja
                                </ReactTooltip>
                            </button>
                            {'\u00A0'}
                            <button data-tip="true" data-for={`ArqueosImprimir${props.CajaID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s, Form: {
                                        ...s.Form, MostrarArqueos: true,
                                        IdCaja: props.CajaID
                                    }
                                }))
                            }}>


                                <FaPrint />
                                <ReactTooltip id={`ArqueosImprimir${props.CajaID}`} type="info" effect="solid">
                                    Imprimir arqueos
                                </ReactTooltip>
                            </button>
                            {'\u00A0'}
                            {props.Cerrada && <><button data-tip data-for="btnVer_1" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                FNAbrirCaja(props.CajaID)
                                // alert(props.CajaID)
                            }}>
                                <FaUnlock />
                                <ReactTooltip id="btnVer_1" type="info" effect="solid">
                                    Re-abrir caja
                                </ReactTooltip>
                            </button>
                            </>}
                            {'\u00A0'}
                            <button data-tip="true" data-for={`ArqueosEditar${props.CajaID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                console.log("CajaID ", props.CajaID)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form, ShowDetail: true,
                                        Datos: {
                                            CajaID: props.CajaID,
                                            Nombre: props.Nombre,
                                            Clave: props.Clave,
                                            Descripcion: props.Descripcion,
                                            Estatus: props.Estatus,
                                            UsuarioID: props.PersonaID,
                                            SucursalID: props.SucursalID,
                                            CuentaID: props.CuentaID,
                                            BovedaID: props.BovedaID,
                                            ResponsableID: props.ResponsableID == null ? 0 : props.ResponsableID,
                                            CanalesCobranza: props.CanalesCobranza,
                                            UsuarioIDSeg: props.UsuarioIDSeg,
                                        },
                                        Id: props.CajaID
                                    }
                                }))

                            }}>
                                <FaEye />

                                <ReactTooltip id={`ArqueosEditar${props.CajaID}`} type="info" effect="solid">
                                    Ver Gastos
                                </ReactTooltip>
                            </button>
                            {'\u00A0'}
                            <button data-tip="true" data-for={`SaldoTooltip${props.CajaID}`} className="asstext ms-3" type={"button"} onClick={() => {
                                console.log("CajaID ", props.CajaID)
                                SaldoReal(props.CajaID)
                            }}>
                                <FaSackDollar />
                                <ReactTooltip id={`SaldoTooltip${props.CajaID}`}
                                    type="info"
                                    effect="solid"
                                    clickable
                                    globalEventOff="click"
                                >
                                    Ver Saldo Real
                                </ReactTooltip>
                            </button>

                        </div>
                },

            ]
        return colRet
    }, [])

    const fnCancelar3 = () => {
        MySwal.close()
        setState({ ...state, SaldoRealShow: false })
    }

    React.useEffect(() => {
        FNGetLocal()
        //   FnGetUsuario()
        FnGetSucursal()
        FnGetCuenta()
        // FnGetBoveda()
        FnGetCuentasDispersan()
        FnGetGastos()


        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    const fnPrinting = (loading: boolean) => {
        setState(s => ({ ...s, loading: loading }))
    }
    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('La caja se agrego correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CajaID === item.CajaID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CajaID: 0,
                    Nombre: '',
                    Clave: '',
                    Descripcion: '',
                    Estatus: true,
                    UsuarioID: 0,
                    SucursalID: 0,
                    CuentaID: 0,
                    BovedaID: 0,
                    ResponsableID: 0,
                    CanalesCobranza: false,
                    UsuarioIDSeg: 0,

                }
            }
        }
        ))
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('La caja se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CajaID === item.CajaID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CajaID: 0,
                    Nombre: '',
                    Clave: '',
                    Descripcion: '',
                    Estatus: true,
                    UsuarioID: 0,
                    SucursalID: 0,
                    CuentaID: 0,
                    BovedaID: 0,
                    ResponsableID: 0,
                    CanalesCobranza: false,
                    UsuarioIDSeg: 0,
                    TipoMovimiento:'',
                    Total:0,
                    SaldoFinal:0

                }
            }
        }
        ))

    }

    const cbActualizarCaja = (item: any) => {
        toast.success('La caja se actualizó correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CajaID === item.CajaID ?
                { ...Dato, Cerrada: item.Cerrrada } : Dato)
        }
        ))
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    const fnCancelar2 = () => setState({ ...state, Form: { ...state.Form, MostrarArqueos: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Catálogo de cajas">
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
                                                        <input type="text" className="form-control" placeholder="Buscar caja" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { ...state.Form, Mostrar: true, MostrarArqueos: false, Datos: DatosDefecto, Id: undefined } })}
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
                                        keyField={"CajaID"}
                                        defaultSortField={"CajaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin large={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Caja" : "Agregar Caja"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                fnGetBovedas={FnGetBoveda}
                                                fnGetClientes={FnGetUsuario}
                                                fnGetClientes2={FnGetUsuario2}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                options={state.OptionsUsuario}
                                                options2={state.OptionsSucursal}
                                                options3={state.OptionsCuenta}
                                                options4={state.OptionsBoveda}
                                                options5={state.OptionsCuentasDispersan}
                                                options6={state.OptionsUsuario2}


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
                                            <CFormArqueos
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos2}
                                                Id={state.Form.IdCaja}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar2}
                                                DatosDefectoModalDetalle={state.DatosDefectoModalDetalle}
                                                fnPrinting={fnPrinting}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.Form.ShowDetail} large={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, Form: { ...s.Form, ShowDetail: false } }))} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.Form.ShowDetail &&
                                                <VerGastos
                                                    CajaID={state.Form.Id}
                                                    ComisionesID={0}
                                                    optNiveles={state.Datos}
                                                    Datos={0}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin center={true}  xlarge={true} open={state.SaldoRealShow} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                Saldo Real

                                            </h5>
                                            <button type="button" className="delete" onClick={() => { fnCancelar3() }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            
                                            <div style={{ padding: '1em' }}> 
                                            <DataTable
                                                subHeader
                                                
                                                data={state.Datas}
                                                striped
                                                //pagination
                                                dense
                                                noHeader
                                                responsive
                                                keyField={"PersonasDocID"}
                                                defaultSortField={"PersonasDocID"}
                                                columns={Columnas}
                                            />
 
                                                {/* <span className='fw-bold'>ProductoId: { state.ProductoId} </span><br /><br />
                                                <span className='fw-bold'>Id: { state.Id} </span><br /><br /> 
                                                <span className='fw-bold'>TipoMovimiento:  {state.TipoMovimiento}</span> <br /><br />
                                                <span className='fw-bold'>CajaId: { state.CajaId} </span><br /><br /> 
                                                <span className='fw-bold'>NombreCaja: { state.NombreCaja} </span><br /><br /> 
                                                <span className='fw-bold'>Total:  {state.Total}</span><br /><br />
                                                <span className='fw-bold'>Producto:  {state.Producto}</span><br /><br />
                                                <span className='fw-bold'>SaldoFinal:  {state.SaldoFinal}</span> */}

                                                {/* <span className='fw-bold'>Caja:  {FormateoDinero.format(state.Caja)} </span><br /><br />
                                                <span className='fw-bold'>Bóveda:  {FormateoDinero.format(state.Boveda)}</span><br /><br />
                                                <span className='fw-bold'>ODP:  {FormateoDinero.format(state.ODP)}</span><br /><br />
                                                <span className='fw-bold'>Saldo Real:  {FormateoDinero.format(state.SaldoReal)}</span><br /><br /> */} 
                                                 {/* <FaExclamationTriangle/>
                                                <span > Atención: El Prospecto iniciara el proceso de Docs Titular y no habra marcha atras.</span> */}
                                                {/* <br /> */}
                                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCaja)