import Card from "./Card"

const BodyTemplate = ({ title = '', children = <></> }) => (<>
    <div className="row">
        <div className="col-12">
            <Card Title={title}>
                <Card.Body>
                    <Card.Body.Content>
                        {children}
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div>
    </div>
</>)

export default BodyTemplate 