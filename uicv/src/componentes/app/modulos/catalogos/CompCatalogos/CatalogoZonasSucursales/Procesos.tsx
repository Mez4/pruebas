import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './../CatalogoZonasSucursales/Funciones'

// Icons
import { FaChevronRight, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip'
// import { CForm } from '../../CatalogoEmpresasExperiencia/CForm'
import { CForm } from '../CatalogoZonasSucursales/CForm'

type CatalogosType = {
    oidc: IOidc
    MensajeID: number
    MensajeName: string
    fnSelectProceso(procesoID: number, procesoName: string): any
    ProcesoActive: number
}

const Procesos = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { MensajeID: 0, SucursalID: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optSucursales: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        optSucursales,
        Cargando: true,
        Error: false,
        Mostrar: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetStatusByMensaje(props.oidc, props.MensajeID)
            .then((respuesta: any) => {
                console.log("XXX", respuesta);
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch((error) => {
                console.log("###e", error)
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const FnGetSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetAux(props.oidc)
            .then((respuesta: any) => {
                let tabla: any[] = respuesta.filter(x => x.ZonaID !== props.MensajeID)
                var sucursales = tabla.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }

    const cbProceso = async (Checked: boolean, procesoID: number, item: any) => {
        console.log("OK", Checked)
        let check: number = Checked ? 1 : 0
        Funciones.FNUpdateCheckProceso(props.oidc, props.MensajeID, procesoID, check)
        await timeout(300);
        if (item.Descripcion.includes('DOCUMENTOS')) {
            setState({ ...state, Datos: state.Datos.map(Dato => Dato.SucursalID === procesoID ? { ...item, selected: true, MensajeID: Checked ? props.MensajeID : null } : { ...Dato, selected: false }) })
            props.fnSelectProceso(procesoID, item.Descripcion);
        } else {
            setState({ ...state, Datos: state.Datos.map(Dato => Dato.SucursalID === procesoID ? { ...item, MensajeID: Checked ? props.MensajeID : null } : Dato) })
        }
        //SelectProceso(procesoID, item)
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const SelectProceso = async (procesoID: number, item: any) => {
        setState({ ...state, DatosMostrar: state.Datos.map(Dato => Dato.SucursalID === item.SucursalID ? { ...item, selected: true } : { ...Dato, selected: false }) })
        props.fnSelectProceso(procesoID, item.Descripcion);
        await timeout(300);
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: '',
                    selector: 'SucursalID',
                    width: '15%',
                    cell: (props) =>
                        <div className="form-check form-switch form-switch-md mb-3" >
                            <input type="checkbox" disabled={false} className="form-check-input" defaultChecked={props.MensajeID !== null ? true : false} onChange={e => cbProceso(e.target.checked, props.SucursalID, props)} />
                        </div>,
                    conditionalCellStyles: [
                        {
                            when: row => row.selected == true,
                            style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                        },
                    ]
                },
                {
                    name: 'Sucursal',
                    selector: 'Nombre',
                    width: '70%',
                    cell: (props) =>
                        <>
                            <label data-tip data-for={`AX_${props.SucursalID}`} className="LabelInDTable">
                                {props.Descripcion}
                            </label>
                            <ReactTooltip id={`AX_${props.SucursalID}`} type="info" effect="solid">
                                {props.Descripcion}
                            </ReactTooltip>
                        </>,
                    conditionalCellStyles: [
                        {
                            when: row => row.selected == true,
                            style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                        },
                    ]
                },
                {
                    name: '',
                    selector: 'SucursalID',
                    width: '10%',
                    cell: (props) =>
                        <>
                            {props.Descripcion.includes('DOCUMENTOS') && <button className="asstext" type={"button"} onClick={() => { SelectProceso(props.SucursalID, props) }}>
                                <FaChevronRight color={props.selected == true ? 'black' : 'gray'} />
                            </button>}
                        </>,
                    conditionalCellStyles: [
                        {
                            when: row => row.selected == true,
                            style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                        },
                    ]
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetSucursales()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.MensajeID])

    // On use effect
    React.useEffect(() => {
        console.log('UE')
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    React.useEffect(() => {
        console.log('ProcesoActive', props.ProcesoActive)
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.SucursalID === props.ProcesoActive ? { ...Dato, MensajeID: props.MensajeID, selected: true } : { ...Dato, selected: false }) })
    }, [props.ProcesoActive])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Mostrar: false, Form: { ...state.Form, Mostrar: false, Datos: { MensajeID: 0, SucursalID: 0 } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.EmpresaExperienciaID === item.EmpresaExperienciaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { MensajeID: 0, SucursalID: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Mostrar: false  })

    if (props.MensajeID === 0)
        return <div>
            <Card>
                <Card.Body>
                    <Card.Body.Content>
                        <span></span>
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div>

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div className="col-sm-12">
                                    <div className="col-sm-12" style={{ padding: '5px', backgroundColor: '#e0e0e0' }}>
                                        <label className="LabelInDTable">
                                            SUCURSALES ZONA {props.MensajeName}
                                        </label>
                                    </div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12" style={{ padding: '0px' }}>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" placeholder="Buscar Sucursal" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-success" style={{ textAlign: 'center' }} type="button" onClick={() => setState(e => ({ ...e, Mostrar: true }))}>AGREGAR SUCURSAL</button>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                         onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                     ><FaPlus /></button>
                                                     <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        //pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SucursalID"}
                                        //defaultSortField={"MensajeID"}
                                        columns={[
                                            {
                                                name: 'SucursalID',
                                                selector: 'SucursalID',
                                                width: '17%',
                                                cell: (props) =>
                                                    <label data-tip data-for={`AX_${props.SucursalID}`} className="LabelInDTable">
                                                        {props.SucursalID}
                                                    </label>,
                                                conditionalCellStyles: [
                                                    {
                                                        when: row => row.selected == true,
                                                        style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                                                    },
                                                ]
                                            },
                                            {
                                                name: 'Sucursal',
                                                selector: 'Nombre',
                                                width: '70%',
                                                cell: (props) =>
                                                    <>
                                                        <label data-tip data-for={`AX_${props.SucursalID}`} className="LabelInDTable">
                                                            {props.Nombre}
                                                        </label>
                                                        <ReactTooltip id={`AX_${props.SucursalID}`} type="info" effect="solid">
                                                            {props.Nombre}
                                                        </ReactTooltip>
                                                    </>,
                                                conditionalCellStyles: [
                                                    {
                                                        when: row => row.selected == true,
                                                        style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                                                    },
                                                ]
                                            },
                                            // {
                                            //     name: '',
                                            //     selector: 'SucursalID',
                                            //     width: '10%',
                                            //     cell: (props) =>
                                            //         <>
                                            //             {props.Descripcion.includes('DOCUMENTOS') && <button className="asstext" type={"button"} onClick={() => { SelectProceso(props.SucursalID, props) }}>
                                            //                 <FaChevronRight color={props.selected == true ? 'black' : 'gray'} />
                                            //             </button>}
                                            //         </>,
                                            //     conditionalCellStyles: [
                                            //         {
                                            //             when: row => row.selected == true,
                                            //             style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                                            //         },
                                            //     ]
                                            // },
                                        ]}
                                    />
                                    {state.Mostrar && <ModalWin open={state.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Sucursal a ZONA {props.MensajeName}</h5>
                                            <button type="button" className="delete" onClick={() => { setState(e => ({ ...e, Mostrar: false })) }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={{ ZonaID: 0, Nombre: '' }}
                                                Id={props.MensajeID}
                                                optSucursales={state.optSucursales}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>}
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
export default connect(mapStateToProps, mapDispatchToProps)(Procesos);