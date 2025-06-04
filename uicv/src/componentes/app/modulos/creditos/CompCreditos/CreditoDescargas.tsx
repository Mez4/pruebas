import React, { useState, useMemo, useEffect } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, ModalWin, Spinner } from '../../../../global'
import { toast } from 'react-toastify'
import { FaPrint } from 'react-icons/fa'
import * as Funciones from './DescargasGenerales/Funciones'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

type CreditoDescargasType = {
    oidc: IOidc,
}

const CreditoDescargas = (props: CreditoDescargasType) => {
    const [state, setState] = useState({ Archivo: "", Datos: [], showModal: false, loading: false });

    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'ID',
                    sortable: false,
                    width: "5%"
                },
                {
                    name: 'Nombre',
                    selector: 'NombreDocumento',
                    sortable: false,
                    width: "85%",
                    cell: (props) =>
                        <span>{props.NombreDocumento}</span>
                },
                {
                    name: "Acciones",
                    sortable: false,
                    center: true,
                    width: "5%",
                    cell: (props) => (
                        <button
                            className="asstext"
                            type={"button"}
                            onClick={() => {
                                console.log(props);
                                setState(s => (
                                    {
                                        ...s,
                                        Archivo: props.Archivo,
                                        loading: false,
                                        showModal: true,
                                    }
                                ));
                            }}
                        >
                            <FaPrint />
                        </button>
                    ),
                }

            ]
        return colRet
    }, []);

    function getArchivos() {
        setState(s => ({ ...s, loading: true }));
        Funciones.GetDocs(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Datos: respuesta, loading: false }));
            })
            .catch(() => toast.error("Hubo un error al obtener los documentos"));
    }

    useEffect(() => {
        getArchivos();
    }, []);

    return (
        <>
            <Card Title="Descargas Generales">
                <Card.Body>
                    <Card.Body.Content>
                        <DataTable
                            dense
                            striped
                            noHeader
                            subHeader
                            responsive
                            pagination
                            data={state.Datos}
                            keyField={"ID"}
                            columns={Columns}
                            defaultSortField={"ID"}
                            progressPending={state.loading}
                            progressComponent={<Spinner />}
                        />
                    </Card.Body.Content>
                </Card.Body>
            </Card>
            <ModalWin open={state.showModal} full center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        <p>Previsualizaci&oacute;n de PDF - {state.Archivo}</p>
                    </h5>
                    <button type="button" className="delete" onClick={() => setState(s => ({ ...s, showModal: false }))} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {state.showModal && <object
                        data={require(`./DescargasGenerales/pdfs/${state.Archivo}.pdf`)}
                        type='application/pdf'
                        height={'100%'}
                        width={'100%'}
                    />}
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoDescargas);