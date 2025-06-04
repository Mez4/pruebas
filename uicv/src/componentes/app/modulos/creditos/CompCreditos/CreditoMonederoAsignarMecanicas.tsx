import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomSelect, ModalWin, Spinner } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { FiRefreshCcw } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin';
import * as Funciones from './CreditoMonederoAsignarMecanicas/Funciones'
import { Zonas } from '../../../../selectores';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import yup from '../../../../../global/yupLocale';

type CreditoMonederoAsignarMecanicasType = {
    oidc: IOidc,
    ui: iUI
}

function CreditoMonederoAsignarMecanicas(props: CreditoMonederoAsignarMecanicasType) {
    let params = useParams<{ productoId: string }>();
    const [state, setState] = useState({ showModal: false, loading: false, isUpdate: false, datos: [], datosEditar: { ID: 0, Mecanica: 0, DistribuidorNivelId: 0, ZonaID: 0 } })
    const [mecanicas, setMecanicas] = useState([{ label: "", value: 0 }])

    const Columns = useMemo(() => {
        const DetailColumns: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    width: "90px",
                    selector: 'ID',
                    center: true,
                    sortable: true,
                },
                {
                    name: 'Mecanica',
                    selector: 'Descripcion',
                    center: true,
                    sortable: true
                },
                {
                    name: 'Zona',
                    selector: 'Zona',
                    center: true,
                    sortable: true
                },
                {
                    name: 'Nivel de distriuidor',
                    selector: 'DistribuidorNivel',
                    center: true,
                    sortable: true
                },
                {
                    name: 'Acciones',
                    center: true,
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            console.log(props);
                            setState(s => ({
                                ...s,
                                showModal: true,
                                datosEditar: {
                                    ID: props.ID,
                                    Mecanica: props.MecanicaID,
                                    DistribuidorNivelId: props.DistribuidorNivelID,
                                    ZonaID: props.ZonaID
                                },
                                isUpdate: true
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                }
            ]
        return DetailColumns;
    }, [])


    function fnGetMecanicasAsignadas() {
        setState(s => ({ ...s, showModal: false, loading: true }))
        Funciones.FNGetMecanicasAsignadas(props.oidc, { ProductoID: parseInt(params.productoId) })
            .then((respuesta: any) => setState(s => ({ ...s, datos: respuesta.data, loading: false, showModal: false, isUpdate: false })))
            .catch(() => {
                toast.error("Error al obtener los datos");
                setState(s => ({ ...s, datos: [], loading: false, showModal: false, isUpdate: false }));
            });
    }

    function fnGetMecanicas() {
        Funciones.FNGetMecanicasActivas(props.oidc)
            .then((respuesta: any) => {
                const aux: { label: "", value: 0 }[] = [];

                respuesta.data.map((element) => {
                    aux.push({ label: element.Descripcion, value: element.MecanicaID })
                });
                setMecanicas(aux);
            })
            .catch((error) => console.log("[error]", error))
    }

    useEffect(() => {
        fnGetMecanicas();
    }, [])

    useEffect(() => {
        fnGetMecanicasAsignadas();
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Asignar mecanicas">
                        <Card.Body>
                            <Card.Body.Content>
                                <DataTable
                                    subHeader
                                    subHeaderComponent=
                                    {
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3">
                                                    <button disabled={state.loading} className="btn btn-outline-secondary" type="button" onClick={() => setState(s => ({ ...s, showModal: true }))}><FaPlus /></button>
                                                    <button disabled={state.loading} className="btn btn-outline-secondary" type="button" onClick={() => fnGetMecanicasAsignadas()}><FiRefreshCcw /></button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    progressPending={state.loading}
                                    progressComponent={<Spinner />}
                                    columns={Columns}
                                    data={state.datos}
                                    responsive
                                    pagination
                                />

                                <ModalWin open={state.showModal} large center>
                                    <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>
                                            Agregar en el catálogo
                                        </h5>
                                        <button title='Cerrar' type="button" className="delete" onClick={() => {
                                            setState(s => ({ ...s, showModal: false, isUpdate: false }))
                                        }} />
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        <Formik
                                            initialValues={state.isUpdate ? state.datosEditar : { ID: 0, Mecanica: 0, DistribuidorNivelId: 0, ZonaID: 0 }}
                                            enableReinitialize
                                            validationSchema={yup.object().shape({
                                                Mecanica: yup.number().moreThan(0, "Elige una mecanica"),
                                                DistribuidorNivelId: yup.number().moreThan(0, "Elige un nivel del distribuidor"),
                                                ZonaID: yup.number().moreThan(0, "Elige una zona")
                                            })}
                                            onSubmit={(values: any) => {
                                                const { ID, Mecanica, DistribuidorNivelId, ZonaID } = values;
                                                if (state.isUpdate) {
                                                    Funciones.FNEditarMecanica(props.oidc, {
                                                        ID,
                                                        MecanicaID: Mecanica,
                                                        DistribuidorNivelId,
                                                        ZonaID,
                                                        ProductoID: parseInt(params.productoId)
                                                    }).then((respuesta: any) => {
                                                        if (respuesta.data.code == 204) {
                                                            toast.warning(respuesta.data.msg);
                                                            return;
                                                        }
                                                        toast.success("Se actualizo la mecanica correctamente");
                                                        fnGetMecanicasAsignadas();
                                                    }).catch(() => {
                                                        toast.error("Ocurrio un error al actualizar la mecanica");
                                                    })
                                                    return;
                                                }

                                                Funciones.FNAsignarMecanica(props.oidc, {
                                                    MecanicaID: Mecanica,
                                                    DistribuidorNivelId,
                                                    ZonaID,
                                                    ProductoID: parseInt(params.productoId)
                                                }).then((respuesta: any) => {
                                                    if (respuesta.data.code == 204) {
                                                        toast.warning(respuesta.data.msg);
                                                        return;
                                                    }
                                                    toast.success("Se asigno la mecanica correctamente");
                                                    fnGetMecanicasAsignadas();
                                                }).catch(() => {
                                                    toast.error("No se pudo asignar la mecanica, intentelo de nuevo");
                                                })
                                            }}>
                                            <Form>
                                                <div className="columns is-desktop">
                                                    <div className="column is-4-desktop">
                                                        <CustomSelect
                                                            disabled={state.loading}
                                                            label={'Mecanicas'}
                                                            name="Mecanica"
                                                            placeholder={'Seleccione la mecanica'}
                                                            options={mecanicas}
                                                            addDefault={false}
                                                        />
                                                    </div>
                                                    <div className="column is-4-desktop">
                                                        {!state.loading && <Zonas name='ZonaID' isProducto oidc={props.oidc} cargar />}
                                                    </div>
                                                    <div className="column is-4-desktop">
                                                        <CustomSelect
                                                            disabled={state.loading}
                                                            label={`Nivel de socia`}
                                                            name="DistribuidorNivelId"
                                                            placeholder={'Seleccione el Nivel de socia'}
                                                            options={
                                                                [
                                                                    { label: "N/A", value: 0 },
                                                                    { label: "BRONCE", value: 1 },
                                                                    { label: "PLATA", value: 2 },
                                                                    { label: "ORO", value: 3 },
                                                                    { label: "DIAMANTE", value: 4 },
                                                                    { label: "PLATINO", value: 5 },
                                                                ]
                                                            }
                                                            addDefault={false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <button
                                                        className='btn btn-danger mr-2'
                                                        type="button"
                                                        onClick={() => setState(s => ({ ...s, showModal: false, isUpdate: false }))}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        className='btn btn-success'
                                                        type="submit"
                                                    >
                                                        {state.isUpdate ? 'Editar' : 'Agregar'}
                                                    </button>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </ModalWin.Body>
                                </ModalWin>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoMonederoAsignarMecanicas)