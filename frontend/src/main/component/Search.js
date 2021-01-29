import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Label, Button, Input } from 'reactstrap';
import PostPreview from '../component/entities/post/PostPreview'
import UserPreview from "../component/entities/user/UserPreview";
import { Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Axios from '../api/Axios';
import { useAuth } from '../../App'
import { useParams } from 'react-router-dom';
import { pickBy } from "lodash";

const Search = () => {
    const { user } = useAuth();
    const { query } = useParams();

    const [tabStatus, setTabStatus] = useState('POSTS');
    const [totalPage, setTotalPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);


    const [advancedSearch, setAdvancedSearch] = useState({
        page: 1,
        itemsPerPage: 10,
        query: ''
    })


    // console.log(user, 'user');



    const getEntities = async () => {
        try {
            advancedSearch.query = query;
            const params = pickBy(advancedSearch);
            const res = await Axios.get(`/${tabStatus.toLowerCase()}/search`, { params });
            console.log(res, 'res');

            if (res.status === 200) {
                if (tabStatus === 'POSTS') {
                    setPosts(res.data.data.data);
                } else if (tabStatus === 'USERS') {
                    setUsers(res.data.data.data);
                }
                const total = Math.ceil(res.data.data.total / advancedSearch.itemsPerPage);
                setTotalPage(total);
            } else {
                if (tabStatus === 'POSTS') {
                    setPosts([]);
                } else if (tabStatus === 'USERS') {
                    setUsers([]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getEntities();
    }, [query, tabStatus, JSON.stringify(advancedSearch)]);



    const handleTabChange = (event, newValue) => {
        setTabStatus(newValue);
    };

    const AntTabs = withStyles({
        root: {
            borderBottom: '1px solid #e8e8e8'
        },
        indicator: {
            backgroundColor: '#585F7F'
        }
    })(Tabs);
    const AntTab = withStyles(theme => ({
        root: {
            textTransform: 'none',
            minWidth: 72,
            fontWeight: theme.typography.fontWeightRegular,
            marginRight: theme.spacing(4),
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"'
            ].join(','),
            '&:hover': {
                color: '#007bff',
                opacity: 1
            },
            '&$selected': {
                color: '#007bff',
                fontWeight: '500'
            },
            '&:focus': {
                color: '#007bff'
            }
        },
        selected: {}
    }))((property) => <Tab disableRipple {...property} />);



    const handlePaginationChange = (event, value) => {
        setAdvancedSearch({ ...advancedSearch, page: value })
    }

    return (
        <Container fluid className="mt-3">

            <div className="justify-content-center d-flex">
                <AntTabs
                    value={tabStatus}
                    onChange={handleTabChange}
                    aria-label="ant example">
                    <AntTab value="POSTS" label={'Bài đăng'} />
                    <AntTab value="USERS" label={'Người dùng'} />
                </AntTabs>
                <Typography />
            </div>

            <div className="text-center mt-3">
                <p className="lead">Kết quả tìm kiếm với từ khoá: <span className="font-weight-bold"> {query} </span>  </p>
            </div>

            <div className={tabStatus === "POSTS" ? "" : 'd-none'}>
                <Row className="mt-3 home_postSection">
                    {
                        posts?.length ? posts.map(e => (
                            <PostPreview
                                hideVote={true}
                                key={e.id}
                                post={e}
                            // postId={e.id}
                            />
                        )) : <Col xs="12" className="text-center m-3"> Không tìm thấy bài đăng nào </Col>
                    }
                </Row>
            </div>

            <div className={tabStatus === "USERS" ? "" : 'd-none'}>
                <Row className="mt-3 home_postSection">
                    {
                        users?.length ? users.map(e => (
                            <UserPreview
                                entity={e}
                            />
                        )) : <Col xs="12" className="text-center m-3"> Không tìm thấy nguời dùng nào </Col>
                    }
                </Row>
            </div>

            <Row className="justify-content-center">
                <Pagination count={totalPage} variant="outlined"
                    onChange={handlePaginationChange}
                    shape="rounded" />
            </Row>

        </Container>
    )
}

export default Search;