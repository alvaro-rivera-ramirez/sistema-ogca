import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Swal from 'sweetalert2';
import { Navigate } from "react-router-dom";
import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signInValidation } from '../validators';
import { useAuth } from 'src/context/AuthProvider';
import { API_URL } from "../../constants";
import { Container } from '@mui/material';

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  
  const initialValues = {
    email: '',
    password: '',
  };
  
  const handleSubmit = async (values,props) => {
    console.log(values);
    try {
      const response = await fetch(`${API_URL}/v1/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Bienvenido',
          icon: 'success',
          showConfirmButton: false,
          timer: 600,
        }).then(()=>{
          auth.saveUser(json);
          router.push('/');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: `${json.error}`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
        props.resetForm();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        showConfirmButton: false,
        timer: 500,
      });
      props.resetForm();
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Formik
          initialValues={initialValues}
          validationSchema={signInValidation}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => {
            return (
              <Form>
                <Field
                  as={TextField}
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  helperText={<ErrorMessage name="email" />}
                  error={errors.email && touched.email}
                ></Field>

                {/* <TextField name="email" label="Email address" /> */}

                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={<ErrorMessage name="password" />}
                  error={errors.password && touched.password}
                />
                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
                  <Link variant="subtitle2" underline="hover">
                    Forgot password?
                  </Link>
                </Stack>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="inherit"
                >
                  Login
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
      </Stack>
    </>
  );

  if(auth.isAuthenticated){
    return <Navigate to="/" />;
  }
  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height: '100vh',
        width:'100%'
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ paddingBottom: '.5rem' }}>
            Bienvenido
          </Typography>

          {/* <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
