import { Avatar } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const UserPreview = ({ entity }) => {
    console.log(entity, 'entity');
    const history = useHistory();
    return (
        <Col xs="12" className="m-3" onClick={() => history.push(`/user/${entity.id}`)}>
            <Row className="border rounded p-3 justify-content-center w-50 m-auto">
                <Col xs="2">
                    <Avatar>{entity.fname[0]}</Avatar>
                </Col>
                <Col xs="9">
                    <div className="font-weight-bold">
                        {`${entity.fname} ${entity.lname}`}
                    </div>
                    <div>
                        {entity.email}
                    </div>
                    <small>
                        {entity.phone}
                    </small>
                </Col>
            </Row>
        </Col>
    )
}

export default UserPreview;