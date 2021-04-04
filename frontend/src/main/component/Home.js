import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Label, Button, Input } from 'reactstrap';
import PostPreview from '../component/entities/post/PostPreview'
import { InputAdornment, TextField, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDebounce from './entities/shared/useDebounce';
import Pagination from '@material-ui/lab/Pagination';
import TopicsDropdown from '../component/entities/shared/TopicsDropdown'
import { useAuth } from '../../App'
import { pickBy } from 'lodash';
import { fetchPosts, fetchHotPosts, triggerSearchOff } from "../actions/Posts";
import { connect } from "react-redux";

const Home = (props) => {
    const { posts, totalPosts, topPosts, shouldSearchPosts } = props;
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const [tabStatus, setTabStatus] = useState('ALL');
    const [interestedTopics, setInterestedTopics] = useState(undefined);
    const [advancedSearch, setAdvancedSearch] = useState({
        query: '',
        topic: null,
        minDate: "",
        maxDate: "",
        page: 1,
        itemsPerPage: 10
    })

    const totalPage = Math.ceil(totalPosts / advancedSearch.itemsPerPage);

    useEffect(() => {
        if (user && user.topics?.length) {
            const output = user.topics.map(e => e.id);
            setInterestedTopics(JSON.stringify(output));
        }
    }, [user?.topics])

    const getPosts = () => {
        if (!debouncedQuery.length || debouncedQuery.length >= 3) {
            window.scrollTo(0, 0);
            advancedSearch.query = debouncedQuery;
            const params = pickBy(advancedSearch);
            const field = JSON.stringify(params);
            if (tabStatus === "INTERESTED") {
                props.fetchPosts(field, interestedTopics)
            } else if (tabStatus === "ALL") {
                props.fetchPosts(field, null)
            }
        }
    }


    const getHotPosts = () => {
        props.fetchHotPosts();
    }

    useEffect(() => {
        getPosts();
    }, [JSON.stringify(advancedSearch), debouncedQuery, tabStatus]);

    useEffect(() => {
        if (shouldSearchPosts) {
            getPosts();
            getHotPosts();
            props.triggerSearchOff();
        }
    }, [shouldSearchPosts])


    useEffect(() => {
        getHotPosts();
    }, [])

    const handleTabChange = (event, newValue) => {
        setTabStatus(newValue);
        setAdvancedSearch({ ...advancedSearch, page: 1 })
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


    const onTopicChange = (e) => {
        if (e) {
            setAdvancedSearch({ ...advancedSearch, topic: e.value, page: 1 })
        } else {
            setAdvancedSearch({ ...advancedSearch, topic: null, page: 1 })
        }
    }
    const handlePaginationChange = (event, value) => {
        setAdvancedSearch({ ...advancedSearch, page: value })
    }
    const handleSearchQuery = (value) => {
        setQuery(value);
        setAdvancedSearch({ ...advancedSearch, page: 1 })
    }
    const onResetFilterClick = () => {
        setAdvancedSearch({
            ...advancedSearch,
            page: 1,
            query: '',
            topic: null,
            minDate: "",
            maxDate: ""
        })
        setQuery('')
    }


    return (
        <Container fluid className="mt-3">
            <Row>
                <Col xs="12" className="d-flex">
                    <Button color="light" size="sm" 
                    onClick={onResetFilterClick}
                    className="ml-auto border border-secondary"> 
                        <span className="font-weight-bold">Reset</span>
                    </Button>
                </Col>
                <Col xs="12">
                    <Row className="home_filterSection justify-content-center">
                        <Col>
                            <TopicsDropdown
                                onTopicsChange={onTopicChange}
                                isMultiple={false}
                                defaultOption={advancedSearch.topic}
                            />
                        </Col>
                        <Col>
                            <Label>
                                <span>Tìm kiếm theo nội dung</span>
                            </Label>

                            <TextField
                                className="search-field"
                                id="input-with-icon-textfield"
                                variant="outlined"
                                size="small"
                                value={query}
                                placeholder="Nhập từ khoá"
                                onChange={e => handleSearchQuery(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FontAwesomeIcon icon={faSearch} size="lg" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Col>
                        <Col >
                            <Label for="startDate">
                                <span>Thời gian từ ngày</span>
                            </Label>
                            <Input
                                type="date"
                                name="date"
                                id="startDate"
                                className="datePicker"
                                value={advancedSearch.minDate}
                                max={advancedSearch.maxDate}
                                onChange={e => setAdvancedSearch({ ...advancedSearch, minDate: e.target.value, page: 1 })}
                            />
                        </Col>
                        <Col>
                            <Label for="endDate">
                                <span>Đến ngày</span>
                            </Label>
                            <Input
                                type="date"
                                name="date"
                                id="endDate"
                                className="datePicker"
                                value={advancedSearch.maxDate}
                                min={advancedSearch.minDate}
                                onChange={e => setAdvancedSearch({ ...advancedSearch, maxDate: e.target.value, page: 1 })}
                            />
                        </Col>
                    </Row>
                    <Row className={user ? 'justify-content-center' : 'd-none'}>
                        <AntTabs
                            value={tabStatus}
                            onChange={handleTabChange}
                            aria-label="ant example">
                            <AntTab value="ALL" label={'Tất cả chủ đề'} />
                            <AntTab value="INTERESTED" label={'Chủ đề quan tâm'} />
                        </AntTabs>
                        <Typography />
                    </Row>
                </Col>
            </Row>
            <Row className="p-3">
                <Col lg="9" md="12">
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

                    <Row className="justify-content-center">
                        <Pagination count={totalPage} variant="outlined"
                            onChange={handlePaginationChange}
                            shape="rounded" />
                    </Row>
                </Col>
                <Col lg="3" md="0">
                    {/* Ads and recruitment section */}
                    <Row>
                        <Col xs="12" className="border p-3">
                            <div className="text-center">
                                <span className="lead">Bài đăng nổi bật trong tuần</span>
                            </div>
                            <div className="home_hotPosts">
                                {
                                    topPosts.length ? topPosts.map(e => (
                                        <PostPreview
                                            hideVote={true}
                                            key={e.id}
                                            post={e}
                                        // postId={e.id}
                                        /> 
                                    )) : ""
                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
const mapStateToProps = (state) => {
    return {
        posts: state.post.entities,
        totalPosts: state.post.totalItems,
        topPosts: Object.values(state.post.hotEntities),
        shouldSearchPosts: state.post.shouldSearchEntities
    }
}

const mapDispatchToProps = {
    fetchPosts,
    fetchHotPosts,
    triggerSearchOff
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);