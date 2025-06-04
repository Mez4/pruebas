import React from 'react'
import ReactDOM from 'react-dom'
export const MODAL_TITLE_CLASS = "modal-title mt-0"

type GenericType = {
    children: any,
    className?: string
    style?: object
}
const Header = (props: GenericType) => (
    <div className={`modal-header ${props.className}`}>
        {props.children}
    </div>
)
const Body = (props: GenericType) => (
    <div style={props.style ?? { overflowY: 'scroll' }} className={`modal-body mi_estilo ${props.className}`}>
        {props.children}
    </div>
)

const Footer = (props: GenericType) => (
    <div className={`modal-footer ${props.className}`}>
        {props.children}
    </div>
)

type ModalType = {
    open?: boolean,
    children: any,
    large?: boolean,
    xlarge?: boolean,
    full?: boolean,
    center?: boolean,
    scrollable?: boolean,
    className?: string,
    zIndex?: number,

}
const ModalWin = (props: ModalType) => {


    const modalStyle = props.open ? { backgroundColor: "rgba(38, 38, 38, 0.5)", display: "block", zIndex: props.zIndex ? props.zIndex : 1001 } : { display: "none" }
    const divModal: any = document.getElementById("dvModals")

    return ReactDOM.createPortal((<div className={`modal fade bs-example-modal-center ${props.open && "show"}`} tabIndex={-1} aria-labelledby="mySmallModalLabel" style={modalStyle} aria-modal="true" role="dialog">
        <div className={`modal-dialog ${props.scrollable && "modal-dialog-scrollable"} ${props.center && "modal-dialog-centered"} ${props.large && "modal-lg"} ${props.xlarge && "modal-xl"} ${props.full && "modal-fullscreen"}`}>
            <div className={`modal-content ${props.className ?? ""}`}>
                {props.children}
            </div>
        </div>
    </div>), divModal)


    // return (
    //     <div className={`modal fade bs-example-modal-center ${props.open && "show"}`} tabIndex={-1} aria-labelledby="mySmallModalLabel" style={modalStyle} aria-modal="true" role="dialog">
    //         <div className={`modal-dialog ${props.scrollable && "modal-dialog-scrollable"} ${props.center && "modal-dialog-centered"} ${props.large && "modal-lg"} ${props.xlarge && "modal-xl"} ${props.full && "modal-fullscreen"}`}>
    //             <div className={`modal-content ${props.className ?? ""}`}>
    //                 {props.children}
    //             </div>
    //         </div>
    //     </div>
    // )
}

ModalWin.Header = Header
ModalWin.Body = Body
ModalWin.Footer = Footer

export default ModalWin