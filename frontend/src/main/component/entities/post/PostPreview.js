import React, { useState } from 'react';
import Vote from '../vote/Vote'
import { Col, Row, Badge } from 'reactstrap';
import PostDetail from './PostDetail';
import { returnValueOrEmpty } from '../shared/returnValueOrEmpty';
import moment from 'moment';
import { sample } from "lodash";
import { connect } from 'react-redux';
import { fetchPost } from '../../../actions/Posts';
// import { useEffect, useState, useRef } from 'react';

const PostPreview = (props) => {
    const { post, hideVote, entity } = props

    const getPostById = () => {
        props.fetchPost(post.id);

    }

    const [postDetailModal, setPostDetailModal] = useState(false);
    const toggleDetailModal = () => setPostDetailModal(!postDetailModal);
    const detailModalVisible = () => {
        getPostById();
        setPostDetailModal(!postDetailModal);
    };
    const badgeColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'light']

    // (post, 'post')

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
                    <Badge color={sample(badgeColors)}>{post?.topic?.name}</Badge>
                    <small className="font-italic ">
                        {moment(returnValueOrEmpty(post?.created_at)).format('DD/M/YYYY, HH:mm')}
                    </small>
                </Col>
            </Row>
            <PostDetail
                post={entity}
                modal={postDetailModal}
                toggle={() => toggleDetailModal()}
                reFetchData={() => getPostById()}
            />
        </Col>
    )
}

const mapStateToProps = state => {
    return {
        entity: state.post.entity
    }
}
const mapDispatchToProps = {
    fetchPost
}


export default connect(mapStateToProps, mapDispatchToProps)(PostPreview);