import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import PostCreate from '../post/PostCreate';
import React, { useState } from 'react';
import { useAuth } from '../../../../App';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';




const CustomNavBar = () => {
    const { logout, user } = useAuth();
    const history = useHistory();
    const [postCreateModal, setPostCreateModal] = useState(false);
    const toggleDetailModal = () => setPostCreateModal(!postCreateModal);
    const [query, setQuery] = useState('')
    const createModalVisible = () => {
        //   props.getEntity(id);
        setPostCreateModal(!postCreateModal);
    };

    const handleLogout = async () => {
        history.push('/');
        await logout();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/search/${query}`)
    }


    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <PostCreate
                modal={postCreateModal}
                toggle={() => toggleDetailModal()}
            />
            <Navbar.Brand >
                <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    CrackOverFlow
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {user && <Nav.Link>
                        <span onClick={() => createModalVisible()}>
                            Đăng bài
                        </span>
                    </Nav.Link>}
                    {user ?
                        <NavDropdown title={`${user.fname} ${user.lname}`} id="collasible-nav-dropdown">
                            <NavDropdown.Item>
                                <Link to="/current" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                    Hồ sơ
                                </Link>
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item onClick={() => createModalVisible()}>Đăng bài</NavDropdown.Item> */}
                            <NavDropdown.Item onClick={handleLogout} >Đăng xuất</NavDropdown.Item>
                        </NavDropdown> :
                        <>
                            <Nav.Link>
                                <span>
                                    <Link to="/register" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        Đăng ký
                            </Link>
                                </span>
                            </Nav.Link>
                            <Nav.Link>
                                <span>
                                    <Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        Đăng nhập
                                    </Link>
                                </span>
                            </Nav.Link>
                        </>


                    }


                </Nav>
                {/* <Form inline onSubmit={(e) => history.push(`/search/${e}`)}> */}
                <Form inline onSubmit={handleSubmit}>

                    <FormControl type="text" placeholder="Tìm kiếm" className="mr-sm-2" name="query" value={query} onChange={e => setQuery(e.target.value)} />
                    <Button variant="outline-info"
                     disabled={!query.length}
                    type="submit">Tìm kiếm</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default CustomNavBar;