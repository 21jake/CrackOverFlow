import React, { useEffect, useState, useRef } from 'react';
import Vote from '../vote/Vote'
import { Col, Row, Modal, Badge, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Button } from 'reactstrap';
import CommentWrapper from '../comment/CommentWrapper'
import { returnValueOrEmpty } from '../shared/returnValueOrEmpty';
import moment from 'moment';
import { useAuth } from '../../../../App';
import DeleteModal from '../shared/DeleteModal';
import { sample } from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import TopicsDropdown from '../shared/TopicsDropdown';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ToastError } from '../shared/Toast'
import { deletePost, triggerSearchOn, editPost } from "../../../actions/Posts";
import { triggerFetchOn as triggerFetchCommentsOn } from "../../../actions/Comments";

import { connect } from "react-redux";

const PostDetail = (props) => {
    const editForm = useRef();
    const { post, postUpdateSuccess } = props;
    const [comments, setComments] = useState([]);
    const { user } = useAuth();
    const [deleteModal, setDeleteModal] = useState(false);
    const [actionDropdown, setActionDropdown] = useState(false);
    const [defaultTopic, setDefaultTopic] = useState({
        label: '',
        value: ''
    })
    const [editFormDisplay, setEditFormDisplay] = useState(false);
    const [userIntent, setUserIntent] = useState(undefined)

    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const deleteModalVisible = () => {
        setDeleteModal(!deleteModal);
    };
    const toggleActionDropdown = () => setActionDropdown(prevState => !prevState);


    useEffect(() => {
        if (post?.topic) {
            setDefaultTopic({ ...defaultTopic, label: post.topic.name, value: post.topic.id })
        }
    }, [post?.topic])

    useEffect(() => {
        if (post?.comments?.length) {
            setComments(post.comments)
        }
    }, [post?.comments])

    const badgeColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light']
    const onTopicsChange = (e) => {
        if (e) {
            setDefaultTopic(e);
        } else {
            setDefaultTopic(undefined);
        }
    }
    const clearForm = () => {
        editForm.current.reset();
    }
    const handleEditPost = (event, errors, value) => {
        if (!defaultTopic) {
            ToastError("Vui lòng chọn chủ đề cho bài đăng");
            return
        }
        if (!errors.length) {
            setUserIntent("EDIT_POST");
            value.id = post.id
            value.topic_id = defaultTopic.value
            props.editPost(value);

        }
    }
    const handleDeletePost = () => {
        setUserIntent("DELETE_POST");
        props.deletePost(post.id)
    }
    const handleUserIntent = () => {
        switch (userIntent) {
            case "DELETE_POST":
                props.triggerSearchOn();
                setDeleteModal(false);
                props.toggle();
                // ToastSuccess("Xóa bài đăng thành công")
                break;
            case "EDIT_POST":
                props.triggerSearchOn();
                setEditFormDisplay(false);
                props.triggerFetchCommentsOn();
                clearForm();
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (postUpdateSuccess && props.modal) {
            handleUserIntent();
            setUserIntent(undefined);
        }
    }, [postUpdateSuccess])

    return (
        <Modal className="m-3" isOpen={props.modal} toggle={() => props.toggle()} className="postDetailModal">
            <DeleteModal
                toggle={toggleDeleteModal}
                modal={deleteModal}
                prompt="Xác nhận xoá bài đăng này?"
                handleComfirm={handleDeletePost}
            />

            <Container className={editFormDisplay ? 'p-3' : 'd-none'}>
                <Row className="m-3">
                    <Col xs="12" className="text-center">
                        <h3 className="lead">Chỉnh sửa bài đăng </h3>
                    </Col>
                    <Col xs="12">
                        <TopicsDropdown
                            onTopicsChange={onTopicsChange}
                            isMultiple={false}
                            defaultOption={defaultTopic}
                        />
                    </Col>
                </Row>
                <Row className="m-3">
                    <Col xs="12">
                        <AvForm
                            // model={defaultPost}
                            onSubmit={handleEditPost}
                            ref={editForm}
                        >
                            <AvField name="title" label="Tiêu đề"
                                value={post?.title}
                                validate={{
                                    required: { value: true, errorMessage: 'Vui lòng nhập tiêu đề bài đăng' },
                                    minLength: { value: 10, errorMessage: 'Tiêu đề bài đăng chứa ít nhất 10 ký tự' },
                                    maxLength: { value: 255, errorMessage: 'Tiêu đề bài đăng chứa không quá 255 ký tự' },
                                }}

                            />
                            <AvField name="content" label="Nội dung" type="textarea"
                                value={post?.content}
                                className="post_textAreaContent"
                                validate={{
                                    required: { value: true, errorMessage: 'Vui lòng nhập nội dung bài đăng' },
                                    minLength: { value: 10, errorMessage: 'Nội dung bài đăng chứa ít nhất 10 ký tự' },
                                }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Button type="reset"
                                    onClick={() => setEditFormDisplay(false)}
                                    color="light">
                                    <span>Hủy</span>
                                </Button>
                                <Button type="submit" className="replyButton" color="primary">
                                    <span>Chỉnh sửa</span>
                                </Button>
                            </div>
                        </AvForm>
                    </Col>
                </Row>

            </Container>

            <Col xs="12" className={editFormDisplay ? 'd-none' : 'p-3'}>
                <Row>
                    <Col xs="1" className="m-auto mt-3">
                        <Vote
                            totalVote={post?.post_votes}
                            postId={post?.id}
                        />
                    </Col>
                    <Col xs="11" className="mt-5">
                        <Row className="d-flex justify-content-between">
                            <Col xs="11">
                                <p className="font-weight-bold">
                                    {post?.title}
                                </p>
                            </Col>
                            <Col xs="1" className="text-center">
                                <Dropdown isOpen={actionDropdown}
                                    className={post?.user_id === user?.id ? "ml-auto" : "d-none"}
                                    toggle={toggleActionDropdown}>
                                    <DropdownToggle className="DropdownToggle" color="light">
                                        <FontAwesomeIcon icon={faEllipsisV} color="#333333" size="xs" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => deleteModalVisible()}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-3 deleteIcon" />
                                            <span className="text-muted">Xoá bài</span>
                                        </DropdownItem>
                                        <DropdownItem onClick={() => setEditFormDisplay(true)}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-3 editIcon" />
                                            <span className="text-muted">Sửa bài</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <p >
                            {returnValueOrEmpty(post?.content)}
                        </p>
                    </Col>
                    <Col xs="11" className="ml-auto d-flex justify-content-between">
                        {/* <Badge color="primary">Chủ đề 1</Badge> */}
                        <Badge color={sample(badgeColors)}>{post?.topic?.name}</Badge>
                        <small className="font-italic ">
                            {moment(returnValueOrEmpty(post?.created_at)).format('DD/M/YYYY, h:mm')}
                        </small>
                    </Col>
                </Row>
            </Col>
            <Col xs="11" className={editFormDisplay ? 'd-none' : 'ml-auto'}>
                <CommentWrapper comments={comments} postId={post?.id} />
            </Col>
        </Modal>
    )
}
const mapStateToProps = state => {
    return {
        postUpdateSuccess: state.post.updateSuccess
    }
}
const mapDispatchToProps = {
    deletePost,
    triggerSearchOn,
    editPost,
    triggerFetchCommentsOn
}
export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);