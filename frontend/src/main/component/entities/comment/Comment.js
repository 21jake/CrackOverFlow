import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import moment from 'moment';
import { useAuth } from "../../../../App";
import PostDetail from '../post/PostDetail';
import DeleteModal from '../shared/DeleteModal';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { AvGroup, AvInput, AvFeedback, AvForm } from 'availity-reactstrap-validation';
import { deleteComment, editComment, triggerFetchOn, resetComment } from "../../../actions/Comments";
import { triggerSearchOn as triggerSearchUserOn } from "../../../actions/User";
import { fetchPost } from "../../../actions/Posts";
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import {mapAvatar} from '../shared/Avatar'



const Comment = (props) => {
    const { entity, isShort, clickDisplayPost, postEntity, commentUpdateSuccess, setSubmitFormVisibility } = props;
    // const [postEntity, setPostEntity] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const { user } = useAuth();
    const history = useHistory();
    const [actionDropdown, setActionDropdown] = useState(false);
    const [editFormDisplay, setEditFormDisplay] = useState(false);
    const editForm = useRef();
    const [userIntent, setUserIntent] = useState(undefined)

    const userIsCommentCreator = entity?.user.id === user?.id;

    const [postDetailModal, setPostDetailModal] = useState(false);
    const toggleDetailModal = () => setPostDetailModal(!postDetailModal);
    const detailModalVisible = () => {
        props.fetchPost(entity.post_id)
        setPostDetailModal(!postDetailModal);
    };
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const deleteModalVisible = () => {
        setDeleteModal(!deleteModal);
    };

    const onEditButtonClick = () => {
        setEditFormDisplay(true)
        setSubmitFormVisibility(false);
    }

    const handleDeleteComment = () => {
        props.deleteComment(entity?.id);
        setUserIntent("DELETE_COMMENT");
    }
    const handleRedirect = inputId => {
        if (userIsCommentCreator) {
            history.push('/current');
        } else {
            history.push(`/user/${inputId}`);
            props.triggerSearchUserOn()
        }
    }
    const toggleActionDropdown = () => setActionDropdown(prevState => !prevState);

    const clearForm = () => {
        editForm.current.reset();
    }

    const handleEditComment = (event, errors, value) => {
        if (!errors.length) {
            value.id = entity.id
            props.editComment(value);
            setUserIntent("EDIT_COMMENT");
        }
    }

    const handleUserIntent = () => {
        switch (userIntent) {
            case "EDIT_COMMENT":
                setEditFormDisplay(false);
                setSubmitFormVisibility(true);
                clearForm();
                break;
            case "DELETE_COMMENT":
                setDeleteModal(false);
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        if (commentUpdateSuccess) {
            props.triggerFetchOn();
            handleUserIntent();
            setUserIntent(undefined)
        }
    }, [commentUpdateSuccess])


    return (
        <Row className="mt-3"
            onClick={() => clickDisplayPost && detailModalVisible()}
        >
            <DeleteModal
                toggle={toggleDeleteModal}
                modal={deleteModal}
                prompt="Xác nhận xoá bình luận này?"
                handleComfirm={handleDeleteComment}
            />
            <Col xs="1" >
                <div >
                    <Avatar src={mapAvatar[entity?.user.avatar]} />
                </div>
            </Col>
            <Col xs="11">
                <Row className="justify-content-between">
                    <Col xs="10">
                        <p className={`font-weight-bold m-0 cursor-pointer-text ${userIsCommentCreator && "text-primary"}`}
                         onClick={() => handleRedirect(entity?.user.id)} >
                            {`${entity?.user.fname} ${entity?.user.lname}`}
                        </p>
                    </Col>
                    <Col xs="2">
                        <Dropdown isOpen={actionDropdown}
                            className={entity?.user_id === user?.id ? "d-flex" : "d-none"}
                            toggle={toggleActionDropdown}>
                            <DropdownToggle className="DropdownToggle" color="light">
                                <FontAwesomeIcon icon={faEllipsisV} color="#333333" size="xs" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => deleteModalVisible()}>
                                    <FontAwesomeIcon icon={faTrash} className="mr-3 deleteIcon" />
                                    <span className="text-muted">Xoá bình luận</span>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={onEditButtonClick}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-3 editIcon" />
                                    <span className="text-muted">Sửa bình luận</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Col xs="11">
                        <small className="font-italic ">
                            {moment(entity?.created_at).format('DD/M/YYYY, h:mm')}
                        </small>
                    </Col>
                </Row>
            </Col>
            <Col xs="11" className="ml-auto mt-3" className={editFormDisplay ? 'd-none' : 'ml-auto mt-3'}>
                <p className={isShort ? "ellipsisText" : ""}>
                    {entity?.content}
                </p>
            </Col>
            <Col xs="12" className={editFormDisplay ? 'mt-3' : 'd-none'}>
                <AvForm style={{ width: '100%' }}
                    model={entity}
                    onSubmit={handleEditComment}
                    ref={editForm}
                >
                    <AvGroup>
                        <AvInput
                            type="textarea"
                            name="content"
                            placeholder="Nội dung bình luận"
                            required
                        />
                        <AvFeedback>Nhập bình luận trước khi gửi</AvFeedback>
                    </AvGroup>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button type="reset" className="mr-3" color="light" onClick={() => setEditFormDisplay(false)}>
                            <span>Hủy</span>
                        </Button>
                        <Button type="submit" className="replyButton" color="primary">
                            <span>Chỉnh sửa</span>
                        </Button>
                    </div>
                </AvForm>
            </Col>
            <PostDetail
                post={postEntity}
                modal={postDetailModal}
                toggle={() => toggleDetailModal()}
            />
        </Row>
    );
}

const mapStateToProps = state => {
    return {
        postEntity: state.post.entity,
        commentUpdateSuccess: state.comment.updateSuccess,
    }
}
const mapDispatchToProps = {
    deleteComment,
    editComment,
    fetchPost,
    triggerFetchOn,
    resetComment,
    triggerSearchUserOn
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment);