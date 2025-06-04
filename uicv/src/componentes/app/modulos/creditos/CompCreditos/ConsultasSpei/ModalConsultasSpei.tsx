import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import DataGridComp from "../../../../../global/DataGrid";

type CatalogosType = {
    oidc: IOidc,
    open: boolean,
    handleOpen(): any
    CreditosList: any[]
}


const ModalConsultasSpei = ({ CreditosList = [], ...props }: CatalogosType) => {
    return (<>
        <Dialog
            fullWidth={true}
            maxWidth={'lg'}
            open={props.open || false}
            onClose={() => props.handleOpen()}
        >
            <DialogTitle>Creditos vinculados</DialogTitle>
            <DialogContent>

                <DataGridComp
                    data={CreditosList}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.handleOpen()}>Cerrar</Button>
            </DialogActions>
        </Dialog >
    </>)
}

export default ModalConsultasSpei