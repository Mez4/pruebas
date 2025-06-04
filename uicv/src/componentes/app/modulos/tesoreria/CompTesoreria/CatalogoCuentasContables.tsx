import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoCuentasContables/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoCuentasContables/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'



type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoCuentasContables = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
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
        dispersa: true,
        sucursalID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsAcumula: any[] = []
    const OptionsTipo: any[] = []
    const OptionsNaturaleza: any[] = []
    const OptionsRubro: any[] = []
    const OptionsEmpresa: any[] = []
    const OptionsMoneda: any[] = []
    const OptionsTipoBanco: any[] = []
    const OptionsSucursales: any[] = []

    const [state, setState] = React.useState({
        Habilitar: true,
        idEliminar: 0,
        Datos,
        DatosMostrar,
        modalEliminar: false,
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
        OptionsAcumula,
        OptionsTipo,
        OptionsNaturaleza,
        OptionsRubro,
        OptionsEmpresa,
        OptionsMoneda,
        OptionsTipoBanco,
        OptionsSucursales

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

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursales: [] }))

                }
            })
    }
    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {


                    respuesta.forEach((element: any) => {
                        if (element.acumulaCuenta != null) {
                            element.acumulaCuentaId = element.acumulaCuenta.id
                            element.acumulaCuenta = element.acumulaCuenta.nombre

                        } else {
                            element.acumulaCuentaId = 0
                        }

                        if (element.tipoBanco != null) {
                            element.tipoBancoID = element.tipoBanco.tipoBancoID

                        } else {
                            element.tipoBancoID = 0
                        }

                        if (element.sucursalID != null) {
                            element.sucursalID = element.sucursalID

                        } else {
                            element.sucursalID = -1
                        }
                    });
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
                    respuesta.forEach((element: any) => {
                        if (element.acumulaCuenta != null) {
                            element.acumulaCuentaId = element.acumulaCuenta.id
                            element.acumulaCuenta = element.acumulaCuenta.nombre

                        } else {
                            element.acumulaCuentaId = 0
                        }
                        if (element.tipoBanco != null) {
                            element.tipoBancoID = element.tipoBanco.tipoBancoID


                        } else {
                            element.tipoBancoID = 0
                        }
                    });
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Acumula Cuenta
    const FnGetAcumula = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Nombre };
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

    //Funcion para obtener los datos de Tipo de cuenta
    const FnGetTipo = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetTipos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var tipo = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsTipo: tipo }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipo: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Naturaleza
    const FnGetNaturaleza = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetNaturalezas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var naturaleza = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsNaturaleza: naturaleza }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsNaturaleza: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Rubro
    const FnGetRubro = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetRubros(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var rubro = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsRubro: rubro }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsRubro: [] }))
                }
            })
    }
    //Funcion para obtener los datos de Empresa
    const FnGetEmpresa = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetEmpresas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var empresa = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsEmpresa: empresa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsEmpresa: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Moneda
    const FnGetMoneda = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetMonedas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var moneda = respuesta.map((valor: any) => {
                        var obj = { value: valor.monedaId, label: valor.nombreMoneda };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMoneda: moneda }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMoneda: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Moneda
    const FnGetTipoBanco = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetTipoBanco(props.Seguridad)
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CuentaID', sortable: true, center: true },
                { name: 'Nombre Cuenta', selector: 'Nombre', sortable: true, center: true },
                { name: 'Cuenta', selector: 'Cuenta', sortable: true, center: true },
                { name: 'Acumula a:', selector: 'NombreAcumulaCuenta', sortable: true, center: true },

                {
                    name: 'Activa',
                    selector: 'Activa',
                    sortable: true,
                    cell: (props) => <span>{props.Activa ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>,
                    center: true
                },

                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s, modalEliminar: false,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        id: props.CuentaID,
                                        cuenta: props.Cuenta,
                                        acumulaCuentaId: props.AcumulaCuentaID == null ? 0 : props.AcumulaCuentaID,
                                        nombre: props.Nombre,
                                        tipoId: props.TipoID,
                                        naturalezaId: props.NaturalezaID,
                                        rubroId: props.RubroID,
                                        empresaId: props.EmpresaID,
                                        monedaId: props.CatMonedaSatID,
                                        activa: props.Activa,
                                        fechaRegistro: props.FechaRegistro,
                                        tipoBancoID: props.TipoBancoId,
                                        dispersa: props.Dispersa,
                                        sucursalID: props.SucursalID
                                    },
                                    Id: props.CuentaID

                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>,
                    center: true
                },
                // {
                //     name: 'Eliminar', sortable: false, cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s, modalEliminar: true, nombre: "Eliminar Cuenta", idEliminar: props.id, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined }
                //             }))
                //         }}><FaTrash color="red" />
                //         </button>
                // },

            ]
        return colRet

        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        FnGetAcumula()
        FnGetTipo()
        FnGetNaturaleza()
        FnGetRubro()
        FnGetEmpresa()
        FnGetMoneda()
        FnGetTipoBanco()
        FNGetSucursales()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('La cuenta se agrego correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined }
        })
        FnGetAcumula()
        FNGetDatos()

    }



    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('La cuenta se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.id === item.id ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
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
                    dispersa: false,
                    sucursalID: 0,
                }
            }
        }
        ))
        FnGetAcumula()
        FNGetDatos()
    }


    /** funcion Callback al eliminar un item */
    const FnEliminar = (item: any) => {
        Funciones.FNDelete(props.Seguridad, item)
            .then((respuesta: any) => {

                //setLoading(false)
                setState(state => ({ ...state, Form: { ...state.Form, Mostrar: false } }))
                toast.success('La cuenta se elimino correctamente')
                FnGetAcumula()
                FNGetDatos()

            }).catch((error: any) => {
                setState(state => ({ ...state, Form: { ...state.Form, Mostrar: false } }))
                toast.error('La cuenta no se puede eliminar')

                //setLoading(false)
            }
            )
    }







    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    return (
        <div className="row">
            <div className="col-12">

                <Card Title="Listado de cuentas contables">
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
                                                        <input type="text" className="form-control" placeholder="Buscar cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, modalEliminar: false, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
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
                                        keyField={"cuenta"}
                                        defaultSortField={"cuenta"}
                                        columns={Columns}
                                    />
                                    <ModalWin large={true} center={true} open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.modalEliminar === true && state.Form.Id === true ? state.nombre : ""}
                                                {state.Form.Id && state.modalEliminar === false && "Editar Cuenta Contable"}
                                                {state.Form.Id === undefined && state.modalEliminar === false && "Agregar Cuenta Contable"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                idEliminar={state.idEliminar}
                                                fnCancelar={fnCancelar}
                                                FnEliminar={FnEliminar}
                                                modalEliminar={state.modalEliminar}
                                                options={state.OptionsAcumula}
                                                options2={state.OptionsTipo}
                                                options3={state.OptionsNaturaleza}
                                                options4={state.OptionsRubro}
                                                options5={state.OptionsEmpresa}
                                                options6={state.OptionsMoneda}
                                                options7={state.OptionsTipoBanco}
                                                options8={state.OptionsSucursales}

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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCuentasContables)