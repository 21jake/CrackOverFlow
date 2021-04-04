import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvGroup, AvInput, AvFeedback, AvForm } from 'availity-reactstrap-validation';
import Comment from './Comment';
import { useAuth } from "../../../../App";
import { createComment, fetchPostComments, triggerFetchOff, triggerFetchOn, resetComment } from "../../../actions/Comments";
import { connect } from 'react-redux';
import { ToastError } from '../shared/Toast';
import { useHistory } from 'react-router-dom';

const CommentWrapper = (props) => {
    const history = useHistory();
    const { postId, comments, shouldSearchComments, commentUpdateSuccess } = props;
    const formRef = useRef();
    const { user } = useAuth();
    const [formVisibility, setFormVisibility] = useState(true);
    const [userClickTextarea, setUserClickTexarea] = useState(false)

    useEffect(() => {
        if (shouldSearchComments) {
            props.fetchPostComments(postId)
            props.triggerFetchOff();
        }
    }, [shouldSearchComments])

    useEffect(() => {
        if (postId) {
            props.fetchPostComments(postId)
        }
    }, [postId])

    useEffect(() => {
        if (commentUpdateSuccess) {
            formRef.current.reset();
        }
    }, [commentUpdateSuccess])



    const handleSubmitComment = (event, errors, value) => {
        if (!user) {
            ToastError("Vui lòng đăng nhập trước khi bình luận");
            history.push('/login');
        } else {
            if (!errors.length) {
                value.post_id = postId;
                value.user_id = user.id;
                value.parent_comment_id = null;
                props.createComment(value);
                props.triggerFetchOn();
            }
        }
    }


    return (
        <Row className="p-1 m-3">
            <Col xs="12" className="text-break">
                {
                    comments.length ? (
                        comments.map(e => (
                            <Comment
                                clickDisplayPost={false}
                                key={e.id}
                                entity={e}
                                isShort={false}
                                setSubmitFormVisibility={(value) => setFormVisibility(value)}
                                // reFetchData={() => props.fetchPostComments(postId)}
                            />
                        ))
                    ) : (
                            <p>Trở thành người đầu tiên bình luận bài đăng này</p>
                        )
                }
            </Col>


            <Col xs="12" className={formVisibility ? 'mt-3' : 'd-none'}>
                <AvForm style={{ width: '100%' }} ref={formRef} onSubmit={handleSubmitComment}>
                    <AvGroup>
                        <AvInput
                            className={userClickTextarea && 'comment-textarea'}
                            onClick={()=> setUserClickTexarea(true)}
                            type="textarea"
                            name="content"
                            placeholder="Trả lời bài đăng"
                            required
                        />
                        <AvFeedback>Nhập bình luận trước khi gửi</AvFeedback>
                    </AvGroup>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button type="submit" className="replyButton" color="primary">
                            <span>Gửi bình luận</span>
                        </Button>
                    </div>
                </AvForm>
            </Col>

        </Row>
    )
}

const mapStateToProps = state => {
    return {
        comments: state.comment.entities,
        shouldSearchComments: state.comment.shouldSearchEntities,
        commentUpdateSuccess: state.comment.updateSuccess
    }
}
const mapDispatchToProps = {
    createComment,
    fetchPostComments,
    triggerFetchOff,
    triggerFetchOn,
    resetComment
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentWrapper);