import * as React from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  AlertColor,
  Avatar,
  Backdrop,
  Button,
  Box,
  CssBaseline,
  Container,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ReCAPTCHA from "react-google-recaptcha";
import Copyright from '@/components/User/Copyright';
import Alert from '@/components/User/Alert';
import globalCfg from "@/global.config";
import api from "./api"

const theme = createTheme();
const captchaRef = React.createRef();

export default function SignUp() {
  const router = useRouter()
  const { t } = useTranslation('user')

  const [seconds, setSeconds] = React.useState(-1)
  const [canSend, setCanSend] = React.useState(true)
  const [sended, setSended] = React.useState(false)
  const [sendText, setSendText] = React.useState(t("Verify"))
  const [open, setOpen] = React.useState(false)
  const [tipStatus, setTipStatus] = React.useState(false)

  const [usernameText, setUsernameText] = React.useState("")
  const [usernameHelperText, setUsernameHelperText] = React.useState("")
  const [emailText, setEmailText] = React.useState("")
  const [emailHelperText, setEmailHelperText] = React.useState("")
  const [passwdText, setPasswdText] = React.useState("")
  const [passwdHelperText, setPasswdHelperText] = React.useState("")
  const [reenteredPasswdText, setReenteredPasswdText] = React.useState("")
  const [reenteredPasswdError, setReenteredPasswdError] = React.useState(false)
  const [reenteredPasswdHelperText, setReenteredPasswdHelperText] = React.useState("")
  const [tipText, setTipText] = React.useState("")

  const usenamePattern = globalCfg.user.usenamePattern
  const emailPattern = globalCfg.user.emailPattern
  const passwdPattern = globalCfg.user.passwdPattern

  const SITE_KEY = globalCfg.recaptchaKey;
  const RESEND_TIME = 120
  const TIPES_TIME = 5000

  var submited = false
  var alertType: AlertColor = "success"

  React.useEffect(() => {
    let intervalId: NodeJS.Timer

    if (seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    } else if (seconds == 0) {
      setCanSend(true)
      setSendText(t("Reverify"))
    }
    return () => clearInterval(intervalId)
  }, [seconds, t])

  const handleOpen = () => {
    if (usernameText === "" || emailText === "") {
      return
    }

    // reset captcah every challenge
    captchaRef.current.reset()
    setOpen(true)
    setCanSend(false)
  }

  const handleTipClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setTipStatus(false)
  }

  const handleRequestCode = async (value: string) => {
    console.log(value)
    const reqBody = {
      username: usernameText,
      email: emailText,
      code: value,
    }

    api.requestCode(reqBody)

    // TODO
    if (true) {
      setSeconds(RESEND_TIME)
      setTimeout(()=>{
        setTipText(t("Sent successfully, please check your email"))
        setOpen(false)
        setSended(true)
        setTipStatus(true)
      }, 1000)
    }
  }

  const usernameOnChange = (event: Object) => {
    const pattern = new RegExp(usenamePattern)
    const data = event.target.value

    if (pattern.test(data)) {
      setUsernameHelperText("")
      setUsernameText(data)
    } else {
      setUsernameText("")
      setUsernameHelperText(t("The length shouldn't be lower than 4 characters"))
    }
  }

  const emailOnChange = (event: Object) => {
    const pattern = new RegExp(emailPattern)
    const data = event.target.value

    if (pattern.test(data)) {
      setEmailHelperText("")
      setEmailText(data)
    } else {
      setEmailText("")
      setEmailHelperText(t("Please input valid email address"))
    }
  }

  const passwdOnChange = (event: Object) => {
    const pattern = new RegExp(passwdPattern)
    const data = event.target.value

    if (pattern.test(data)) {
      setPasswdHelperText("")
      setPasswdText(data)
      if (data !== reenteredPasswdText) {
        setReenteredPasswdError(true)
        setReenteredPasswdHelperText(t("Passwords do not match"))
      } else {
        setReenteredPasswdError(false)
        setReenteredPasswdHelperText("")
      }
      setReenteredPasswdError(data !== reenteredPasswdText)
    } else {
      setPasswdText("")
      setReenteredPasswdError(data !== reenteredPasswdText)
      setPasswdHelperText(t("Then length shouldn't be lower than 6 characters"))
    }
  }

  const reenteredPasswdOnChange = (event: Object) => {
    const data = event.target.value

    if (passwdText !== data) {
      setReenteredPasswdText(data)
      setReenteredPasswdError(true)
      setReenteredPasswdHelperText(t("Passwords do not match"))
    } else {
      setReenteredPasswdHelperText("")
      setReenteredPasswdError(false)
      setReenteredPasswdText(data)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* disable trigger by verification code button */
    if (!submited) {
      return
    } else if (passwdText === "" || passwdText !== reenteredPasswdText) {
      return
    }

    const data = new FormData(event.currentTarget);
    const body = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      invitation_code: data.get('invitationCode'),
      code: data.get('code')
    }
    console.log("submit: ", body)
    // TODO
    if (true) {
      setTipText(t("Register successfully, please sign in"))
      setTipStatus(true)

      // TODO: switch page
      setTimeout(()=>{
        router.push("/signin")
        // force refresh page to avoid empty recaptcha element
        router.reload()
      }, 3000)
    }
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
            { t("Sign Up") }
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label={t('Username')}
                  name="username"
                  onChange={usernameOnChange}
                  inputProps={{pattern: usenamePattern}}
                  helperText={usernameHelperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("Email Address")}
                  name="email"
                  onChange={emailOnChange}
                  inputProps={{pattern: emailPattern}}
                  helperText={emailHelperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={sended}
                  fullWidth
                  name="password"
                  label={t("Password")}
                  type="password"
                  id="password"
                  onChange={passwdOnChange}
                  inputProps={{pattern: passwdPattern}}
                  helperText={passwdHelperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={sended}
                  fullWidth
                  name="reenteredPassword"
                  label={t("Reentered Password")}
                  type="password"
                  id="reenteredPassword"
                  helperText={reenteredPasswdHelperText}
                  onChange={reenteredPasswdOnChange}
                  error={reenteredPasswdError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={false}
                  fullWidth
                  name="invitationCode"
                  label={t("Invitation Code (Optional)")}
                  id="invitationCode"
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required={sended}
                  fullWidth
                  id="code"
                  label={t("Verification Code")}
                  name="code"
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  id="verification"
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={handleOpen}
                  sx={{ mt: 0, mb: 0, minHeight: '70%', maxHeight: '70%', top: '15%' }}
                  disabled={!canSend}
                >
                  <small>{ seconds <= 0 ? `${sendText}` : `${seconds}s` }</small>
                </Button>
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
                >
                  <ReCAPTCHA
                    style={{ display: "inline-block" }}
                    sitekey={SITE_KEY}
                    onChange={handleRequestCode}
                    type="image"
                    theme="light"
                    ref={captchaRef}
                  />
                </Backdrop>
              </Grid>
            </Grid>
            <Button
              id="signup"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => { submited = true}}
            >
              {t("Sign Up")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  {t("Already have an account? Sign in")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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
