import React, { useState, useEffect } from 'react';
import Vote from '../vote/Vote'
import { Col, Row, Badge } from 'reactstrap';
import PostDetail from './PostDetail';
import { returnValueOrEmpty } from '../shared/returnValueOrEmpty';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchPost, triggerSearchOff as triggerSearchPostOff } from '../../../actions/Posts';
import { triggerSearchOff as triggerSearchUserOff } from '../../../actions/Posts';

import { mapTopicColor } from '../shared/BadgeTopicColor';

const PostPreview = (props) => {
    const { post, hideVote, entity, shouldSearchUserEntities, shouldSearchPostEntities } = props

    const getPostById = () => {
        props.fetchPost(post.id);

    }
    
    const [postDetailModal, setPostDetailModal] = useState(false);
    const toggleDetailModal = () => setPostDetailModal(!postDetailModal);
    const detailModalVisible = () => {
        getPostById();
        setPostDetailModal(!postDetailModal);
    };

    useEffect(() => {
        if (shouldSearchUserEntities) {
            setPostDetailModal(false);
            props.triggerSearchUserOff();
        }
    }, [shouldSearchUserEntities])

    useEffect(() =>{
        if (shouldSearchPostEntities) {
            setPostDetailModal(false);
            getPostById();
            props.triggerSearchPostOff();
        }
    }, [shouldSearchPostEntities])

    // (post, 'post')

    return (
        <Col xs="12" className="p-3">
            <Row className="justify-content-between">
                <Col xs="2" >
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
                    <Badge color={mapTopicColor[post?.topic?.color]}>{post?.topic?.name}</Badge>
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
        entity: state.post.entity,
        shouldSearchUserEntities: state.user.shouldSearchEntities,
        shouldSearchPostEntities: state.post.shouldSearchEntities,
    }
}
const mapDispatchToProps = {
    fetchPost,
    triggerSearchPostOff,
    triggerSearchUserOff
}


export default connect(mapStateToProps, mapDispatchToProps)(PostPreview);