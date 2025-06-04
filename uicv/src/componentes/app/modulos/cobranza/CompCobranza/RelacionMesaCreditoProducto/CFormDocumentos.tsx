import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Formik, Form } from 'formik'
import ReactTooltip from 'react-tooltip'

import * as Funciones from '../RelacionMesaCreditoProducto/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../../global/functions'
import { CFormVerDocumento } from '../RelacionMesaCreditoProducto/CFormVerDocumento'
import { Console } from 'console'



type CatalogosType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    optGestor: { value: number, label: string }[]
    Prueba: number
}

export const CFormDocumentos = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { PersonasDocID: 0, PersonaID: 0, TiposDocumentoID: 0, RutaDoc: '', Fecha: '', Activo: false, NomDoc: '', PersonaIDRegistro: 0, UsuarioIDRegistro: 0, Clave: '' }
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
        Funciones.FNGetDocumentos(props.oidc, props.initialValues.DistribuidorID)
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'id',
                    selector: 'PersonasDocID',
                    sortable: true,
                },
                {
                    name: 'NomDoc',
                    selector: 'NomDoc',
                    sortable: true,
                },

                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    width: '10%',
                    center: true,
                    cell: (props) =>
                        <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },

                {
                    name: 'Ver Expediente',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        props.PersonasDocID > 0 ? <><button data-tip data-for={`btnCV_${props.NomDoc}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-secondary" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { PersonasDocID: props.PersonasDocID, PersonaID: props.PersonaID, TiposDocumentoID: props.TiposDocumentoID, RutaDoc: props.RutaDoc, Fecha: props.Fecha, Activo: props.Activo, NomDoc: props.NomDoc, PersonaIDRegistro: props.PersonaIDRegistro, UsuarioIDRegistro: props.UsuarioIDRegistro, Clave: props.Clave },
                                    Id: props.PersonasDocID,
                                }
                            }))
                        }}>
                            VER
                        </button>
                            <ReactTooltip id={`btnCV_${props.NomDoc}`} type="info" effect="solid">
                                VER DOCUMENTO {props.NomDoc}
                            </ReactTooltip></> : <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                Pendiente
                            </span>
                        </div>
                },
            ]
        return colRet
    }, [])

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
    }, [props.initialValues.DistribuidorID])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: s.Datos }))
        // eslint-disable-next-line
    }, [state.Datos])

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <Formik
            initialValues={{}}
            onSubmit={() => {
            }}>
            <Form >
                <div className="text-end">
                    <Card>
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
                                                            {/* <input type="text" className="form-control" placeholder="Buscar Clasificador" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                            <button className="btn btn-outline-secondary" type="button"
                                                onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                            ><FaPlus /></button>*/}
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
                                            keyField={"PersonasDocID"}
                                            defaultSortField={"PersonasDocID"}
                                            columns={Columns}
                                        />

                                        <ModalWin open={state.Form.Mostrar} center xlarge>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>EXPEDIENTES </h5>
                                                <button type="button" className="delete" onClick={fnCancelar}></button>
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                {<CFormVerDocumento
                                                    oidc={props.oidc}
                                                    initialValues={state.Form.Datos}
                                                    Id={state.Form.Id}
                                                />}
                                            </ModalWin.Body>
                                        </ModalWin>
                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>

            </Form>
        </Formik>
    )
}

