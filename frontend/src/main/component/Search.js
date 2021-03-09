import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, Container } from 'reactstrap';
import PostPreview from '../component/entities/post/PostPreview'
import UserPreview from "../component/entities/user/UserPreview";
import { Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useParams } from 'react-router-dom';
import { pickBy } from "lodash";
import { connect } from 'react-redux';
import { searchPosts, searchUsers } from '../actions/Search';

const Search = (props) => {
    const { query } = useParams();

    const [tabStatus, setTabStatus] = useState('POSTS');
    const [advancedSearch, setAdvancedSearch] = useState({
        page: 1,
        itemsPerPage: 10,
        query: ''
    })

    const { users, posts, totalItems } = props;
    const totalPage = Math.ceil(totalItems / advancedSearch.itemsPerPage);

    const getEntities = async () => {
        advancedSearch.query = query;
        const params = pickBy(advancedSearch);
        if (tabStatus === 'POSTS') {
            props.searchPosts(params)
        } else if (tabStatus === 'USERS') {
            props.searchUsers(params)
        }
    }

    useEffect(() => {
        getEntities();
    }, [JSON.stringify(advancedSearch), tabStatus, query])

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
        window.scrollTo(0,0)
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
                                key={e.id}
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
const mapDispatchToProps = {
    searchPosts,
    searchUsers
}
const mapStateToProps = (state) => {
    return {
        users: state.search.usersEntities,
        posts: state.search.postsEntities,
        totalItems: state.search.totalItems
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Search);