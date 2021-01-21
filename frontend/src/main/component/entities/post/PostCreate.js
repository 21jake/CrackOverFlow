import { AvForm, AvField } from 'availity-reactstrap-validation';
import { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Modal, Container } from 'reactstrap';
import TopicsDropdown from '../shared/TopicsDropdown'
import { ToastSuccess, ToastError } from '../shared/Toast'
import { checkUserLoggedIn } from '../shared/checkUserLoggedIn';
import Axios from '../../../api/Axios';
import { useAuth } from '../../../../App';
import { useHistory } from 'react-router-dom';

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


    const onTopicsChange = (e) => {
        setTopic(e.value);
    }

    const clearForm = () => {
        formRef.current.reset();
    }

    const submitPost = async (data) => {
        try {
            const res = await Axios.post('/posts/create', data);
            if (res.status === 200) {
                ToastSuccess(res.data.message);
                props.toggle();
                clearForm();
            } else {
                ToastError(res.data.message);
            }
        } catch (error) {
            console.log(error)
        }

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
                        />
                    </Col>
                </Row>
                {/* chứa ít nhất 10 ký tự */}
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

export default PostCreate;