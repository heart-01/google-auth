// import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useSnackbar } from "notistack";

// redux
// import { useAppDispatch } from '@/redux/store';
// import { setUser } from '@/redux/features/userSlice';

// action
// import { googleLogin } from '@/actions/auth';

function GoogleLoginButton() {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  // google login response
  const handleOnSuccessGoogle = async (response: CredentialResponse) => {
    const idToken = response.credential;

    // call google login api
    if (!idToken) {
      enqueueSnackbar("เกิดข้อผิดพลาดขณะทำการเข้าสู่ระบบ", {
        variant: "error",
      });

      return;
    }

    console.log({ idToken });

    // try {
    //   const google = await googleLogin(idToken);

    //   if (google.isFirstTimeLogin) {
    //     navigate(
    //       `/login/activate-account/success/?email=${google.user.email}/?name=${google.user.name}`,
    //     ); // navigate to success page
    //   } else {
    //     dispatch(setUser(google.user)); // set user in redux
    //     navigate(``); //  redirect to homepage
    //   }

    //   return;
    // } catch (err) {
    //   const error = err as {
    //     message: string;
    //     errorCode: string | number;
    //     statusCode: string;
    //     errors?: { field: string; message: string }[]; //recieved from validation error
    //   };
    //   enqueueSnackbar(error.message, { variant: "error" });

    //   return;
    // }
  };

  return (
    <GoogleLogin
      onSuccess={handleOnSuccessGoogle}
      theme="outline"
      type="standard"
      shape="circle"
      logo_alignment="center"
      width="366px"
    />
  );
}

export default GoogleLoginButton;
