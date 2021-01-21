import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import Axios from '../../../api/Axios';
import { ToastError } from '../../entities/shared/Toast'
// import {useAuth} from "../../../../App";
import PostDetail from '../post/PostDetail';


const Comment = (props) => {
    const {entity, isShort, clickDisplayPost} = props;
    const [postEntity, setPostEntity] = useState(null);

    const getPostById = async () => {
        try {
            const res = await Axios.get(`/posts/detail/${entity.post_id}`);
            if (res.status === 200) {
                setPostEntity(res.data.data);
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [postDetailModal, setPostDetailModal] = useState(false);
    const toggleDetailModal = () => setPostDetailModal(!postDetailModal);
    const detailModalVisible = () => {
        getPostById(entity.post_id);
        setPostDetailModal(!postDetailModal);
    };    

    return (
        <Row className="mt-3 p-3" 
            onClick={() => clickDisplayPost &&  detailModalVisible()}
        
        > 
            <Col xs="2" >
                <div >
                    <Avatar>T</Avatar>
                </div>
            </Col>
            <Col xs="10">
                <p className= "font-weight-bold m-0" >
                    {`${entity?.user.fname} ${entity?.user.lname}`}
                </p>
                <small className="font-italic ">

                {moment(entity?.created_at).format('DD/M/YYYY, h:mm')}
                </small>
            </Col>
            <Col xs="10" className=" ml-auto mt-3">
                <p className={isShort ? "ellipsisText" : ""}>
                    {entity?.content}
                </p>
            </Col>
            <PostDetail
                post={postEntity}
                modal={postDetailModal}
                toggle={() => toggleDetailModal()}
            />
        </Row>
    );
}

export default Comment;