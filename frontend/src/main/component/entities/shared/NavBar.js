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
    const createModalVisible = () => {
        //   props.getEntity(id);
        setPostCreateModal(!postCreateModal);
    };

    const handleLogout = () => {
        history.push('/register');
        logout();
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
                <Form inline>
                    <FormControl type="text" placeholder="Tìm kiếm" className="mr-sm-2" />
                    <Button variant="outline-info">Tìm kiếm</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default CustomNavBar;