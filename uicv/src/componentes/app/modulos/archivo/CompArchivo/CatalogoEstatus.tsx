import React, { Component } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoEstatus/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoEstatus/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoEstatus = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { NombreEstatus: '', Clave: '', Color: '', Descripcion: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const conditionalRowStyles: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        conditionalRowStyles,
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

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta, 'respestatus')
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'EstatusID',
                    sortable: true,
                    width: '10%',
                },
                {
                    name: 'Clave',
                    selector: 'Clave',
                    sortable: true,
                    width: '10%',
                    // cell: (props) =>
                    //     <div>
                    //         <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: props.Color }}></div>
                    //     </div>
                },
                {
                    name: '',
                    selector: 'Color',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div>
                            <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: props.Color }}></div>
                        </div>
                },
                {
                    name: 'Estatus',
                    selector: 'NombreEstatus',
                    sortable: true,
                    cell: (props) =>
                        <div>
                            <label style={{ color: props.Color, marginBottom: '0px' }}>
                                {props.NombreEstatus}
                            </label>
                        </div>
                },
                {
                    name: 'Descripcion',
                    selector: 'Descripcion',
                    sortable: true,
                    width: '50%',
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { NombreEstatus: props.NombreEstatus, Clave: props.Clave, Color: props.Color, Descripcion: props.Descripcion },
                                    Id: props.EstatusID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        let rulesConditionColors: any[] = [];
        state.Datos.forEach((element: any) => {
            rulesConditionColors.push(
                {
                    when: (row: { EstatusID: number }) => row.EstatusID === element.EstatusID,
                    style: { backgroundColor: element.Color }
                },
            )
        });

        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro), conditionalRowStyles: rulesConditionColors }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { NombreEstatus: '', Clave: '', Color: '', Descripcion: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.EstatusID === item.EstatusID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { NombreEstatus: '', Clave: '', Color: '', Descripcion: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Estatus">
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
                                                        <input type="text" className="form-control" placeholder="Buscar estatus" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        //pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"EstatusID"}
                                        defaultSortField={"EstatusID"}
                                        columns={Columns}
                                    //conditionalRowStyles={state.conditionalRowStyles}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Estatus de Tracking de Valera</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoEstatus);