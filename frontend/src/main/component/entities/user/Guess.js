import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'reactstrap';
import PostPreview from '../post/PostPreview';
// import { useAuth } from '../../../../App'
import { useHistory, useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import Axios from '../../../api/Axios';
import { ToastError } from '../shared/Toast'
import moment from 'moment';
import Comment from '../comment/Comment'

const Guess = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    // const history = useHistory();
    const [totalCredit, setTotalCredit] = useState(0)


    const [totalPage, setTotalPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [paginationState, setPaginationState] = useState({
        currentPage: 1,
        itemsPerPage: 10
    });

    const getUser = async () => {
        try {
            const res = await Axios.get(`/users/detail/${id}`);
            if (res.status === 200) {
                console.log(res, 'rees')
                setUser(res.data.data)
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
 


    const getPosts = async () => {
        try {
            const res = await Axios.get(`/posts/user/${user?.id}?page=${paginationState.currentPage}`);
            if (res.status === 200) {
                // console.log(res.data.data.posts.total , 'res.res.data.data.total.data.posts)');
                setPosts(res.data.data.posts.data);
                const total = Math.ceil(res.data.data.posts.total / paginationState.itemsPerPage);
                setTotalPage(total);
                setTotalCredit(parseInt(res.data.data.totalCredit));
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getComments = async () => {
        try {
            const res = await Axios.get(`/comments/user/${user?.id}`);
            if (res.status === 200) {
                // console.log(res, 'res')
                if (res.data.data.data.length) {
                    setComments(res.data.data.data);
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



    const handlePaginationChange = (event, value) => {
        setPaginationState({ ...paginationState, currentPage: value })
    }
    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        getPosts();
    }, [JSON.stringify(paginationState)]);
    useEffect(() => {
        if (user?.id) {
            getComments();
        }
    }, [user?.id])
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
export default Guess;