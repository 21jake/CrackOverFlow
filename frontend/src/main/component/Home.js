import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Label, Button, Input } from 'reactstrap';
import PostPreview from '../component/entities/post/PostPreview'
import { InputAdornment, TextField, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startingDay, finalDay } from './entities/shared/FirstAndLastDaysOfMonth'
import Pagination from '@material-ui/lab/Pagination';
import TopicsDropdown from '../component/entities/shared/TopicsDropdown'
import Axios from '../api/Axios';
import { ToastError } from '../component/entities/shared/Toast'

const Home = () => {
    const [tabStatus, setTabStatus] = useState('ALL');
    const [totalPage, setTotalPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [paginationState, setPaginationState] = useState({
        currentPage: 1,
        itemsPerPage: 10
    });


    const getPosts = async () => {
        try {
            const res = await Axios.get(`/posts?page=${paginationState.currentPage}`);
            if (res.status === 200) {
                // console.log(res, 'res');
                setPosts(res.data.data.data);
                const total = Math.ceil(res.data.data.total / paginationState.itemsPerPage);
                setTotalPage(total);
            } else {
                ToastError(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        getPosts();
    }, [JSON.stringify(paginationState)]);

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


    const onTopicsChange = (e) => {
        console.log(e)
    }
    const handlePaginationChange = (event, value) => {
        setPaginationState({...paginationState, currentPage: value})
    }


    return (
        <Container fluid className="mt-3">
            <Row>
                <Col xs="12">
                    <Row className="home_filterSection justify-content-center">
                        <Col>
                            <TopicsDropdown
                                onTopicsChange={onTopicsChange}
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
                                // value={keyword}
                                placeholder="Nhập từ khoá"
                                // onChange={handleSearchBarInput}
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
                                placeholder="date placeholder"
                                defaultValue={startingDay()}
                            // max={props.selectedAdvanceSearch.maxDate}
                            // onChange={e => handleCheckMinDate(e.currentTarget.value)}
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
                                placeholder="date placeholder"
                                defaultValue={finalDay()}
                            // min={props.selectedAdvanceSearch.minDate}
                            // onChange={e => handleCheckMaxDate(e.currentTarget.value)}
                            />
                        </Col>
                        <Col className="d-flex">
                            <Button color="primary" className="mt-auto">Tìm kiếm</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <AntTabs
                            value={tabStatus}
                            onChange={handleTabChange}
                            aria-label="ant example">
                            <AntTab value="INTERESTED" label={'Chủ đề quan tâm'} />
                            <AntTab value="ALL" label={'Tất cả chủ đề'} />
                        </AntTabs>
                        <Typography />
                    </Row>
                </Col>
            </Row>
            <Row className="p-3">
                <Col xs="9">
                    <Row className="mt-3 home_postSection">
                        {
                            posts.length ? posts.map(e => (
                                <PostPreview 
                                    hideVote={true}
                                    key={e.id}
                                    post={e}
                                    // postId={e.id}
                                />
                            )) : ("Không tìm thấy bài đăng nào")
                        }
                    </Row>

                    <Row className="justify-content-center">
                        <Pagination count={totalPage} variant="outlined" 
                             onChange={handlePaginationChange}
                            shape="rounded" />
                    </Row>
                </Col>
                <Col xs="3">
                    {/* Ads and recruitment section */}
                    <Row>
                        <Col xs="12" className="border p-3">
                            <div className="text-center">
                                <span className="lead">Bài đăng nổi bật trong ngày</span>
                            </div>
                            <div className="home_hotPosts">
                                {/* <PostPreview />
                                <PostPreview /> */}
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;