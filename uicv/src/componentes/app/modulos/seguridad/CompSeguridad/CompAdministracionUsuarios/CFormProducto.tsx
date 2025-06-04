import React, { useRef, useState, useEffect } from "react";

import * as Yup from "yup";
import * as Funciones from "./Funciones";

import {
    CustomFieldText2,
    Spinner,
    ActionAsyncSelect,
} from "../../../../../global";
import { Formik, Form } from "formik";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import {
    Zonas,
    Productos,
    SucursalesFisicas,
    TabuladoresTipos,
} from "../../../../../selectores";

import AsyncSelect from "react-select/async";
import { iUI } from "../../../../../../interfaces/ui/iUI";

type CFormType = {
    oidc: IOidc;
    ui: iUI;
    Id?: number;
    item: any,
    initialValues: {
        Nombre: string;
        distribuidorIdMin: number;
        distribuidorIdMax: number;
        importeLimiteCreditoDefault: number;
        tabuladorTipoID: number;
        empresaId: number;
        ZonaID: number;
        ProductoID: number;
        SucursalFisicaID: number;
        ProductosIds: any;
        NombreCompleto: string;
        PersonaResponsableId: number;
    };
    fnCancelar(): any,

/*     fnCancelar(): any;
 *//*     optPersona: { value: number; label: string }[];
 *//*     fnGetPersona(PersonaID: number, NombreCompleto: string, isSucursal: boolean, callback: any): any;
 *//*   DatosPersona: any;
 */};

export const CFormProducto = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false);


    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize

            onSubmit={(values: any) => {
                // Set our form to a loading state
                setLoading(true);

                // Finish the callback
            }}

        >
            {({ values }) => (
                <Form>
                    <hr />
                    <Productos
                        oidc={props.oidc}
                        ui={props.ui}
                        ProductosIds={props.initialValues.ProductosIds}
                        disabled={loading}
                        name={"ProductosIds"}
                        valor={values.ProductoID}
                    />
                    {loading && <Spinner />}
                    {!loading && (
                        <div className="text-end">
                            <button
                                type="submit"
                                className="ms-2 btn btn-success waves-effect waves-light"
                            >
                                Ok
                            </button>

                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
};
