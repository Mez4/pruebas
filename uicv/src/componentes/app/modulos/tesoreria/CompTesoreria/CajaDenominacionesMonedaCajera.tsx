import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CajaDenominacionesMonedaCajera/Funciones'
import { toast } from 'react-toastify'
import { FormateoDinero } from '../../../../../global/variables'
import ReactTooltip from 'react-tooltip';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { Formik, Form, Field, FieldArray } from 'formik'

// Icons
import { FaSearch, FaCircle, FaLock, FaMoneyCheck,  } from 'react-icons/fa'

// Custom components
import { Card, Spinner, Acordion } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import "react-datepicker/dist/react-datepicker.css"
import ReactDOM from 'react-dom'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { BsFillSafe2Fill, BsFillSafeFill, BsSafe, BsSafe2, BsSafe2Fill, BsSafeFill } from 'react-icons/bs'

type CatalogosType = {
    Seguridad: IOidc,
    iUI: iUI,
}

const CatalogoBancoBancos = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)

    let isMounted = React.useRef(true)
    const DatosDefecto = {
        bancoID: 0,
        nombre: '',
        activo: true,
        denominacion: []
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCaja: any[] = []
    const DatosTabla: any[] = []

    const DatosDefectoCForm = {
        CajaID: 0,
        CajaNombre: '',
        bancoID: 0,
        ValoresCaja: [{
            CajaID: 0,
            CuentaBancoID: 0,
            Producto: '',
            DescCuentaBanco: '',
            NumeroCuenta: '',
            TipoMovimiento: '',
            Denominaciones: [
                {
                    CatDenomEfectivoID: 0,
                    Clave: '',
                    Concepto: '',
                    ValorMonetario: 0,
                    Cantidad: 0,
                    Total: 0,
                    totalAn: 0,
                    totalNuevo: 0,
                }

            ],
        }],
        Denominaciones2: [
            {
                CatDenomEfectivoID: 0,
                Clave: '',
                Concepto: '',
                ValorMonetario: 0,
                Cantidad: 0,
                Total: 0,
                totalAn: 0,
                totalNuevo: 0,
            }

        ],
    }

    const [state, setState] = React.useState({

        CFormInitialValues: DatosDefectoCForm,
        CFormInitialValuesBoveda: DatosDefectoCForm,
        BotonesModal: false,
        BotonesModalBoveda: false,
        ShowArqueoCuentasWZ: false,
        ShowArqueoBovedaWZ: false,
        Habilitar: true,
        Datos,
        DatosTabla,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FormBoveda:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OptionsSucursal,

        OptionsCaja,
        startDate: null,
        endDate: null,
        CargandoModal: true,
        TotalGeneral: 0.0,
        cajaId: {
            ID: ""
        },
        CajaID: 0,
        bancoID: 0

    })

    const FNCierreCaja = (item: any) => {
        MySwal.fire({
            icon: 'warning',
            html: <div><br />
                <h3 className="text-center">Cierre de caja</h3>
                <div className={`modal-body`}>
                    <h5 className="text-center">Esta acción realiza un cierre de caja. <br />
                        <strong>NOTA: Para reabrir la caja es necesario de un permiso especial.
                        </strong></h5>
                </div>
            </div>,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cerrar caja',
            cancelButtonText: 'Cancelar'

        }).then((result) => {
            if (result.isConfirmed) {
                FNGetDatosCaja(item)
                //formasDinamicasArreglos([])
                setState(s => ({
                    ...s,
                    ShowArqueoCuentasWZ: true,
                    Form: {
                        ...s.Form,
                        Mostrar: true
                    }
                }))
                FNGetTable()
            }
        })
    }

    const FNArqueoBoveda = (item: any) => {
        MySwal.fire({
            icon: 'warning',
            html: <div><br />
                <h3 className="text-center">Generar Arqueo Bóveda</h3>
                <div className={`modal-body`}>
                    <h5 className="text-center">Esta acción realiza un arqueo de bóveda. <br />
                        <strong>NOTA: Para modificar es necesario de un permiso especial.
                        </strong></h5>
                </div>
            </div>,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Generar Arqueo Bóveda',
            cancelButtonText: 'Cancelar'

        }).then((result) => {
            if (result.isConfirmed) {
                FNGetDatosCajaBoveda(item)
                setState(s => ({
                    ...s,
                    ShowArqueoBovedaWZ: true,
                    FormBoveda: {
                        ...s.FormBoveda,
                        Mostrar: true
                    }
                }))
                FNGetTableBoveda()
            }
        })
    }


    const formasDinamicasArreglos = (item: any) => {
        ReactDOM.render(
            React.createElement("HelloMessage", { name: 'Taylor' }),
            document.getElementById('hello-example')
        );
    }
    //Funcion


    const FNGetTable = () => {
        setState(s => ({ ...s, CargandoModal: true }))
        Funciones.FNGetDenominaciones(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((res: any) => {
                        res.cantidad = 0
                    })
                    setState(s => ({ ...s, CargandoModal: false, Error: false, DatosTabla: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, CargandoModal: false, Error: true, DatosTabla: [] }))
                }
            })
    }

    const FNGetTableBoveda = () => {
        setState(s => ({ ...s, CargandoModal: true }))
        Funciones.FNGetDenominacionesBoveda(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((res: any) => {
                        res.cantidad = 0
                    })
                    setState(s => ({ ...s, CargandoModal: false, Error: false, DatosTabla: respuesta }))
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
    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursal(props.Seguridad)
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
    //Funcion para llenar el commbo de las cajas.
    const FnGetCajas = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetCaja(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta, Cargando: false }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [], Cargando: false }))
                }
            })
    }
    //Funcion para poder hacer el filtro de de las sucursales.
    const FNFiltroSolicitudes = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetFiltroSolicitudes(props.Seguridad, id.value)
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
    const Columns: IDataTableColumn[] =
        [
            { name: 'CajaID', selector: 'CajaID', sortable: false, center: true },
            {
                name: 'Nombre', selector: 'Nombre', sortable: false, center: true,
                cell: (propss) => <span className="text-center">{propss.Nombre}</span>
            },
            {
                name: 'Descripción', selector: 'Descripcion', sortable: false, center: true,
                cell: (propss) => <span className="text-center">{propss.Descripcion}</span>
            },
            {
                name: 'Estatus', selector: 'Estatus', sortable: false, center: true,
                cell: (propss) => propss.Estatus ? <FaCircle color="green" title="Activo" />
                    : <FaCircle color="red" title="Inactiva" />
            },
            {
                name: 'Cerrada', selector: 'Cerrada', sortable: false, center: true,
                cell: (propss) => propss.Cerrada ? <span className="text-center"> Cerrada</span>
                    : <span className="text-center">Abierta</span>
            },
            { name: 'Sucursal', selector: 'NombreSucursal', sortable: false, center: true },
            /* { name: 'Encargado', selector: 'Encargado', sortable: false, center: true },
            {
                name: 'Responsable', selector: 'Responsable', sortable: false, center: true,
                cell: (propss) => propss.Responsable != undefined ? <span className="text-center"> {propss.Responsable}</span>
                    : <span className="text-center">Sin Responsable</span>
            },
             */{
                name: 'Acciones', sortable: false, center: true,
                cell: (props) =>
                    <span className="text-center">
                        <button disabled={(props.Cerrada && !props.Activa) ? true : false}
                            data-tip="true" data-for={`Editar${props.CajaID}`} className="asstext"
                            type={"button"} onClick={() => {
                                FNCierreCaja(props.CajaID)
                                setState(s => ({ ...s, CajaID: props.CajaID }))

                            }}>
                            <FaLock />
                            <ReactTooltip id={`Editar${props.CajaID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Cierre de caja
                            </ReactTooltip>
                        </button>
                        {'\u00A0'}
                        {'\u00A0'}
                        {'\u00A0'}
                        <button disabled={(props.Cerrada && !props.Activa) ? true : false}
                            data-tip="true" data-for={`Boveda${props.CajaID}`} className="asstext"
                            type={"button"} onClick={() => {
                                FNArqueoBoveda(props.CajaID)
                                setState(s => ({ ...s, CajaID: props.CajaID}))

                            }}>
                            <BsFillSafeFill size='17px' color='#515b4c'/>
                            <ReactTooltip id={`Boveda${props.CajaID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Arqueo Bóveda
                            </ReactTooltip>
                        </button>
                    </span>
            },
        ]


    React.useEffect(() => {

        //  FNGetDatos()
        //  FnGetSucursal()
        FnGetCajas()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const FNGetDatosCaja = (item: any) => {
        let a = {
            CajaID: item
        }
        Funciones.FNDatosCaja(props.Seguridad, a)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                console.log('respuesta', respuesta);
                setState(s => ({ ...s, CFormInitialValues: respuesta, CargandoModal: false }));
                //CargandoModal


            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optArchivoDispersion: [] }))
                // }
            })
    }

    const FNGetDatosCajaBoveda = (item: any) => {
        let a = {
            CajaID: item,
        }
        Funciones.FNDatosCajaBoveda(props.Seguridad, a)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                console.log('respuesta', respuesta);
                setState(s => ({ ...s, CFormInitialValuesBoveda: respuesta, CargandoModal: false }));
                //CargandoModal


            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optArchivoDispersion: [] }))
                // }
            })
    }

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const cbAgregar = (item: any) => {
        toast.success('La cantidad de monedas se agregaron correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    bancoID: 0,
                    nombre: '',
                    activo: true,
                    denominacion: []
                }
            }
        })
        FNGetDatos()
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (CajaID_R: number) => {
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CajaID === CajaID_R ?
                { ...Dato, Cerrada: true } : Dato)
        }
        ))
        //Actualizar Datos por
        setState(s => ({ ...s, Cargando: false }))

    }

    const fnCancelar = () => {
        FnGetCajas()
        setState({ ...state, Form: { ...state.Form, Mostrar: false }, DatosTabla: [], TotalGeneral: 0 })
    }

    const fnCancelarBoveda = () => {
        FnGetCajas()
        setState({ ...state, FormBoveda: { ...state.FormBoveda, Mostrar: false }, DatosTabla: [], TotalGeneral: 0 })
    }

    function onSubmit(fields) {
        // display form field values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(state.CFormInitialValues, null, 4));
    }


    const validarValores = () => {
        let sinValores = true;
        //set CargandoModal
        setState(s => ({ ...s, CFormInitialValues: state.CFormInitialValues }))
        setState(s => ({ ...s, BotonesModal: true }))
        state.CFormInitialValues.ValoresCaja.forEach(element => {
            element.Denominaciones.forEach(element2 => {
                if (element2.Total != 0) {
                    sinValores = false;
                }
            });
        });
        //Swal ingresa alguna cantidad
        if (sinValores) {
            MySwal.fire({
                icon: 'warning',
                html: <div><br />
                    <h3 className="text-center">Valores incorrectos</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">No se puede realizar el cierre de caja sin cantidades ingresadas. <br />
                        </h5>
                    </div>
                </div>,
                showCloseButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModal: false }))

                }
            })
        } else {
            let TotalesCuentas: any[] = []
            state.CFormInitialValues.ValoresCaja.forEach(element => {
                console.log('element', element)
                let Total = 0;
                element.Denominaciones.forEach(element2 => {
                    Total = Total + element2.Total;
                }); 
                let a = {
                    CuentaID: element.CuentaBancoID,
                    DescCuentaBanco: element.DescCuentaBanco,
                    NumeroCuenta: element.NumeroCuenta,
                    Total: Total
                }
                TotalesCuentas.push(a)
            });
            MySwal.fire({
                focusCancel: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Confirmación</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Verifica el total. <br />
                            <strong>NOTA: Una vez confirmado esto no podrá cambiarse.
                            </strong></h5>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                    <tr>
                                                        <td className='text-center'>{FormateoDinero.format(TotalesCuentas[0].Total)}</td>
                                                    </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',

            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModal: true }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Guardando</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Espera mientras se procesa la solicitud. <br /> </h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,

                          didOpen: () => {
                                MySwal.showLoading()
                            },
                           
                        }
                    );

                    Funciones.FNAddRegistro(props.Seguridad, state.CFormInitialValues)
                        .then((respuesta: any) => {
                            toast.success(respuesta.Mensaje)
                            setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                            setState(s => ({
                                ...s,
                                ShowArqueoCuentasWZ: false,
                                Form: {
                                    ...s.Form,
                                    Mostrar: false
                                }
                            }))
                            MySwal.close()
                            if (respuesta.MensajeID == 1) {
                                cbActualizar(respuesta.CajaID)
                            }
                        })
                        .catch((res: any) => {
                            const msg = Boolean(res.response?.data) ? res.response?.data : ""
                            toast.error(msg);
                            setState(s => ({
                                ...s,
                                BotonesModal: false,
                                ShowArqueoCuentasWZ: false,
                                Form: {
                                    ...s.Form,
                                    Mostrar: false
                                }
                            }))
                            MySwal.close()
                        })
                } else {
                    setState(s => ({ ...s, BotonesModal: false }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Continuar`,
                            confirmButtonColor: '#3085d6',
                        }
                    );
                }
            })
        }

    }

    const validarValoresBoveda = () => {
        let sinValores = true;
        setState(s => ({ ...s, CFormInitialValuesBoveda: state.CFormInitialValuesBoveda}))
        setState(s => ({ ...s, BotonesModalBoveda: true }))
        state.CFormInitialValuesBoveda.ValoresCaja.forEach(element => {
            element.Denominaciones.forEach(element2 => {
                if (element2.Total != 0) {
                    sinValores = false;
                }
            });
        });
        if (sinValores) {
            MySwal.fire({
                icon: 'warning',
                html: <div><br />
                    <h3 className="text-center">Valores incorrectos</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">No se puede realizar el arqueo de bóveda sin cantidades ingresadas. <br />
                        </h5>
                    </div>
                </div>,
                showCloseButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModalBoveda: false }))

                }
            })
        } else {
            let TotalesCuentas: any[] = []
            state.CFormInitialValuesBoveda.ValoresCaja.forEach(element => {
                let Total = 0;
                element.Denominaciones.forEach(element2 => {
                    Total = Total + element2.Total;
                }); 4
                let a = {
                    CuentaID: element.CuentaBancoID,
                    DescCuentaBanco: element.DescCuentaBanco,
                    NumeroCuenta: element.NumeroCuenta,
                    Total: Total
                }
                TotalesCuentas.push(a)
            });
            MySwal.fire({
                focusCancel: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Confirmación</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Verifica los totales. <br />
                            <strong>NOTA: Una vez confirmados estos no podrán cambiarse.
                            </strong></h5>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Cuenta</th>
                                                <th className='text-center'>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TotalesCuentas.map((item: any) => {
                                                return (
                                                    <tr key={item.CuentaID}>
                                                        <td className='text-center'>{item.DescCuentaBanco} </td>
                                                        <td className='text-center'>{FormateoDinero.format(item.Total)}</td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',

            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModalBoveda: true }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Guardando</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Espera mientras se procesa la solicitud. <br /> </h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading()
                            },
                        }
                    );
                    Funciones.FNAddRegistroBoveda(props.Seguridad, state.CFormInitialValuesBoveda)
                        .then((respuesta: any) => {
                            toast.success(respuesta.Mensaje)
                            setState(s => ({ ...s, Mostrar: false, BotonesModalBoveda: false }))
                            setState(s => ({
                                ...s,
                                ShowArqueoBovedaWZ: false,
                                FormBoveda: {
                                    ...s.FormBoveda,
                                    Mostrar: false
                                }
                            }))
                            MySwal.close()
                            if (respuesta.MensajeID == 1) {
                                cbActualizar(respuesta.CajaID)
                            }
                        })
                        .catch((res: any) => {
                            const msg = Boolean(res.response?.data) ? res.response?.data : ""
                            toast.error("Ocurrió un problema mientras se guardaba, reintente. " + msg);
                            setState(s => ({
                                ...s,
                                BotonesModalBoveda: false,
                                ShowArqueoBovedaWZ: false,
                                FormBoveda: {
                                    ...s.FormBoveda,
                                    Mostrar: false
                                }
                            }))
                            MySwal.close()
                        })
                } else {
                    setState(s => ({ ...s, BotonesModalBoveda: false }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Continuar`,
                            confirmButtonColor: '#3085d6',
                        }
                    );
                }
            })
        }

    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Arqueo de caja">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {!state.Cargando && !state.Error && <div className="conteiner">
                                <DataTable
                                    subHeader
                                    noDataComponent={""}
                                    subHeaderComponent=
                                    {
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="Buscar movimientos" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => FnGetCajas()}><FiRefreshCcw /></button>
                                                </div >
                                            </div >
                                        </div >
                                    }
                                    data={state.DatosMostrar}
                                    striped
                                    pagination
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"bancoID"}
                                    defaultSortField={"bancoID"}
                                    columns={Columns}
                                />

                                <ModalWin open={state.Form.Mostrar} xlarge={false} large={true} scrollable={true} center={true}>
                                    <ModalWin.Header>
                                        <h4 className={MODAL_TITLE_CLASS}>
                                            {state.Form.Id ? "" : "Arqueo de caja"}
                                        </h4>
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        <Formik initialValues={state.CFormInitialValues} /* validationSchema={validationSchema} */ onSubmit={() => { }}>
                                            {({ }) => (
                                                <Form>
                                                    {state.CargandoModal && <Spinner />}
                                                    {!state.CargandoModal &&
                                                        <div >
                                                           {/* <h5><strong>Cuentas de la caja:&nbsp;</strong><span style={{ color: 'red' }}>{state.CFormInitialValues.CajaNombre}</span></h5>*/}
                                                                        
                                                                                <>
                                                                                    <DataTable
                                                                                        data={state.CFormInitialValues.ValoresCaja[0].Denominaciones}
                                                                                        striped
                                                                                        pagination={false}
                                                                                        dense
                                                                                        noHeader
                                                                                        responsive
                                                                                        keyField={"CatDenomEfectivoID"}
                                                                                        defaultSortField={"CatDenomEfectivoID"}
                                                                                        columns={[
                                                                                            {
                                                                                                name: 'Id',
                                                                                                selector: 'CatDenomEfectivoID',
                                                                                                sortable: false,
                                                                                                center: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Concepto',
                                                                                                selector: 'Concepto',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                wrap: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Valor monetario',
                                                                                                selector: 'ValorMonetario',
                                                                                                sortable: false,
                                                                                                center: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Captura',
                                                                                                selector: 'cantidad',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) =>
                                                                                                    <Field disabled={false} id={"cantidad" + propss.CatDenomEfectivoID} name={"cantidad" + propss.CatDenomEfectivoID}>
                                                                                                        {
                                                                                                            (control: any) => (
                                                                                                                <input
                                                                                                                    //type="number"
                                                                                                                    step='0'
                                                                                                                    min='0'
                                                                                                                   // key={CuentaBancoID}
                                                                                                                    id={"cantidad" + propss.CatDenomEfectivoID}
                                                                                                                    placeholder='Captura'
                                                                                                                    className="form-control"
                                                                                                                    onKeyPress={(event) => {
                                                                                                                        if (!/[0-9]/.test(event.key)) {
                                                                                                                            event.preventDefault();
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    value={control.field.value}
                                                                                                                    type="text" pattern="[0-9]*" disabled={false}
                                                                                                                    onBlur={(value: any) => {
                                                                                                                        if (parseInt(value.target.value) > 0) {
                                                                                                                            propss.Cantidad = parseInt(value.target.value)
                                                                                                                            if (isNaN(propss.Total)) {
                                                                                                                                propss.Total = 0
                                                                                                                            }
                                                                                                                            if (propss.Total !== undefined) {
                                                                                                                                if (propss.totalNuevo !== undefined) {
                                                                                                                                    propss.totalAn = propss.totalNuevo
                                                                                                                                }
                                                                                                                                if (propss.totalAn === undefined) {
                                                                                                                                    calcularTotal(propss)
                                                                                                                                    propss.totalAn = propss.Total
                                                                                                                                }
                                                                                                                            }

                                                                                                                            setState({
                                                                                                                                ...state,
                                                                                                                                CFormInitialValues: {
                                                                                                                                    ...state.CFormInitialValues,
                                                                                                                                    ValoresCaja: [
                                                                                                                                        ...state.CFormInitialValues.ValoresCaja
                                                                                                                                        
                                                                                                                                    ]
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                        if (parseInt(value.target.value) == 0) {
                                                                                                                            if (propss.Cantidad === 0) {
                                                                                                                                MySwal.fire(
                                                                                                                                    {
                                                                                                                                        icon: 'error',
                                                                                                                                        html: <div><br />

                                                                                                                                            <h3 className="text-center">Error!</h3>
                                                                                                                                            <div className={`modal-body`}>
                                                                                                                                                <h5 className="text-center">
                                                                                                                                                    La cantidad no puede ser 0
                                                                                                                                                </h5>
                                                                                                                                            </div>
                                                                                                                                        </div>,
                                                                                                                                        timerProgressBar: false,
                                                                                                                                        confirmButtonText: `Ok`,

                                                                                                                                    }
                                                                                                                                );
                                                                                                                            } else if (propss.Cantidad > 1) {
                                                                                                                                propss.Cantidad = parseInt(value.target.value)
                                                                                                                                if (isNaN(propss.Total)) {
                                                                                                                                    propss.Total = 0
                                                                                                                                }
                                                                                                                                if (propss.Total !== undefined) {
                                                                                                                                    if (propss.totalNuevo !== undefined) {
                                                                                                                                        propss.totalAn = propss.totalNuevo
                                                                                                                                    }
                                                                                                                                    if (propss.totalAn === undefined) {
                                                                                                                                        calcularTotal(propss)
                                                                                                                                        propss.totalAn = propss.Total
                                                                                                                                    }
                                                                                                                                }

                                                                                                                                setState({
                                                                                                                                    ...state,
                                                                                                                                    CFormInitialValues: {
                                                                                                                                        ...state.CFormInitialValues,
                                                                                                                                        ValoresCaja: [
                                                                                                                                            ...state.CFormInitialValues.ValoresCaja
                                                                                                                                            
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    onChange={(value: any) => {
                                                                                                                        let suma = parseInt(value.target.value) * propss.ValorMonetario
                                                                                                                        propss.Total = suma
                                                                                                                        /*  setState({
                                                                                                                             ...state,
                                                                                                                             CFormInitialValues: {
                                                                                                                                 ...state.CFormInitialValues,
                                                                                                                                 ValoresCaja: [
                                                                                                                                     ...state.CFormInitialValues.ValoresCaja.map((dato => element.CuentaBancoID == dato.CuentaBancoID ? {
                                                                                                                                         ...dato,
                                                                                                                                         Denominaciones: [
                                                                                                                                             ...dato.Denominaciones.map(denom =>
                                                                                                                                                 denom.CatDenomEfectivoID == propss.CatDenomEfectivoID ? {
                                                                                                                                                     ...denom,
                                                                                                                                                     Cantidad: parseInt(value.target.value),
                                                                                                                                                     Total: parseInt(value.target.value) * denom.ValorMonetario
                                                                                                                                                 } : denom)
                                                                                                                                         ]
                                                                                                                                     } : dato)
                                                                                                                                     )
                                                                                                                                 ]
                                                                                                                             }
                                                                                                                         }) */
                                                                                                                        /* setState({
                                                                                                                            ...state,
                                                                                                                            CFormInitialValues: {
                                                                                                                                ...state.CFormInitialValues,
                                                                                                                                ValoresCaja: [
                                                                                                                                    ...state.CFormInitialValues.ValoresCaja.map((element, i1) => {
                                                                                                                                        if (i1 === i1) {
                                                                                                                                            element.Denominaciones = [
                                                                                                                                                ...element.Denominaciones.map(
                                                                                                                                                    element2 => element2.CatDenomEfectivoID === propss.CatDenomEfectivoID ? 
                                                                                                                                                    { ...element2, Cantidad: parseInt(value.target.value), Total: suma } : element2
                                                                                                                                                )
                                                                                                                                            ]
                                                                                                                                        }
                                                                                                                                        return element
                                                                                                                                    }
                                                                                                                                    )
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        }) */

                                                                                                                    }}
                                                                                                                />
                                                                                                            )
                                                                                                        }
                                                                                                    </Field>
                                                                                            },
                                                                                            {
                                                                                                name: 'Cantidad',
                                                                                                selector: 'Cantidad',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) => <span className="text-center">{propss.Cantidad}</span>

                                                                                            },
                                                                                            {
                                                                                                name: 'Total',
                                                                                                selector: 'total',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) => propss.Total == undefined ? <span className="text-center">$ 0.00</span> : <span className="text-center">{FormateoDinero.format(propss.Total)}</span>
                                                                                            }



                                                                                        ]}
                                                                                    />


                                                                                </>

                                                                  
                                                                
                                                            <div className="text-end mt-4">

                                                                <button disabled={state.BotonesModal} type="reset" className="btn btn-danger waves-effect waves-light" onClick={fnCancelar}>
                                                                    Cancelar
                                                                </button>
                                                                <button disabled={state.BotonesModal} type='button' onClick={() => { validarValores() }} className="ms-2 btn btn-success waves-effect waves-light">
                                                                    Ok
                                                                </button>
                                                            </div>

                                                        </div>}
                                                </Form>
                                            )
                                            }
                                        </Formik >
                                        {/*   <CuentasArqueosDinamicas
                                            Seguridad={props.Seguridad}
                                            Size={2}
                                            initialValues={state.CFormInitialValues}
                                            Id={state.Form.Id}
                                            cbActualizar={cbActualizar}
                                            cbGuardar={cbAgregar}
                                            DatosTabla={state.DatosTabla}
                                            fnCancelar={fnCancelar}
                                            optionsSucursal={state.OptionsSucursal}
                                            optionsCajas={state.OptionsCaja}
                                            calcularTotal={calcularTotal}
                                            CargandoModal={state.CargandoModal}
                                            TotalGeneral={state.TotalGeneral}
                                            CajaID={state.CajaID}
                                        /> */}
                                        {/*  <CForm
                                            Seguridad={props.Seguridad}
                                            initialValues={state.Form.Datos}
                                            Id={state.Form.Id}
                                            cbActualizar={cbActualizar}
                                            cbGuardar={cbAgregar}
                                            DatosTabla={state.DatosTabla}
                                            fnCancelar={fnCancelar}
                                            optionsSucursal={state.OptionsSucursal}
                                            optionsCajas={state.OptionsCaja}
                                            calcularTotal={calcularTotal}
                                            CargandoModal={state.CargandoModal}
                                            TotalGeneral={state.TotalGeneral}
                                            CajaID={state.CajaID}
                                        /> */}
                                    </ModalWin.Body>
                                </ModalWin>

                                <ModalWin open={state.FormBoveda.Mostrar} xlarge={false} large={true} scrollable={true} center={true}>
                                    <ModalWin.Header>
                                        <h4 className={MODAL_TITLE_CLASS}>
                                            {state.FormBoveda.Id ? "" : "Arqueo de Bóveda"}
                                        </h4>
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        <Formik initialValues={state.CFormInitialValuesBoveda} onSubmit={() => { }}>
                                            {({ }) => (
                                                <Form>
                                                    {state.CargandoModal && <Spinner />}
                                                    {!state.CargandoModal &&
                                                        <div >
                                                            <h5><strong>Cuentas de la caja:&nbsp;</strong><span style={{ color: 'red' }}>{state.CFormInitialValuesBoveda.CajaNombre}</span></h5>

                                                            <FieldArray name="tickets">
                                                                {() => (state.CFormInitialValuesBoveda.ValoresCaja.map((element, i1) => {
                                                                    return (
                                                                        <Acordion key={i1} TabSelecionado={'Cuensstas' + element.CuentaBancoID}>
                                                                            <Acordion.Tab Identificador={'Cuentas' + element.CuentaBancoID}
                                                                                Titulo={<React.Fragment><FaMoneyCheck />&nbsp;<strong>ID:&nbsp;</strong>{element.CuentaBancoID} - <strong> Opera:&nbsp; </strong> {element.TipoMovimiento}  - <strong>Producto:&nbsp; </strong> {element.Producto}
                                                                                </React.Fragment>}>
                                                                                <>
                                                                                    <DataTable
                                                                                        data={state.CFormInitialValuesBoveda.ValoresCaja[i1].Denominaciones}
                                                                                        striped
                                                                                        pagination={false}
                                                                                        dense
                                                                                        noHeader
                                                                                        responsive
                                                                                        keyField={"CatDenomEfectivoID"}
                                                                                        defaultSortField={"CatDenomEfectivoID"}
                                                                                        columns={[
                                                                                            {
                                                                                                name: 'Id',
                                                                                                selector: 'CatDenomEfectivoID',
                                                                                                sortable: false,
                                                                                                center: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Concepto',
                                                                                                selector: 'Concepto',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                wrap: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Valor monetario',
                                                                                                selector: 'ValorMonetario',
                                                                                                sortable: false,
                                                                                                center: true
                                                                                            },
                                                                                            {
                                                                                                name: 'Captura',
                                                                                                selector: 'cantidad',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) =>
                                                                                                
                                                                                                    <Field disabled={false} id={"cantidad" + propss.CatDenomEfectivoID + element.CuentaBancoID} name={"cantidad" + propss.CatDenomEfectivoID + element.CuentaBancoID}>
                                                                                                        {
                                                                                                            (control: any) => (
                                                                                                                <input
                                                                                                                    //type="number"
                                                                                                                    step='0'
                                                                                                                    min='0'
                                                                                                                    key={element.CuentaBancoID}
                                                                                                                    id={"cantidad" + propss.CatDenomEfectivoID + element.CuentaBancoID}
                                                                                                                    placeholder='Captura'
                                                                                                                    className="form-control"
                                                                                                                    onKeyPress={(event) => {
                                                                                                                        if (!/[0-9]/.test(event.key)) {
                                                                                                                            event.preventDefault();
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    value={control.field.value}
                                                                                                                    type="text" pattern="[0-9]*" disabled={false}
                                                                                                                    onBlur={(value: any) => {
                                                                                                                        if (parseInt(value.target.value) > 0) {
                                                                                                                            propss.Cantidad = parseInt(value.target.value)
                                                                                                                            if (isNaN(propss.Total)) {
                                                                                                                                propss.Total = 0
                                                                                                                            }
                                                                                                                            if (propss.Total !== undefined) {
                                                                                                                                if (propss.totalNuevo !== undefined) {
                                                                                                                                    propss.totalAn = propss.totalNuevo
                                                                                                                                }
                                                                                                                                if (propss.totalAn === undefined) {
                                                                                                                                    calcularTotal(propss)
                                                                                                                                    propss.totalAn = propss.Total
                                                                                                                                }
                                                                                                                            }

                                                                                                                            setState({
                                                                                                                                ...state,
                                                                                                                                CFormInitialValuesBoveda: {
                                                                                                                                    ...state.CFormInitialValuesBoveda,
                                                                                                                                    ValoresCaja: [
                                                                                                                                        ...state.CFormInitialValuesBoveda.ValoresCaja.map((dato => element.CuentaBancoID == dato.CuentaBancoID ? {
                                                                                                                                            ...dato,
                                                                                                                                            Denominaciones: [
                                                                                                                                                ...dato.Denominaciones.map(denom =>
                                                                                                                                                    denom.CatDenomEfectivoID == propss.CatDenomEfectivoID ? {
                                                                                                                                                        ...denom,
                                                                                                                                                        Cantidad: parseInt(value.target.value),
                                                                                                                                                        Total: parseInt(value.target.value) * denom.ValorMonetario
                                                                                                                                                    } : denom)
                                                                                                                                            ]
                                                                                                                                        } : dato)
                                                                                                                                        )
                                                                                                                                    ]
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                        if (parseInt(value.target.value) == 0) {
                                                                                                                            if (propss.Cantidad === 0) {
                                                                                                                                MySwal.fire(
                                                                                                                                    {
                                                                                                                                        icon: 'error',
                                                                                                                                        html: <div><br />

                                                                                                                                            <h3 className="text-center">Error!</h3>
                                                                                                                                            <div className={`modal-body`}>
                                                                                                                                                <h5 className="text-center">
                                                                                                                                                    La cantidad no puede ser 0
                                                                                                                                                </h5>
                                                                                                                                            </div>
                                                                                                                                        </div>,
                                                                                                                                        timerProgressBar: false,
                                                                                                                                        confirmButtonText: `Ok`,

                                                                                                                                    }
                                                                                                                                );
                                                                                                                            } else if (propss.Cantidad > 1) {
                                                                                                                                propss.Cantidad = parseInt(value.target.value)
                                                                                                                                if (isNaN(propss.Total)) {
                                                                                                                                    propss.Total = 0
                                                                                                                                }
                                                                                                                                if (propss.Total !== undefined) {
                                                                                                                                    if (propss.totalNuevo !== undefined) {
                                                                                                                                        propss.totalAn = propss.totalNuevo
                                                                                                                                    }
                                                                                                                                    if (propss.totalAn === undefined) {
                                                                                                                                        calcularTotal(propss)
                                                                                                                                        propss.totalAn = propss.Total
                                                                                                                                    }
                                                                                                                                }

                                                                                                                                setState({
                                                                                                                                    ...state,
                                                                                                                                    CFormInitialValuesBoveda: {
                                                                                                                                        ...state.CFormInitialValuesBoveda,
                                                                                                                                        ValoresCaja: [
                                                                                                                                            ...state.CFormInitialValuesBoveda.ValoresCaja.map((dato => element.CuentaBancoID == dato.CuentaBancoID ? {
                                                                                                                                                ...dato,
                                                                                                                                                Denominaciones: [
                                                                                                                                                    ...dato.Denominaciones.map(denom =>
                                                                                                                                                        denom.CatDenomEfectivoID == propss.CatDenomEfectivoID ? {
                                                                                                                                                            ...denom,
                                                                                                                                                            Cantidad: parseInt(value.target.value),
                                                                                                                                                            Total: parseInt(value.target.value) * denom.ValorMonetario
                                                                                                                                                        } : denom)
                                                                                                                                                ]
                                                                                                                                            } : dato)
                                                                                                                                            )
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    onChange={(value: any) => {
                                                                                                                        let suma = parseInt(value.target.value) * propss.ValorMonetario
                                                                                                                        propss.Total = suma
                                                                                                                    }}
                                                                                                                />
                                                                                                            )
                                                                                                        }
                                                                                                    </Field>
                                                                                            },
                                                                                            {
                                                                                                name: 'Cantidad',
                                                                                                selector: 'Cantidad',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) => <span className="text-center">{propss.Cantidad}</span>

                                                                                            },
                                                                                            {
                                                                                                name: 'Total',
                                                                                                selector: 'total',
                                                                                                sortable: false,
                                                                                                center: true,
                                                                                                cell: (propss) => propss.Total == undefined ? <span className="text-center">$ 0.00</span> : <span className="text-center">{FormateoDinero.format(propss.Total)}</span>
                                                                                            }
                                                                                        ]}
                                                                                    />
                                                                                </>
                                                                            </Acordion.Tab>
                                                                        </Acordion>

                                                                    );
                                                                }))}
                                                            </FieldArray>
                                                            <div className="text-end mt-4">
                                                                <button disabled={state.BotonesModalBoveda} type="reset" className="btn btn-danger waves-effect waves-light" onClick={fnCancelarBoveda}>
                                                                    Cancelar
                                                                </button>
                                                                <button disabled={state.BotonesModalBoveda} type='button' onClick={() => { validarValoresBoveda() }} className="ms-2 btn btn-success waves-effect waves-light">
                                                                    Ok
                                                                </button>
                                                            </div>

                                                        </div>}
                                                </Form>
                                            )
                                            }
                                        </Formik >
                                    </ModalWin.Body>
                                </ModalWin>
                            </div >
                            }
                        </Card.Body.Content >
                    </Card.Body >
                </Card >
            </div >
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc,
    iUI: state.UI,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoBancos)