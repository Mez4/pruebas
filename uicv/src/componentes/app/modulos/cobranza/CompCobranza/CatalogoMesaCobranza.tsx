import React, { useEffect, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import * as Funciones from './CatalogoMesaCobranza/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoMesaCobranza/CForm'


type CatalogosType = {
    oidc: IOidc
}

const CatalogoMesaCobranza = (props: CatalogosType) => {

    const [Director, setDirector] = useState(false);
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { MesaCobranzaID: 0, Nombre: '', Clave: '', Activo: false }
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



    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const validarDirector = () => {
        setState(s => ({...s, Cargando:true}));
        Funciones.FNValidacion(props.oidc)
            .then((respuesta:any) => {
                console.log("Esta es la respuesta: ", respuesta);
                setDirector(true);
                setState(s => ({...s, Cargando:false}));

            })
            .catch(() => {
                console.log("Fallo")
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })

    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'id',
                    selector: 'MesaCobranzaID',
                    sortable: true,
                },
                {
                    name: 'Nombre',
                    selector: 'Nombre',
                    sortable: true,
                },
                {
                    name: 'Clave',
                    selector: 'Clave',
                    sortable: true,
                    center: true,
                },

                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    center: true,
                    cell: (props) =>
                        <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    center: true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { MesaCobranzaID: props.MesaCobranzaID, Nombre: props.Nombre, Clave: props.Clave, Activo: props.Activo },
                                    Id: props.MesaCobranzaID
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

    useEffect(() => { validarDirector(); return() => {isMounted.current == false;}}, [props.oidc])
    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { MesaCobranzaID: 0, Nombre: '', Clave: '', Activo: false } } })
    }

    // /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.MesaCobranzaID === item.MesaCobranzaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { MesaCobranzaID: 0, Nombre: '', Clave: '', Activo: false } } })

    // /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="MESAS DE COBRANZA">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Mesa" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {
                                                        Director && <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                        }

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
                                        keyField={"MesaCobranzaID"}
                                        defaultSortField={"MesaCobranzaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>EDITAR MESA DE COBRANZA</h5>
                                            {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                // initialValues={state.Form.Datos}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMesaCobranza);
