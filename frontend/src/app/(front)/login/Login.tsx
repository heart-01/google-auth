"use client";

import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

// mui
import { Box, Button, Divider, FormControl, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// internal component
import BaseTextField from "@/components/TextField";
import GoogleLoginButton from "@/components/GoogleLoginButton";

// type
export const credentialsLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "กรุณากรอกชื่อผู้ใช้งาน" })
    .max(255, { message: `ชื่อ-สกุลต้องมีไม่เกิน 255 ตัวอักษร` }),
  password: z.string().trim().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

export type CredentialsLoginValidationSchema = z.infer<
  typeof credentialsLoginSchema
>;

// validation form
import { z } from "zod";

// action
// import { localLogin } from '@/actions/auth';

// redux
// import { setUser } from '@/redux/features/userSlice';
// import { useAppDispatch } from '@/redux/store';

// scss
import "../../styles/Login.scss";

interface ICredentials {
  username: string;
  password: string;
}

const Login = () => {
  //   const navigate = useNavigate();
  //   const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [credentials, setCredentials] = useState<ICredentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { control, trigger, reset } = useForm({
    mode: "all",
    defaultValues: {} as CredentialsLoginValidationSchema,
    resolver: zodResolver(credentialsLoginSchema),
  });

  const handleCredentialsChange = (name: string, value: string | null) => {
    const fieldName = name;

    setCredentials({
      ...credentials,
      [fieldName]: value || null,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const passed = await trigger();

    if (passed) {
      try {
        // const user = await localLogin(credentials);

        // dispatch(setUser(user));
        // navigate(``);
        reset();
      } catch (err) {
        const error = err as {
          message: string;
          errorCode: string | number;
          statusCode: string;
          errors?: { field: string; message: string }[]; //recieved from validation error
        };
        enqueueSnackbar(error.message, { variant: "error" });
      }
    }
  };

  return (
    <Box className="login-container">
      <Box className="logo-area">
        <Typography className="logo-text">Logo</Typography>
      </Box>

      <Box className="login-form-title-container">
        <Typography className="welcome-text">ยินดีต้อนรับ</Typography>
        <Typography className="welcome-sub-text">
          เข้าสู่ระบบบัญชีของคุณ
        </Typography>
      </Box>

      <Box className="login-form-container">
        <FormControl sx={{ width: "366px", height: "104px", gap: "10px" }}>
          {/* Username */}
          <Controller
            control={control}
            name="username"
            defaultValue={credentials.username}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <BaseTextField
                placeholder="กรอกชื่อผู้ใช้งาน"
                label="ชื่อผู้ใช้งาน"
                name="username"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  handleCredentialsChange(e.target.name, e.target.value);
                }}
                error={Boolean(error)}
                helperText={error ? error.message : " "}
                required
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            defaultValue={credentials.password}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <BaseTextField
                placeholder="กรอกรหัสผ่าน"
                label="รหัสผ่าน"
                type={showPassword ? "text" : "password"}
                name="password"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  handleCredentialsChange(e.target.name, e.target.value);
                }}
                endIcon={showPassword ? <Visibility /> : <VisibilityOff />}
                onClickEndButton={handleShowPassword}
                error={Boolean(error)}
                helperText={error ? error.message : " "}
                required
              />
            )}
          />
        </FormControl>
      </Box>

      {/* Login Button*/}
      <Button type="submit" className="login-button" onClick={handleLogin}>
        <Typography className="login-button-label">Login</Typography>
      </Button>

      <Box className="activate-account-container">
        <Typography className="activate-account-text">
          ต้องการเปิดใช้งานบัญชีของคุณ?
        </Typography>
        <Typography className="activate-account-button-text">
          สมัครสมาชิก
        </Typography>
      </Box>

      <Divider orientation="horizontal" className="or-divider">
        หรือ
      </Divider>

      <GoogleLoginButton />
    </Box>
  );
};

export default Login;
