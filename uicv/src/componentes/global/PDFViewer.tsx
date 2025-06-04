import React, { Component } from 'react'

type Props = {
    file: string;
};

class PDFViewer extends Component<Props> {

    componentDidMount(){
        if(typeof window.orientation !== "undefined"){
            document.getElementById('linkDownload')?.click();
            window.close();
        }
    }
    
    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%'}}>
                <object 
                    data={this.props.file} 
                    type="application/pdf"
                    width="700px"
                    height="100%"
                >
                    <br/>
                    <a href={this.props.file} id="linkDownload" download="Documento.pdf">
                        Tu dispositivo no puede visualizar los archivos PDF, da click aquí para descargarlo
                    </a>
                </object>
            </div>
        )
    }
}

export default PDFViewer;
