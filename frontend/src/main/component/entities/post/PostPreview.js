import React, { useEffect, useState } from 'react';
import Vote from '../vote/Vote'
import { Col, Row, Label, Badge } from 'reactstrap';
import PostDetail from './PostDetail';
import { returnValueOrEmpty } from '../shared/returnValueOrEmpty';
import moment from 'moment';
import Axios from '../../../api/Axios';
import { ToastError } from '../shared/Toast'
import { propTypes } from 'react-bootstrap/esm/Image';
// import { useEffect, useState, useRef } from 'react';

const PostPreview = ({ post, hideVote }) => {

    const [entity, setEntity] = useState(null);

    const getPostById = async () => {

        try {
            const res = await Axios.get(`/posts/detail/${post?.id}`);
            if (res.status === 200) {
                setEntity(res.data.data);
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

    return (
        <Col xs="12" className="p-3">
            <Row>
                <Col xs="2" className=" m-auto">
                    <Vote
                        hideVote={hideVote}
                        totalVote={post?.post_votes}
                        postId={post?.id}
                    />
                </Col>
                <Col xs="10" onClick={() => detailModalVisible()}>
                    <p className="font-weight-bold">
                        {returnValueOrEmpty(post?.title)}
                    </p>
                    <p className="ellipsisText">
                        {returnValueOrEmpty(post?.content)}
                    </p>
                </Col>
                <Col xs="10" className="ml-auto d-flex justify-content-between">
                    <Badge color="primary">Chủ đề 1</Badge>
                    <small className="font-italic ">
                        {moment(returnValueOrEmpty(post?.created_at)).format('DD/M/YYYY, h:mm')}
                    </small>
                </Col>
            </Row>
            <PostDetail
                post={entity}
                modal={postDetailModal}
                toggle={() => toggleDetailModal()}
            />
        </Col>



    )
}

export default PostPreview;