import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Label, Button, Input } from 'reactstrap';
import PostPreview from '../component/entities/post/PostPreview'
import { InputAdornment, TextField, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { startingDay, finalDay } from './entities/shared/FirstAndLastDaysOfMonth'
import useDebounce from './entities/shared/useDebounce';

import Pagination from '@material-ui/lab/Pagination';
import TopicsDropdown from '../component/entities/shared/TopicsDropdown'
import Axios from '../api/Axios';
import { useAuth } from '../../App'
import { pickBy, omit } from 'lodash';

const Home = () => {
    const { user } = useAuth();
    const [tabStatus, setTabStatus] = useState('ALL');
    const [totalPage, setTotalPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [topPosts, setTopPosts] = useState([]);
    const [interestedTopics, setInterestedTopics] = useState(undefined);

    const [advancedSearch, setAdvancedSearch] = useState({
        query: '',
        topic: undefined,
        minDate: undefined,
        maxDate: undefined,
        page: 1,
        itemsPerPage: 10
    })

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);


    // console.log(user, 'user');
    useEffect(() => {
        if (user && user.topics.length) {
            const output = user.topics.map(e => e.id);
            setInterestedTopics(JSON.stringify(output));
        }
    }, [user?.topics])


    const getPosts = async () => {
        try {
            if (!debouncedQuery.length || debouncedQuery.length >= 3) {
                advancedSearch.query = debouncedQuery;
                const params = pickBy(advancedSearch);
                let res;
                if (tabStatus === "INTERESTED") {
                    // console.log(params, 'params');
                    res = await Axios.get(`/posts/search?topics=${interestedTopics}`, { params })

                } else if (tabStatus === "ALL") {
                    // console.log(paramsWithoutTopics, 'paramsWithoutTopics');
                    res = await Axios.get("/posts/search", { params })
                }

                if (res.status === 200) {
                    setPosts(res.data.data.data);
                    const total = Math.ceil(res.data.data.total / advancedSearch.itemsPerPage);
                    setTotalPage(total);
                } else {
                    // ToastError(res.data.message)
                    setPosts([])
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getHotPosts = async () => {
        try {
            const res = await Axios.get(`/posts/hotPosts`);
            if (res.status === 200) {
                const output = Object.values(res.data.data);
                setTopPosts(output);
            } else {
                console.log(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPosts();
    }, [JSON.stringify(advancedSearch), debouncedQuery, tabStatus]);

    useEffect(() => {
        getHotPosts();
    }, [])

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


    const onTopicChange = (e) => {
        if (e) {
            setAdvancedSearch({ ...advancedSearch, topic: e.value, page: 1 })
        } else {
            setAdvancedSearch({ ...advancedSearch, topic: undefined, page: 1 })
        }
    }
    const handlePaginationChange = (event, value) => {
        setAdvancedSearch({ ...advancedSearch, page: value })
    }
    const handleSearchQuery = (value) => {
        setQuery(value);
        setAdvancedSearch({ ...advancedSearch, page: 1 })
    }

    return (
        <Container fluid className="mt-3">
            <Row>
                <Col xs="12">
                    <Row className="home_filterSection justify-content-center">
                        <Col>
                            <TopicsDropdown
                                onTopicsChange={onTopicChange}
                                isMultiple={false}
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
                <Col sm="12" md="9">
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
                <Col sm="3" md="0">
                    {/* Ads and recruitment section */}
                    <Row>
                        <Col xs="12" className="border p-3">
                            <div className="text-center">
                                <span className="lead">Bài đăng nổi bật trong tuần</span>
                            </div>
                            <div className="home_hotPosts">
                                {
                                    topPosts.length && topPosts.map(e => (
                                        <PostPreview
                                            hideVote={true}
                                            key={e.id}
                                            post={e}
                                        // postId={e.id}
                                        />
                                    ))
                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;