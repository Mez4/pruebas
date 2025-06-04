import { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { ActionAsyncSelect, ActionSelect, Card } from "../../../../../global";
import yup from "../../../../../../global/yupLocale";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { FNVincularSociaCliente } from "../../../distribuidor/CompDistribuidor/Cliente/Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";

type VincularSociaClienteType = {
    oidc: IOidc,
    optDistribuidores: { value: number, label: string }[],
    optClientes: { value: number, label: string }[],
    fnGetClientes(DistribuidorID: number, Nombre: string, callback: any): any,
    fnGetDatosCliente(id: any): any,
    onSubmitVincular(): any
}

type ResponseType = { msg: string, Regresa: number };

export default function VincularSociaCliente(props: VincularSociaClienteType) {
    const refDistribuidor = useRef<Select>(null);
    const refCliente = useRef<AsyncSelect<[], false>>(null);
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Body.Content>
                        <Formik
                            initialValues={{ ClienteID: 0, DistribuidorId: 0 }}
                            onSubmit={(values) => {
                                FNVincularSociaCliente(props.oidc, { ClienteID: values.ClienteID, DistribuidorID: values.DistribuidorId })
                                    .then((res: ResponseType) => { // Tipo correcto aquí
                                        if (res.Regresa === 1) {
                                            console.log(res, 'FNVincularSociaCliente');
                                            toast.success(res.msg);
                                            props.onSubmitVincular();
                                        } else {
                                            toast.warning(res.msg);
                                        }
                                    })
                                    .catch((e) => {
                                        console.log(e, 'FNVincularSociaCliente');
                                        toast.error("Hubo un error en la reasignacion");
                                    });
                            }}
                            validationSchema={yup.object().shape({
                                DistribuidorId: yup.number().required('Seleccione la socia').moreThan(0, 'Seleccione la socia'),
                                ClienteID: yup.number().required("Seleccione el cliente").moreThan(0, 'Seleccione el cliente')
                            })}
                        >
                            {({ values }) =>
                                <Form>
                                    <ActionSelect
                                        disabled={loading}
                                        label={"Socia"}
                                        name="DistribuidorId"
                                        placeholder={`Seleccione la Socia`}
                                        options={props.optDistribuidores}
                                        addDefault={true}
                                        valor={values.DistribuidorId}
                                        accion={() => { /*cbDistribuidor*/ }}
                                        ref={refDistribuidor}
                                    />
                                    <ActionAsyncSelect
                                        loadOptions={(inputText: string, callback: any) => {
                                            const distribuidor: any = refDistribuidor;
                                            const DistribuidorID = distribuidor.current.props.value.value as number;
                                            setLoading(true);
                                            props.fnGetClientes(DistribuidorID, inputText, callback);
                                            setLoading(false);
                                        }}
                                        disabled={loading}
                                        label="Cliente"
                                        name="ClienteID"
                                        placeholder="Buscar cliente"
                                        options={props.optClientes}
                                        addDefault={false}
                                        valor={values.ClienteID}
                                        accion={props.fnGetDatosCliente}
                                        noOptionsMessage={'Escriba el nombre del cliente'}
                                        ref={refCliente}
                                    />

                                    <div className='text-end'>
                                        <button type={'button'} onClick={props.onSubmitVincular} className='btn btn-danger text-white fw-bold text-end me-1'>Cancelar</button>
                                        <button type={'submit'} className='btn btn-confia text-white fw-bold text-end'>Vincular</button>
                                    </div>
                                </Form>
                            }
                        </Formik>
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div>
    );
}