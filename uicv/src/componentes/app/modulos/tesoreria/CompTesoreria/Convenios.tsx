import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomFieldText, ModalWin } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import { Form, Formik } from 'formik';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import { FaPencilAlt } from 'react-icons/fa';
import yup from '../../../../../global/yupLocale';
import * as Funciones from './Referencias/Funciones'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin';
import { FiRefreshCcw } from 'react-icons/fi';

type ConveniosType = {
    oidc: IOidc,
    ui: iUI
}

function Convenios(props: ConveniosType) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const fnGetConvenios = () => {
        setLoading(true)
        Funciones.FNGetConvenios(props.oidc)
            .then((respuesta: any) => setData(respuesta))
            .catch(() => toast.error("Error al obtener los convenios"))
            .finally(() => setLoading(false))
    }

    const fnEditConvenios = () => {
        setLoading(true);
    }

    useEffect(() => {
        fnGetConvenios();
    }, [])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Convenios">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={{ CodigoConvenio: "", NombreConvenio: "", Usuario: '', Contrasena: '' }}
                                validationSchema={yup.object().shape({
                                    CodigoConvenio: yup.string().min(6).max(9),
                                    NombreConvenio: yup.string().required("Campo obligatorio"),
                                    Usuario: yup.string().required("Campo obligatorio"),
                                    Contrasena: yup.string().required("Campo obligatorio")
                                })}
                                onSubmit={(values: { CodigoConvenio: string, NombreConvenio: string, Usuario: string, Contrasena: string }, { resetForm }) => {
                                    setLoading(true)
                                    Funciones.FNAddConvenios(props.oidc, {
                                        CodigoConvenio: values.CodigoConvenio,
                                        NombreConvenio: values.NombreConvenio,
                                        Usuario: values.Usuario,
                                        Contrasena: values.Contrasena
                                    })
                                        .then((respuesta: any) => {
                                            setData(respuesta)
                                            resetForm();
                                        })
                                        .catch(() => toast.error("Error al dar de alta el convenio, intente mas tarde"))
                                        .finally(() => setLoading(false))
                                }}
                            >
                                <Form>
                                    <div className='columns is-desktop'>
                                        <div className="column is-5-desktop">
                                            <CustomFieldText
                                                disabled={loading}
                                                label='Numero convenio'
                                                name='CodigoConvenio'
                                            />
                                        </div>
                                        <div className="column is-5-desktop">
                                            <CustomFieldText
                                                disabled={loading}
                                                label='Nombre del convenio'
                                                name='NombreConvenio'
                                            />
                                        </div>
                                        <div className="column is-2-desktop" style={{ marginTop: 12 }}>
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => {
                                                fnGetConvenios();
                                                if (data.length > 0) toast.success("Datos obtenidos correctamente")
                                                else toast.error("Error al obtener la informacion")
                                            }}>
                                                <FiRefreshCcw />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='columns is-desktop'>
                                        <div className="column is-5-desktop">
                                            <CustomFieldText
                                                disabled={loading}
                                                label='Usuario'
                                                name='Usuario'
                                            />
                                        </div>
                                        <div className="column is-5-desktop">
                                            <CustomFieldText
                                                disabled={loading}
                                                label='Contrasena'
                                                name='Contrasena'
                                                password
                                            />
                                        </div>
                                        <div className="column is-2-desktop" style={{ marginTop: 12 }}>
                                            <button disabled={loading} type="submit" className='button is-success'>Guardar</button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>

                            <DataTable
                                keyField='ConvenioID '
                                data={data}
                                columns={[
                                    { name: "ID", selector: "ConvenioID", center: true, width: '10%' },
                                    { name: "Codigo del convenio", selector: "CodigoConvenio", center: true },
                                    { name: "Nombre del convenio", selector: "NombreConvenio", center: true },
                                    { name: "Usuario", selector: "Usuario", center: true }
                                ]}
                                pagination
                                noDataComponent={<p>No hay datos para mostrar</p>}
                            />
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

export default connect(mapStateToProps, {})(Convenios)