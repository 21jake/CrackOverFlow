import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Axios from '../../api/Axios';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ToastError, ToastSuccess } from '../entities/shared/Toast';
import { useAuth } from '../../../App'
import { useHistory } from 'react-router-dom';
import TopicsDropdown from '../entities/shared/TopicsDropdown';



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
        CrackOverFlow
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const { login, user } = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const [topics, setTopics] = useState([]);


  useEffect(() => {
    if (user && user.id) {
        history.goBack();
    }
}, [user])


  const saveEntity = async (formData) => {
    try {
      // setLoading(true);
      const res = await Axios.post('/auth/register', formData);
      // (res,' res');
      if (res && res.data.success) {
        ToastSuccess(res.data.message);
        // localStorage.setItem('crackToken', res.data.token.token)
        login(res.data.user, res.data.token.token);
        return history.push('/')
        // return <Redirect to='/' />

      } else {
        ToastError(res.data.message);
      }
    } catch (error) {
      console.log(error)
      // ToastError('Đã có lỗi xảy ra, vui lòng thử lại');
    }
  }


  const register = (event, errors, value) => {

    if (!errors.length) {
      value.topics = topics;
      saveEntity(value);
    }
  }

  const onTopicsChange = (e) => {
    if (e) {
      const output = e.map(element => element.value);
      setTopics(output);
    } else {
      setTopics([]);
    }
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký
        </Typography>
        <AvForm onSubmit={register}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <AvField
                name="fname"
                id="fname"
                type="text"
                label="Tên"
                autoFocus
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập tên' },
                  maxLength: { value: 10, errorMessage: 'Tên không quá 10 ký tự' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <AvField
                name="lname"
                id="lname"
                label="Họ"
                type="text"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập họ' },
                  maxLength: { value: 10, errorMessage: 'Họ không quá 10 ký tự' },
                }}
              />

            </Grid>
            <Grid item xs={12}>
              <TopicsDropdown 
              onTopicsChange={onTopicsChange}
              isMultiple={true}
              />
            </Grid>
            <Grid item xs={12}>
              <AvField
                name="email"
                id="email"
                label="Email"
                type="email"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập email' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <AvField
                name="phone"
                id="phone"
                label="Số điện thoại"
                type="number"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập số điện thoại' },
                  pattern: {
                    value: /^0[1-9][0-9]{8}$/,
                    errorMessage: 'Số điện thoại không đúng định dạng'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <AvField
                name="password"
                id="password"
                label="Mật khẩu"
                type="number"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập mật khẩu' },
                }}
              />
            </Grid>
            <Button
              type="submit"
              // onClick={register}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Đăng ký
          </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login" variant="body2" >
                  Đăng nhập bằng tài khoản
              </Link>
              </Grid>
            </Grid>
          </Grid>
        </AvForm>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
