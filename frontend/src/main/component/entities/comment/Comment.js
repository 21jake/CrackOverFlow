import React, { useRef, useState } from 'react';
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import moment from 'moment';
import Axios from '../../../api/Axios';
import { ToastError, ToastSuccess } from '../../entities/shared/Toast'
import { useAuth } from "../../../../App";
import PostDetail from '../post/PostDetail';
import DeleteModal from '../shared/DeleteModal';
import { useHistory } from 'react-router-dom';
import RandomAvatar from "./../shared/RandomAvatar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { AvGroup, AvInput, AvFeedback, AvForm } from 'availity-reactstrap-validation';

const Comment = (props) => {
    const { entity, isShort, clickDisplayPost, reFetchData } = props;
    const [postEntity, setPostEntity] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const { user } = useAuth();
    const history = useHistory();
    const [actionDropdown, setActionDropdown] = useState(false);
    const [editFormDisplay, setEditFormDisplay] = useState(false);
    const editForm = useRef()


    const getPostById = async () => {
        try {
            const res = await Axios.get(`/posts/detail/${entity.post_id}`);
            if (res.status === 200) {
                setPostEntity(res.data.data);
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
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const deleteModalVisible = () => {
        setDeleteModal(!deleteModal);
    };

    const handleDeleteComment = async () => {
        try {
            const res = await Axios.delete(`/comments/delete/${entity?.id}`);
            if (res.status === 200) {
                setDeleteModal(false);
                reFetchData()
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRedirect = inputId => {
        if (inputId === user.id) {
            history.push('/current');
        } else {
            history.push(`/user/${inputId}`);
        }
    }
    const toggleActionDropdown = () => setActionDropdown(prevState => !prevState);

    const clearForm = () => {
        editForm.current.reset();
    }
    const handleEditComment = async (event, errors, value) => {

        if (!errors.length) {
            value.id = entity.id
            try {
                const res = await Axios.put('/comments/update', value);
                if (res.status === 200) {
                    ToastSuccess(res.data.message);
                    setEditFormDisplay(false);
                    reFetchData();
                    clearForm();
                } else {
                    ToastError(res.data.message);
                }
            } catch (error) {
                console.log(error)
            }

        }
    }

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
                    <RandomAvatar letter={entity?.user.fname[0]} />
                </div>
            </Col>
            <Col xs="11">
                <Row className="justify-content-between">
                    <Col xs="10">
                        <p className="font-weight-bold m-0" onClick={() => handleRedirect(entity?.user.id)} >
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
                                 onClick={() => setEditFormDisplay(true)}
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
                reFetchData={() => getPostById()}
            />
        </Row>
    );
}

export default Comment;