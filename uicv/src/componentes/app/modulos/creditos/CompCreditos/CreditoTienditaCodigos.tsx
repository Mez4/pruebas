import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoTienditaCodigos/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaBan, FaCheckCircle, FaCheckSquare, FaCircle, FaCrosshairs, FaPencilAlt, FaPlus, FaRegSquare, FaSearch, FaTimesCircle, FaUser, FaUserSlash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoTienditaCodigos/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useParams } from 'react-router'
import { Tooltip } from '@mui/material'
import ReactTooltip from 'react-tooltip'

type CatalogosType = {
    oidc: IOidc
}

const CreditoTiienditaCodigos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        SKU: 0, Descuento: 0, SucursalID: 0, DistribuidorID: 0, Motivo: '', ClienteID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    // Ontenemos el ID del producto
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)


    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                console.log('Datos2', state.Datos)
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const fnActivar = (CodigoID: number) => {
        console.log('Datos1', state.Datos); // Aquí puede no estar actualizado aún
        Funciones.FNActivarDesactivar(props.oidc, CodigoID)
            .then((respuesta: any) => {
                console.log('respuesta1', respuesta);
                setState(s => {
                    console.log('Datos4', s.Datos); // Aquí accederás al estado más reciente
                    return {
                        ...s,
                        Datos: s.Datos.map(Dato => Dato.CodigoID === respuesta.CodigoID ? respuesta : Dato),
                    };
                });
                toast.success("El código ha sido cancelado");
            })
            .catch((error: any) => {
                console.log(JSON.stringify(error));
                toast.error(error.response?.data);
            });
    };


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CodigoID', sortable: true, width: '5%', wrap: true },
                { name: 'SKU', selector: 'SKU', sortable: true, width: '8%', wrap: true },
                { name: 'Descuento%', selector: 'Descuento', sortable: true, width: '9%', center: true, wrap: true },
                { name: 'Codigo', selector: 'Codigo', sortable: true, center: true, wrap: true },
                { name: 'Distribuidor', selector: 'Distribuidor', sortable: true, center: true, wrap: true },
                { name: 'Cliente', selector: 'Cliente', sortable: true, center: true, wrap: true },
                { name: 'Persona Registra', selector: 'PersonaRegistra', sortable: true, center: true, wrap: true },
                {
                    name: 'Fecha Registra', selector: 'FechaRegistra', sortable: true, center: true, cell: (propss) => <span className="text-center">{moment(propss.FechaRegistra).utc().format("DD-MM-YYYY HH:mm:ss A")}</span>
                },
                { name: 'Persona Modifica', selector: 'PersonaModifica', center: true, sortable: true, cell: (propss) => <span className="text-center">{propss.PersonaModifica ?? 'SIN MODIFICAR'}</span> },
                {
                    name: 'Fecha Modifica', selector: 'FechaModifica', sortable: true, center: true,
                    cell: (propss) => <span className='text-center'>{propss.PersonaModifica == undefined ? "N/A" : moment(propss.FechaModifica).utc().format("DD-MM-YYYY HH:mm:ss A")}
                    </span>
                },
                {
                    name: "Estatus", //width: '150px',
                    selector: "Estatus",
                    sortable: false,
                    center: true,
                    width: '90px',
                    // cell: (props) => <span>{props.EstatusID}</span>,
                    cell: (props) =>
                        <>
                            <span data-tip data-for={`CreditoEsttTooltip${props.CodigoID}`}>
                                <FaCircle color={props.Color} title={props.color} />
                            </span>
                            <ReactTooltip
                                id={`CreditoEsttTooltip${props.CodigoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.EstatusNombre}
                            </ReactTooltip>
                        </>,
                },
                {
                    name: 'Acciones', sortable: false, center: true, width: '9%',
                    cell: (props) => <>{props.Estatus == 'P' && <>
                        <Tooltip title='Editar código'>
                            <button className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form, Mostrar: true,
                                        Datos: props,
                                        Id: props.CodigoID
                                    }
                                }))
                            }}>
                                <FaPencilAlt />
                            </button>
                        </Tooltip>
                        <Tooltip title='Cancelar código'>
                            <button className="asstext ms-2" type={"button"} onClick={() => {
                                console.log('Datos3', state.Datos)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form,
                                        Datos: props,
                                        Id: props.CodigoID
                                    }
                                }))
                                fnActivar(props.CodigoID)
                            }}>
                                <FaBan />
                            </button>
                        </Tooltip>

                    </>}</>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()

        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({
            ...s,
            DatosMostrar: FiltrarDatos(s.Datos, Columns, s.Filtro) // Asegúrate de usar `s.Filtro` en vez de `state.Filtro`
        }));
    }, [state.Datos, Columns]);


    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { SKU: 0, Descuento: 0, SucursalID: 0, DistribuidorID: 0, ClienteID: 0, Motivo: '' } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.CodigoID === item.CodigoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { SKU: 0, Descuento: 0, SucursalID: 0, DistribuidorID: 0, ClienteID: 0, Motivo: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Códigos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Código" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"CodigoID"}
                                        defaultSortField={"CodigoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin large={true} center={true} open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Código" : "Agregar Código"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                ProductoID={id_int} />
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoTiienditaCodigos)