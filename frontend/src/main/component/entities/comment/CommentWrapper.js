import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { AvGroup, AvInput, AvFeedback, AvForm } from 'availity-reactstrap-validation';
import Comment from './Comment';
import Axios from '../../../api/Axios';
import { ToastError } from '../../entities/shared/Toast'
import {useAuth} from "../../../../App";

const CommentWrapper = (props) => {
    const { postId } = props;
    const [comments, setComments] = useState([]);
    const formRef = useRef();
    const {user} = useAuth();
    

    const getComments = async () => {
        try {
            const res = await Axios.get(`/comments/post/${postId}`);
            if (res.status === 200) {
                if (res.data.data.length) {
                    setComments(res.data.data);
                } else {
                    setComments([]);
                }

            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (postId) {
            getComments();
        }
    }, [postId])

    const submitComment = async (data) => {
        try {
            const res = await Axios.post('comments/create', data);
            if (res.status === 200) {
                setComments([...comments, res.data.data]);
                formRef.current.reset();
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitComment = (event, errors, value) => {
        if (!errors.length) {
            value.post_id = postId;
            value.user_id = user.id;
            value.parent_comment_id = null;
            submitComment(value);
        }
    }


    return (
        <Row className="p-1 m-3">
            <Col xs="12">
                {
                    comments.length ? (
                        comments.map(e => (
                            <Comment
                                clickDisplayPost={false}
                                key={e.id}
                                entity={e}
                                isShort={false}
                                reFetchData={getComments}
                            />
                        ))
                    ) : (
                            <p>Trở thành người đầu tiên bình luận bài đăng này</p>
                        )
                }
            </Col>


            <Col xs="12" className="mt-3">
                <AvForm style={{ width: '100%' }} ref={formRef} onSubmit={handleSubmitComment}>
                    <AvGroup>
                        <AvInput
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

export default CommentWrapper;