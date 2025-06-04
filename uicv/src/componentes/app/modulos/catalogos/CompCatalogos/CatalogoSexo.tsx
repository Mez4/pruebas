import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import * as Funciones from './CAtalogoSexo/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Custom components
import { Card } from '../../../../global'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoSexo = (props: CatalogosType) => {

    const DatosDefecto = { Sexo: '' }
    const Datos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })
    React.useEffect(() => {

        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta)
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(error => {
                console.log("Error: ", error)
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar tipos de documentos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <span>Cargando...</span>}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {state.Datos.length > 0 &&
                                <div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <DataTable
                                        data={state.Datos}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SexoID"}
                                        defaultSortField={"SexoID"}
                                        columns={[
                                            {
                                                name: 'Id',
                                                selector: 'SexoID',
                                                sortable: true,
                                            },
                                            {
                                                name: 'Sexo',
                                                selector: 'Sexo',
                                                sortable: true,
                                            },
                                            //{
                                            //    name: 'Acciones',
                                            //    sortable: false,
                                            //    cell: (props) =>
                                            //        <button className="asstext" type={"button"} onClick={() => {
                                            //            setState({
                                            //                ...state,
                                            //                Form: {
                                            //                    ...state.Form, Mostrar: true,
                                            //                    Datos: { activo: props.activo, claveDoc: props.claveDoc, documentosTipoNombre: props.documentosTipoNombre, ordenSistema: props.ordenSistema, soloIMG: props.soloIMG },
                                            //                    Id: props.documentosTipoId
                                            //                }
                                            //            })
                                            //        }}>
                                            //            <FaPencilAlt />
                                            //        </button>
                                            //},
                                        ]}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Tipo Documento</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {/*<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoSexo)
