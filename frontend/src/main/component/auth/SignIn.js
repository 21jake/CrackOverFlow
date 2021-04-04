import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Axios from '../../api/Axios';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ToastSuccess, ToastError } from '../entities/shared/Toast';
import {useAuth} from '../../../App'


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
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const {login, user} = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (user && user.id) {
      history.goBack();
    }
}, [user])


  const signIn = async (event, errors, value) => {
    event.preventDefault();
    if (!errors.length) {
      try {
        // setLoading(true);
        const res = await Axios.post('/auth/login', value);
        // return;
        if (res && res.data.success) {
          ToastSuccess(res.data.message);
          login(res.data.user, res.data.token.token);
          return history.push('/')
        } else {
          ToastError(res.data.message);
        }      
      } catch (error) {
        console.log(error)
        // ToastError('Đã có lỗi xảy ra, vui lòng thử lại');
      }
    }
  }


  return (
    <Grid container component="main" className={classes.root}>

      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <AvForm onSubmit={signIn}>
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
                name="password"
                id="passwprd"
                label="Mật khẩu"
                type="password"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng nhập mật khẩu' },
                }}
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Đăng nhập
            </Button>
          </AvForm>


            <Grid item>
              <Link to="/register" variant="body2">
                {"Chưa có tài khoản? Đăng ký ngay"}
              </Link>
            </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>

        </div>
      </Grid>
    </Grid>
  );
}