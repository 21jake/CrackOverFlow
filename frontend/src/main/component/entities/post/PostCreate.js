import { AvForm, AvField } from 'availity-reactstrap-validation';
import { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Modal, Container } from 'reactstrap';
import TopicsDropdown from '../shared/TopicsDropdown'
import { ToastSuccess, ToastError } from '../shared/Toast'
import { checkUserLoggedIn } from '../shared/checkUserLoggedIn';
import Axios from '../../../api/Axios';
import { useAuth } from '../../../../App';
import { useHistory } from 'react-router-dom';
import { createPost, resetPost, triggerSearchOn } from "../../../actions/Posts";
import { connect } from "react-redux";

const PostCreate = (props) => {
    const [topic, setTopic] = useState(null);
    const { user } = useAuth();
    const history = useHistory();
    const formRef = useRef();


    useEffect(() => {
        if (props.modal) {
            if (!checkUserLoggedIn(user)) {
                return history.push('login');
            }
        }
    }, [props.modal])

    useEffect(() => {
        if (props.postUpdateSuccess && props.modal) {
            props.resetPost();
            props.triggerSearchOn();
            props.toggle();
            clearForm();
        }
    }, [props.postUpdateSuccess])

    const onTopicsChange = (e) => {
        if (e) {
            console.log(e, 'e');
            setTopic(e.value);
        } else {
            setTopic(undefined);
        }
    }

    const clearForm = () => {
        formRef.current.reset();
    }


    const submitPost = data => {
        props.createPost(data);
    }

    const onFormSubmit = (event, errors, value) => {
        if (!errors.length) {
            if (!topic) {
                ToastError('Vui lòng chọn chủ đề cho bài đăng')
            } else {
                value.topic_id = topic;
                value.user_id = user.id;
                submitPost(value);
            }
        }
    }


    return (
        <Modal isOpen={props.modal} toggle={() => props.toggle()} className="postDetailModal" >
            <Container className="p-5">
                <Row className="m-3">
                    <Col xs="12" className="text-center">
                        <h3 className="lead">Tạo bài đăng mới</h3>
                    </Col>
                    <Col xs="12">
                        <TopicsDropdown
                            onTopicsChange={onTopicsChange}
                            isMultiple={false}
                            defaultOption={topic}
                        />
                    </Col>
                </Row>
                <Row className="m-3">
                    <Col xs="12">
                        <AvForm onSubmit={onFormSubmit} ref={formRef}>
                            <AvField name="title" label="Tiêu đề"
                                validate={{
                                    required: { value: true, errorMessage: 'Vui lòng nhập tiêu đề bài đăng' },
                                    minLength: { value: 10, errorMessage: 'Tiêu đề bài đăng chứa ít nhất 10 ký tự' },
                                    maxLength: { value: 255, errorMessage: 'Tiêu đề bài đăng chứa không quá 255 ký tự' },
                                }}
                            />
                            <AvField name="content" label="Nội dung" type="textarea"
                                className="post_textAreaContent"
                                validate={{
                                    required: { value: true, errorMessage: 'Vui lòng nhập nội dung bài đăng' },
                                    minLength: { value: 10, errorMessage: 'Nội dung bài đăng chứa ít nhất 10 ký tự' },
                                }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Button type="submit" className="replyButton" color="primary">
                                    <span>Tạo bài đăng</span>
                                </Button>
                            </div>
                        </AvForm>
                    </Col>
                </Row>

            </Container>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        postUpdateSuccess: state.post.updateSuccess
    }
}

const mapDispatchToProps = {
    createPost, 
    resetPost,
    triggerSearchOn
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCreate);