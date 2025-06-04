import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoCuentasBancariasPrincipal/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoCuentasBancariasPrincipal/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'
import DataGridComp from '../../../../global/DataGrid'




type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoCuentasBancariasPrincipal = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        BancoID: 0,
        TipoCuentaBancoID: 0,
        NumeroCuenta: '',
        DescripcionCuenta: '',
        EsReal: false,
        CuentaActiva: false,
        TipoCuenta: '',
        BancoNombre: '',
        BancoActivo: false,

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const OptionsSucursal: any[] = []
    const optBancos: any[] = []
    const optTipoCuentaBancaria: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,
        optTipoCuentaBancaria,
        Datos,
        DatosMostrar,
        optBancos,
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

        OptionsSucursal,

    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Datos: respuesta, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FNGetBancos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var bancos = respuesta.map((valor: any) => {
                        var obj = { value: valor.BancoID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, optBancos: bancos, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FNGetTipoCuentaBancarias = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoCuentaBanco(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var bancos = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoCuentaBancoID, label: valor.TipoCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, optTipoCuentaBancaria: bancos, Cargando: false }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CuentaBancariaPrincipalID', sortable: false, center: true, },
                {
                    name: 'Número Cuenta', selector: 'NumeroCuenta', sortable: false, center: true,
                    cell: (props) => <span className='text-center'>{props.NumeroCuenta}</span>
                },
                {
                    name: 'Descripción', selector: 'DescripcionCuenta', sortable: false, center: true,
                    cell: (props) => <span className='text-center'>{props.DescripcionCuenta}</span>
                },
                {
                    name: 'Cuenta Activa', selector: 'CuentaActiva', sortable: false, center: true,
                    cell: (props) => 
                    <span className='text-center'>
                        {props.CuentaActiva ? (
                            <FaCircle color="green" title="Activo" />
                        ) : props.CuentaInactiva ? (
                             <FaCircle color="red" title="Inactivo" />
                        ) : props.CuentaAdvertencia ? (
                            <FaCircle color="yellow" title="Advertencia" />
                        ) : (
                            <FaCircle color="orange" title="Naranja" />
                        )}
                  </span>
                },
                {
                    name: 'Real', selector: 'EsReal', sortable: false, center: true,
                    cell: (props) => <span>{props.EsReal ? <span className='text-center'>Si</span> : <span className='text-center'>No</span>}</span>
                },

                { name: 'Tipo', selector: 'TipoCuenta', sortable: false, center: true, },
                {
                    name: 'Banco', selector: 'BancoNombre', sortable: false, center: true,
                    cell: (props) => <span className='text-center'>{props.BancoNombre}</span>
                },
                {
                    name: 'Estatus Banco', selector: 'BancoActivo', sortable: false, center: true,
                    cell: (props) => <span className='text-center'>{props.BancoActivo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Editar', sortable: false, center: true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            console.log(props)
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        BancoID: props.BancoID,
                                        TipoCuentaBancoID: props.TipoCuentaBancoID,
                                        NumeroCuenta: props.NumeroCuenta,
                                        DescripcionCuenta: props.DescripcionCuenta,
                                        EsReal: props.EsReal,
                                        CuentaActiva: props.CuentaActiva,
                                        TipoCuenta: props.TipoCuenta,
                                        BancoNombre: props.BancoNombre,
                                        BancoActivo: props.BancoActivo,
                                    },
                                    Id: props.CuentaBancariaPrincipalID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        FNGetBancos()
        FNGetTipoCuentaBancarias()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-lined
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    NumeroCuenta: '',
                    DescripcionCuenta: '',
                    EsReal: false,
                    CuentaActiva: false,
                    TipoCuentaBancoID: 0,
                    TipoCuenta: '',
                    BancoID: 0,
                    BancoNombre: '',
                    BancoActivo: false,

                }
            }
        })
    }

    const cbActualizar2 = (item: any) => {
        toast.success('La cuenta se actualizó correctamente.')

        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CuentaBancariaPrincipalID === item.CuentaBancariaPrincipalID ?
                {
                    ...Dato,
                    NumeroCuenta: item.NumeroCuenta,
                    DescripcionCuenta: item.DescripcionCuenta,
                    EsReal: item.EsReal,
                    CuentaActiva: item.CuentaActiva,
                    TipoCuentaBancoID: item.TipoCuentaBancoID,
                    TipoCuenta: item.TipoCuenta,
                    BancoID: item.BancoID,
                    BancoNombre: item.BancoNombre,
                    BancoActivo: item.BancoActivo,
                } : Dato)
        }
        ))
        //Modal false
        setState(s => ({ ...s, Form: { ...s.Form, Mostrar: false } }))
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Catálogo Cuentas Bancarias Principal">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div> 
                                    <DataGridComp
                                        data={state.DatosMostrar}
                                    // rowId="CreditoTienditaID"
                                    />
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Conciliación" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
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
                                        keyField={"CuentaBancariaPrincipalID"}
                                        defaultSortField={"CuentaBancariaPrincipalID"}
                                        columns={Columns}
                                    />
                                    <ModalWin large={true} center={true} open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar cuenta principal" : "Agregar cuenta principal"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar2}
                                                fnCancelar={fnCancelar}
                                                optBancos={state.optBancos}
                                                optTipoCuentaBancaria={state.optTipoCuentaBancaria}
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCuentasBancariasPrincipal)