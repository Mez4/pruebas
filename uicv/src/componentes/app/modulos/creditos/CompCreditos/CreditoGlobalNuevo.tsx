import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card } from "../../../../global";
import FormDistPagoVencimiento from "./CreditoCierreValesDistVencimiento2/FormDistPagoVencimiento";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import moment from "moment";
import React, { useEffect, useState } from "react"; // Asegúrate de importar useState y useEffect
import * as Funciones from "./CreditoDistPagosVencimiento/Funciones";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// Definición de tipos
type CreditoCierreValesDistVencimientoType = {
    oidc: IOidc;
    ui: iUI;
};

function CreditoGlobalNuevo(
    props: CreditoCierreValesDistVencimientoType
) {
    const MySwal = withReactContent(Swal);
    let isMounted = React.useRef(true);
    const FechaCorte: Date | undefined = undefined;

    const [state, setState] = useState({
        FechaCorte: FechaCorte,
    });

    const [showContent, setShowContent] = useState(false);

    const FNGetUltimaActualizacion = () => {
        Funciones.FNGetFechaUltimaActualizacion(props.oidc)
            .then((respuesta: any) => {
                setState((s) => ({ ...s, FechaCorte: respuesta.FechaHoraRegistro }));
            })
            .catch(() => {
                setState((s) => ({ ...s, FechaCorte: undefined }));
            });
    };

    useEffect(() => {
        if (isMounted.current === true) {
            FNGetUltimaActualizacion();
        }

        return () => {
            isMounted.current = false;
        };
    }, []);


    useEffect(() => {
        const showModal = async () => {
            const result = await MySwal.fire({
                title: "<strong>AVISO</strong>",
                icon: "warning",
                html: (
                    <div className="text-center">
                        Este reporte incluye cambios importantes y su información se actualizará cada 30 minutos, por lo que no se reflejarán pagos en tiempo real. Las horas de última actualización se mostrarán en la parte superior derecha.
                    </div>
                ),
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                showLoaderOnConfirm: true,
                focusConfirm: false,
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
                confirmButtonColor: `#3085d6`,
            });

            if (result.isConfirmed) {
                setShowContent(true);
            } else {
                setShowContent(false);
            }
        };

        showModal();
    }, []);

    if (!showContent) {
        return null;
    }

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card
                        Title=""
                        TitleEnd={
                            <>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>Cierre vales x Distribuidor 1625 </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            whiteSpace: "nowrap",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ fontSize: "0.9rem", marginRight: "1rem", color: 'red' }}>
                                            Fecha/Hora Última Actualización:{" "}
                                            {!!state.FechaCorte
                                                ? moment(state.FechaCorte).utc().format("DD-MM-YYYY HH:mm:ss A")
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        }
                    >
                        <Card.Body>
                            <Card.Body.Content>
                                <FormDistPagoVencimiento oidc={props.oidc} ui={props.ui} />
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGlobalNuevo);
