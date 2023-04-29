import * as React from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import {
  AlertColor,
  Avatar,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ReCAPTCHA from "react-google-recaptcha";
import Copyright from '@/components/User/Copyright';
import Alert from '@/components/User/Alert';
import globalCfg from "@/global.config";

const theme = createTheme();
const captchaRef = React.createRef<ReCAPTCHA>();

export default function SignIn() {
  const router = useRouter()
  const { t } = useTranslation('user')

  const [logined, setLogined] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [tipStatus, setTipStatus] = React.useState(false)
  const [tipText, setTipText] = React.useState<string | null>("")

  const SITE_KEY = globalCfg.recaptchaKey;
  const TIPES_TIME = 5000

  var alertType: AlertColor = "success"
  var reqBody = {}

  const handleTipClose = (event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setTipStatus(false)
  }

  const requestSignIn = async (value: string | null) => {
    setLogined(true)
    console.log(value)

    setTimeout(()=>{
      setTipText(t("Login successfully"))
      setOpen(false)
      setTipStatus(true)

      router.replace("/")
      // force refresh page to avoid empty recaptcha element
      router.reload()
    }, 1000)
  }

  // speed up home page loading
  React.useEffect(() => {
    router.prefetch('/')
  }, [router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const username = data.get('username')
    const passwd = data.get('password')

    if (username === "" || passwd === "") {
      return
    }

    captchaRef.current?.reset()
    setOpen(true)
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={tipStatus}
          onClose={handleTipClose}
          autoHideDuration={TIPES_TIME}
          >
          <Alert severity={alertType} sx={{ width: '100%' }}>
          { tipText }
        </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Sign In")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("Username")}
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Password")}
              type="password"
              id="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("Remember me")}
            />
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={() => {setOpen(false)}}
            >
              <ReCAPTCHA
                style={{ display: "inline-block" }}
                sitekey={SITE_KEY}
                onChange={requestSignIn}
                type="image"
                theme="light"
                ref={captchaRef}
              />
            </Backdrop>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={logined}
            >
              {t("Sign In")}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  {t("Forgot password?")}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {t("Don't have an account? Sign Up")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ["user"])),
    },
  };
}