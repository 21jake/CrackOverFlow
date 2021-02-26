import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, Container } from 'reactstrap';
import PostPreview from '../post/PostPreview';
import { useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import Comment from '../comment/Comment'
import { fetchUserComments, fetchUserPosts, resetUser, fetchGuest } from '../../../actions/User';
import { connect } from 'react-redux';


const Guest = (props) => {
    const { id } = useParams();
    // const [user, setUser] = useState(null);
    const [paginationState, setPaginationState] = useState({
        currentPage: 1,
        itemsPerPage: 10
    });
    const { posts, comments, totalPosts, totalCredit, user } = props;
    const totalPage = Math.ceil(totalPosts / paginationState.itemsPerPage)
    let initialRender = useRef(true);

    const getEntities = () => {
        props.resetUser();
        props.fetchGuest(id);
        props.fetchUserComments(id);
    }

    useEffect(() => {
        getEntities();
        props.fetchUserPosts(id, paginationState.currentPage);
    }, [id])

    useEffect(() => {
        if (initialRender) {
            initialRender = false;
        } else {
            props.fetchUserPosts(id, paginationState.currentPage);
        }
    }, [JSON.stringify(paginationState)]);


    const handlePaginationChange = (event, value) => {
        setPaginationState({ ...paginationState, currentPage: value })
    }

    return (
        <Container className="themed-container p-5">
            <Row>
                <Col xs="8">
                    <Row>
                        <Col xs="12" >
                            <span className="lead">
                                Thông tin người dùng
                            </span>
                        </Col>
                        <Col xs="6">
                            <div className="font-weight-bold">Họ tên: </div>
                            <div className="font-weight-bold">Email: </div>
                            <div className="font-weight-bold">Ngày tạo tài khoản: </div>

                        </Col>
                        <Col xs="6">
                            <div>{user?.fname} {user?.lname} </div>
                            <div>{user?.email}</div>
                            <div>
                                {moment(user?.created_at).format('DD/M/YYYY, h:mm')}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs="4">
                    <div className="text-center border border-secondary rounded h-100 d-flex">
                        <h2 className="m-auto text-primary">
                            CREDIT: {totalCredit}
                        </h2>
                    </div>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col xs="7">
                    <Row>
                        <Col xs="12" >
                            <span className="lead">
                                Các bài đăng gần đây
                        </span>
                        </Col>
                        <Col xs="12" className="m-3">
                            <div className="border border-secondary rounded m-3">
                                {
                                    posts?.length ? posts.map(e => (
                                        <PostPreview
                                            key={e.id}
                                            post={e}
                                            hideVote={true}
                                        />
                                    )) : <p className="text-center m-3"> Không có bài đăng nào </p>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className={posts?.length ? "justify-content-center" : "d-none"}>
                        <Pagination count={totalPage} variant="outlined"
                            onChange={handlePaginationChange}
                            shape="rounded" />
                    </Row>
                </Col>
                <Col xs="5">
                    <Row>
                        <Col xs="12" >
                            <span className="lead">
                                Các bình luận gần đây
                        </span>
                        </Col>
                        <Col xs="12" className="m-3">
                            <div className="border border-secondary rounded m-3">
                                {comments?.length ?
                                    comments.map(e =>
                                        <Comment
                                            key={e.id}
                                            clickDisplayPost={true}
                                            isShort={true} entity={e} />
                                    )
                                    : <p className="text-center m-3"> Không có bình luận nào </p>
                                }
                            </div>

                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
const mapStateToProps = state => {
    return {
        posts: state.user.posts,
        comments: state.user.comments,
        totalPosts: state.user.totalPosts,
        totalCredit: state.user.totalCredit,
        user: state.user.guest    }
}
const mapDispatchToProps = {
    fetchUserComments,
    fetchUserPosts,
    resetUser,
    fetchGuest
}
export default connect(mapStateToProps, mapDispatchToProps)(Guest);