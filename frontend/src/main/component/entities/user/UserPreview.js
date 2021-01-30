import { Avatar } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../App'
import RandomAvatar  from "../shared/RandomAvatar";
const UserPreview = ({ entity }) => {
    const { user } = useAuth();
    const history = useHistory();
    const isCurrentUser = user?.id === entity.id;
    const handleClick = () => {
        if (isCurrentUser) {
            history.push(`/current`)
        } else {
            history.push(`/user/${entity.id}`)
        }
    }
    return (
        <Col xs="12" className="m-3" >
            <Row className="border rounded p-3 justify-content-center w-50 m-auto">
                <Col xs="2" onClick={() => handleClick()} style={{cursor: "pointer"}}>
                    <RandomAvatar letter={entity.fname[0]} />
                </Col>
                <Col xs="9">
                    <div onClick={() => handleClick()}  style={{cursor: "pointer"}} >
                        <span className="font-weight-bold">
                            {`${entity.fname} ${entity.lname}`}
                        </span>
                        {isCurrentUser && "  (Bạn)"}
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