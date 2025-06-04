import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoCuentas/Funciones'
import * as FuncionesCuentaContable from './CatalogoCuentasContables/Funciones'
import * as FuncionesBancoNuevo from './BancoBancos/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaFileInvoiceDollar } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancoCuentas/CForm'
import { CFormProducto } from './BancoCuentas/CFormProducto'
import { CFormCuentasContables } from './CatalogoBoveda/CFormCuentasContables'
import { CFormBancoNuevo } from './CatalogoBoveda/CFormBancoNuevo'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { react } from '@babel/types'
import { FNGetSucursal } from '../../bancos/CompBancos/CatalogoDispersiones/Funciones'
import * as FuncionesContables from './CatalogoCuentasContables/Funciones'


type CatalogosType = {
    Seguridad: IOidc,
    ui: iUI,
    location: any,
    match: any
}

const CatalogoBancoCuentas = (props: CatalogosType) => {

    
    const MySwal = withReactContent(Swal)

    let isMounted = React.useRef(true)
    const DatosDefecto = {
        cuentaBancoID: 0,
        numeroCuenta: '',
        bancoID: 0,
        cuentaID: 0,
        activo: true,
        puedeDispersar: true,
        dispersionConvenio: '',
        cobranzaConvenio: '',
        global: true,
        saldoMin: 0,
        saldoMax: 0,
        saldoActual: 0,
        banderaSaldoActual: false,
        excedenteSaldo: 0,
        productoID: 0,
        descripcionCuenta: '',
        cajaID: 0,
        EsBoveda: false,
        sucursalId: -1,
        responsableNombre: "",
        encargadoNombre: "",
        CuentaBancariaPrincipalID: 0,
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
        tipoBancoID: 0,
        sucursalID: 0
    }
    const DatosDefectoBancoNuevo = {
        bancoID: 0,
        nombre: '',
        activo: true,
        archivoDispersionID: 0,
        tipoBancoID: 0
    }

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsAcumula: any[] = []
    const OptionsBanco: any[] = []
    const OptionsAgrupacion: any[] = []
    const OptionsAcumula2: any[] = []
    const OptionsTipo2: any[] = []
    const OptionsNaturaleza2: any[] = []
    const OptionsRubro2: any[] = []
    const OptionsEmpresa2: any[] = []
    const OptionsMoneda2: any[] = []
    const OptionsTipoBanco2: any[] = []
    const Productos: any[] = []
    const OptionsSucursales: any[] = []
    const OptionsArchivosDispersion: any[] = []
    const OptionsTipoBanco: any[] = []
    const OptionsCuentasPrincipal: any[] = []
    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            MostrarCuentaContable: false,
            DatosCuentaContable: DatosDefectoCuentaContable,
            DatosBancoNuevo: DatosDefectoBancoNuevo,
            MostrarBancoNuevo: false,

            Datos: DatosDefecto,
            Id: undefined,
            IdCuentaContable: undefined

        },
        DatosDefectoProd: {
            productoID: 0
        },
        AbrirModal: false,
        Productos,
        OptionsAcumula,
        OptionsBanco,
        OptionsAgrupacion,
        OptionsAcumula2,
        OptionsTipo2,
        OptionsNaturaleza2,
        OptionsRubro2,
        OptionsEmpresa2,
        OptionsMoneda2,
        OptionsTipoBanco2,
        OptionsSucursales,
        OptionsArchivosDispersion,
        OptionsTipoBanco,
        OptionsCuentasPrincipal
    })
    const fnCancelarModalCuentacontable = () => {
        setState({ ...state, Form: { ...state.Form, MostrarCuentaContable: false } })
    }
    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
    }

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


    const FnGetAcumula = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Nombre, sucursalID: valor.SucursalID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula: acumula }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula: [] }))
                    toast.error("Ocurrió un problema: " + error)
                }
            })
    }

    //Funcion para obtener los datos de los bancos.
    const FnGetBanco = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetBancos(props.Seguridad)
            .then((respuesta: any) => {
               
                if (isMounted.current === true) {
                    var banco = respuesta.map((valor: any) => {
                        var obj = { value: valor.bancoID, label: valor.nombre, tipoBancoID: valor.tipoBanco.tipoBancoID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsBanco: banco }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsBanco: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
    }

    const FNGetProductos = () => {
        Funciones.FNGetProductoCuentas(props.Seguridad)
            .then((respuesta: any) => {
                
                if (isMounted.current === true) {
                    var producto = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoID, label: valor.Producto + ", Empresa: "+ valor.EmpresaNombre};
                        return obj
                    });
                    
                    setState(s => ({ ...s, OptionsAgrupacion: producto})) 
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema: " + error)
                    setState(s => ({ ...s, OptionsAgrupacion: [] }))
                }
            })
    }

    //Se llena la tabla principal con los datos de la API
    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'CuentaBancoID', sortable: false, width: '60px', center: true },
            {
                name: 'Nro Cta', selector: 'NumeroCuenta', sortable: false, width: '150px', center: true,
                cell: (props) => <span className="text-center" >{props.NumeroCuenta}</span>
            },
            {
                name: 'Producto', selector: 'Producto', sortable: false, center: true,
                cell: (props) => <span className="text-center" >{props.Producto}</span>
            },
            {
                name: 'Descripción Cuenta', center: true, selector: 'DescripcionCuenta', sortable: false, width: '150px', wrap: true,
                cell: (props) => <span className="text-center" >{props.DescripcionCuenta}</span>

            },
            { name: 'Sucursal', center: true, selector: 'sucursal', sortable: false, wrap: true, cell: (props) => <span className="text-center">{props.sucursal}</span> },

            {
                name: 'Activa',
                selector: 'CuentaBancoActiva',
                sortable: true,
                width: '60px',
                center: true,
                cell: (props) => <span>{props.CuentaBancoActiva ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },
            {
                name: 'Banco', selector: 'NombreBanco', center: true, sortable: false, wrap: true, width: '120px',
                cell: (props) => <span className="text-center">{props.NombreBanco}</span>
            },
            { name: 'Cuenta Contable', selector: 'Cuenta', center: true, sortable: false, width: '180px' },
          /*   {
                name: 'Dispersa',
                selector: 'PuedeDispersar',
                sortable: false,
                center: true,
                width: '70px',
                cell: (props) => <span>{props.PuedeDispersar ? "Si" : "No"}</span>
            }, */

       /*      { name: 'Convenio de Dispersión', center: true, selector: 'DispersionConvenio', sortable: false, width: '220px' },
            { name: 'Convenio de Cobranza', center: true, selector: 'CobranzaConvenio', sortable: false, width: '220px' },
          */    /*    { name: 'Saldo Mínimo', selector: 'saldoMin', sortable: true, width: '80px' },
                { name: 'Saldo Máximo', selector: 'saldoMax', sortable: true, width: '80px' },
                { name: 'Saldo Excedente', selector: 'excedenteSaldo', sortable: true, width: '80px' },
               */  {
                name: 'Editar', sortable: false, center: true,
                cell: (props) =>
                    <div>
                        <button data-tip="true" data-for={`Editar${props.CuentaBancoID}`} className="asstext ms-3" type={"button"} onClick={() => {
                            console.log("ESTADO ,", state.OptionsSucursales)
                            setState(s => ({
                                ...s,
                                AbrirModal: true,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        descripcionCuenta: props.DescripcionCuenta,
                                        cuentaBancoID: props.CuentaBancoID,
                                        numeroCuenta: props.NumeroCuenta,
                                        cuentaID: props.CuentaContableID,
                                        bancoID: props.BancoID,
                                        activo: props.CuentaBancoActiva,
                                        puedeDispersar: props.PuedeDispersar,
                                        dispersionConvenio: props.DispersionConvenio,
                                        cobranzaConvenio: props.CobranzaConvenio,
                                        global: props.Global,
                                        saldoMin: props.SaldoMinimo,
                                        saldoMax: props.SaldoMaximo,
                                        saldoActual: props.SaldoActual,
                                        banderaSaldoActual: props.BanderaSaldoActual,
                                        excedenteSaldo: props.ExcedenteSaldo,
                                        productoID: props.ProductoID == null ? 0 : props.ProductoID,
                                        cajaID: props.CajaID != null ? props.CajaID : 0,
                                        EsBoveda: props.EsBoveda,
                                        sucursalId: props.sucursalId,
                                        responsableNombre: props.Responsable,
                                        encargadoNombre: props.Encargado,
                                        CuentaBancariaPrincipalID: props.CuentaBancariaPrincipalID
                                    },
                                    Id: props.CuentaBancoID
                                }
                            }))

                        }}>
                            <FaPencilAlt />
                            <ReactTooltip id={`Editar${props.CuentaBancoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Editar
                            </ReactTooltip>
                        </button>
                        <button data-tip="true" data-for={`DesembolsoTooltip${props.CuentaBancoID}`} className="asstext ms-3" type={"button"} onClick={() => {
                            editarProducto(props.ProductoID, props.CuentaBancoID)
                        }}>
                            <FaFileInvoiceDollar />
                            <ReactTooltip id={`DesembolsoTooltip${props.CuentaBancoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Cambiar producto asociado a cuenta
                            </ReactTooltip>
                        </button>
                    </div>


            },
        ]

    React.useEffect(() => {
        FNGetLocal()
        FNGetSucursales()
        FNGetProductos2()
        FnGetAcumula()
        //FnGetBanco()
        FNGetProductos()
        FNGetCuentasPrincipal()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const FNGetCuentasPrincipal = () => {
        Funciones.FNGetCuentasPrincipal(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var cuentasprincipal = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancariaPrincipalID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuentasPrincipal: cuentasprincipal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    console.log("ERROR!")
                    setState(s => ({ ...s, OptionsCuentasPrincipal: [] }))

                }
            })

    }

    const FNGetSucursales = () => {
        FuncionesContables.FNGetSucursales(props.Seguridad)
            .then((respuesta: any) => {
                console.log(respuesta);
                
               
                    var sucursales = respuesta.map((valor: any) => {
                        var obj = { value: valor.SucursalID, label: valor.Nombre };
                        return obj
                    }); 
                   setState(s => ({ ...s, OptionsSucursales: sucursales }))
                
               
                
            })
            .catch((ex) => {
                if (isMounted.current === true) {
                    console.log("ERROR!", ex)
                    setState(s => ({ ...s, OptionsSucursales: [] }))

                }
            })
    }

    /*   React.useEffect(() => {
          if (!state.AbrirModal) {
              return;
          }
          editarCuenta()
  
      }, [state.AbrirModal == true]) */

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('La cuenta se agregó correctamente')
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }
        }))

        FNGetDatos()
    }
    const FnGetTipoBanco2 = () => {
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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco2: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
    }
    const cbActualizar2 = (item: any) => {
        setState(state => ({
            ...state,
            DatosMostrar: state.DatosMostrar.map(Dato => Dato.cuentaBancoID === item.cuentaBancoID ?
                { ...Dato, producto: { ...Dato, producto: item.producto.Producto, productoID: item.producto.ProductoID } } : Dato)
        }
        ))
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('La cuenta se actualizó correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.cuentaBancoID === item.cuentaBancoID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }
        }
        ))

        FNGetDatos()

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco2: [] }))
                    toast.error("Ocurrió un problema: " + error)

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMoneda2: [] }))
                    toast.error("Ocurrió un problema: " + error)

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsEmpresa2: [] }))
                    toast.error("Ocurrió un problema: " + error)

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsRubro2: [] }))
                    toast.error("Ocurrió un problema: " + error)

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsNaturaleza2: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula2: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
    }

    /*    const editarCuenta = () => {
           // setState(s => ({ ...s, DatosDefectoProd: { ...s.DatosDefectoProd, productoID: productoID } }))
   
           MySwal.fire({
   
               //width: '50%',
               showCloseButton: true,
               html: <div>
                   <div className="modal-header">
                       <h5 className="modal-title">Cambiar producto</h5>
                   </div>
                   <div className={`modal-body`}>
                       <CForm
                           Seguridad={props.Seguridad}
                           initialValues={state.Form.Datos}
                           Id={state.Form.Id}
                           cbActualizar={cbActualizar}
                           cbGuardar={cbAgregar}
                           fnCancelar={fnCancelar2}
                           FnGetAcumula={FnGetAcumula}
                           optionsBanco={state.OptionsBanco}
                           optionsAgrupacion={state.OptionsAgrupacion}
                           optionsCuenta={state.OptionsAcumula}
                           abrirModalCuentaContable={abrirModalCuentaContable}
                           abrirModalBancoNuevo={abrirModalBancoNuevo}
   
   
                       />
                   </div>
               </div>,
               showCancelButton: false,
               showConfirmButton: false,
   
           })
       } */



    const editarProducto = (productoID: number, CuentaBancoID: number) => {
        //setState(s => ({ ...s, DatosDefectoProd: { ...s.DatosDefectoProd, productoID: productoID } }))

        MySwal.fire({

            //width: '50%',
            showCloseButton: true,
            html: <div>
                <div className="modal-header">
                    <h5 className="modal-title">Cambiar producto</h5>
                </div>
                <div className={`modal-body`}>
                    <CFormProducto
                        CuentaBancoID={CuentaBancoID}
                        initialValues={state.DatosDefectoProd}
                        productoID={productoID}
                        fnCancelar={fnCancelar2}
                        optionsAgrupacion={state.OptionsAgrupacion}
                        Seguridad={props.Seguridad}
                        cbActualizar={cbActualizar2}
                    />
                </div>
            </div>,
            showCancelButton: false,
            showConfirmButton: false,

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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema: " + error)
                    setState(s => ({ ...s, OptionsTipo2: [] }))
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
        FnGetBanco()
    }
    const FNGetProductos2 = () => {
        Funciones.FNGetProductos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var productos = respuesta.map((valor: any) => {
                        var obj = {
                            value: valor.ProductoID, label: valor.Producto
                        };
                        return obj

                    });
                    setState(s => ({ ...s, Productos: productos }))

                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema: " + error)
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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
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
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsArchivosDispersion: [] }))
                    toast.error("Ocurrió un problema: " + error)

                }
            })
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
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    const fnCancelar2 = () => {
        MySwal.close()
        setState({ ...state, AbrirModal: false })
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Catálogo Cuentas bancarias">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        defaultSortAsc={true}
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { ...state.Form, Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
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
                                        keyField={"cuentaBancoID"}
                                        defaultSortField={"cuentaBancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin scrollable={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Cuenta Banco" : "Agregar Cuenta Banco"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                optionsSucursal={state.OptionsSucursales}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                FnGetAcumula={FnGetAcumula}
                                                optionsBanco={state.OptionsBanco}
                                                optionsAgrupacion={state.OptionsAgrupacion}
                                                optionsCuenta={state.OptionsAcumula}
                                                abrirModalCuentaContable={abrirModalCuentaContable}
                                                abrirModalBancoNuevo={abrirModalBancoNuevo}
                                                optionsCuentasPrincipal={state.OptionsCuentasPrincipal}


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
                                                options8={state.OptionsSucursales}

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
    Seguridad: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoCuentas)