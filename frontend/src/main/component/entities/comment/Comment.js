import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import Axios from '../../../api/Axios';
import { ToastError } from '../../entities/shared/Toast'
import { useAuth } from "../../../../App";
import PostDetail from '../post/PostDetail';
import DeleteModal from '../shared/DeleteModal';
import { useHistory } from 'react-router-dom';
import RandomAvatar from "./../shared/RandomAvatar";


const Comment = (props) => {
    const { entity, isShort, clickDisplayPost } = props;
    const [postEntity, setPostEntity] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const { user } = useAuth();
    const history = useHistory();

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
        getPostById();
        setPostDetailModal(!postDetailModal);
    };
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const deleteModalVisible = () => {
        setDeleteModal(!deleteModal);
    };

    const handleDeleteComment = async () => {
        try {
            const res = await Axios.delete(`/comments/delete/${entity?.id}`);
            if (res.status === 200) {
                setDeleteModal(false);
                getPostById();
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRedirect = inputId => {
        if (inputId === user.id) {
            history.push('/current');
        } else {
            history.push(`/user/${inputId}`);
        }
    }


    return (
        <Row className="mt-3 p-3"
            onClick={() => clickDisplayPost && detailModalVisible()}
        >
            <DeleteModal
                toggle={toggleDeleteModal}
                modal={deleteModal}
                prompt="Xác nhận xoá bình luận này?"
                handleComfirm={handleDeleteComment}
            />
            <Col xs="12" className={entity?.user_id === user?.id ? "d-flex" : "d-none"}>
                <Button color="danger"
                 onClick={() => deleteModalVisible()} 
                className="ml-auto"                 >
                    Xoá
                </Button>
            </Col>
            <Col xs="2" >
                <div >
                    <RandomAvatar letter={entity?.user.fname[0]}/>
                </div>
            </Col>
            <Col xs="10">
                <p className="font-weight-bold m-0" onClick={() => handleRedirect(entity?.user.id)} >
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