import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'reactstrap';
import PostPreview from '../post/PostPreview';
import { useAuth } from '../../../../App'
import { useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import Comment from '../comment/Comment'
import { fetchSuggestedPosts, fetchUserComments, fetchUserPosts } from '../../../actions/User';
import { connect } from 'react-redux';

const User = (props) => {
    const { user } = useAuth();
    const history = useHistory();
    const [paginationState, setPaginationState] = useState({
        currentPage: 1,
        itemsPerPage: 10
    });
    const interestedTopics = user?.topics.length ? user.topics.map(e => e.id) : [1, 2];
    const { posts, comments, totalPosts, totalCredit, suggestedPosts} = props;

    const totalPage = Math.ceil(totalPosts / paginationState.itemsPerPage)
    useEffect(() => {
        if (!user || !user.id) {
            history.push('/register');
        }
    }, [user])

    useEffect(() => {
        if (user) {
            props.fetchUserComments(user?.id);
            props.fetchSuggestedPosts(JSON.stringify(interestedTopics));
        }
    }, [user])

    const handlePaginationChange = (event, value) => {
        setPaginationState({ ...paginationState, currentPage: value })
    }

    useEffect(() => {
        window.scrollTo(0,0)
        props.fetchUserPosts(user?.id, paginationState.currentPage);
    }, [JSON.stringify(paginationState)]);

    // (user, 'user')
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
                        <Col xs="11" className="ml-auto">
                            <Row className="border border-secondary rounded ">
                                {comments?.length ?
                                    comments.map(e =>
                                        <Comment
                                            key={e.id}
                                            clickDisplayPost={true}
                                            isShort={true} entity={e} />
                                    )
                                    : <p className="text-center m-3"> Không có bình luận nào </p>
                                }
                            </Row>

                        </Col>
                    </Row>
                    <Row className={suggestedPosts.length ? "" : "d-none"}>
                        <Col xs="12" >
                            <span className="lead">
                                Bài viết đề xuất
                        </span>
                        </Col>
                        <Col xs="12" className="m-3">
                            <div className="border border-secondary rounded m-3">
                                {
                                    suggestedPosts?.length ? suggestedPosts.map(e => (
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
        suggestedPosts: state.user.suggestedPosts
    }
}
const mapDispatchToProps = {
    fetchSuggestedPosts, 
    fetchUserComments, 
    fetchUserPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(User);