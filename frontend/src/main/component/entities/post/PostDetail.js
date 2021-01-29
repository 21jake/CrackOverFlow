import React, { useEffect, useState } from 'react';
import Vote from '../vote/Vote'
import { Col, Row, Modal, Badge, Button } from 'reactstrap';
// import PostPreview from './PostPreview';
import CommentWrapper from '../comment/CommentWrapper'
import { returnValueOrEmpty } from '../shared/returnValueOrEmpty';
import moment from 'moment'; 
import { useAuth } from '../../../../App';
import DeleteModal from '../shared/DeleteModal';


import Axios from '../../../api/Axios';
import { ToastError } from '../shared/Toast'
// import { useEffect, useState, useRef } from 'react';


const PostDetail = (props) => {
    const { post } = props;
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const [deleteModal, setDeleteModal] = useState(false);


    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const deleteModalVisible = () => {
        setDeleteModal(!deleteModal);
    };

    

    useEffect(() => {
        if (post?.comments?.length) {
            setComments(post.comments)
        }
    }, [post?.comments])


    const handleDeletePost = async () => {
        try {
            const res = await Axios.delete(`/posts/delete/${post.id}`);
            if (res.status === 200) {
                // setPostEntity(res.data.data);
                setDeleteModal(false);
                props.toggle();
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }



    // console.log(post, 'post');
    return (
        <Modal className="m-3" isOpen={props.modal} toggle={() => props.toggle()} className="postDetailModal">
            <DeleteModal
                toggle={toggleDeleteModal}
                modal={deleteModal}
                prompt="Xác nhận xoá bài đăng này?"
                handleComfirm={handleDeletePost}
            />

            <Col xs="12" className="p-3">
                <Row>
                    <Col xs="2" className={post?.user_id === user?.id ? "ml-auto" : "d-none" }>
                        <Button color="danger" onClick={() => deleteModalVisible()}>
                            Xoá bài
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs="1" className="m-auto mt-3">
                        <Vote
                            totalVote={post?.post_votes}
                            postId={post?.id}
                        />
                    </Col>
                    <Col xs="11" className="mt-5">
                        <p className="font-weight-bold">
                            {post?.title}
                        </p>
                        <p >
                            {returnValueOrEmpty(post?.content)}
                        </p>
                    </Col>
                    <Col xs="11" className="ml-auto d-flex justify-content-between">
                        <Badge color="primary">Chủ đề 1</Badge>
                        <small className="font-italic ">
                            {moment(returnValueOrEmpty(post?.created_at)).format('DD/M/YYYY, h:mm')}
                        </small>
                    </Col>
                </Row>
            </Col>
            <Col xs="10" className="ml-auto">
                <CommentWrapper comments={comments} postId={post?.id} />
            </Col>
        </Modal>
    )
}

export default PostDetail;