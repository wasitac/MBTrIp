import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [EMail, setEmail] = useState("")
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: EMail,
      name: Name,
      password: Password
    }

    dispatch(registerUser(body))
    //회원가입에 성공하면 로그인페이지로 이동
      .then(response => {
        if(response.payload.success) {
          alert("회원가입이 완료되었습니다.");
          navigate("/login");
        } else {
          alert("Failed to sing up")
        }
      })
    
  }


  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      width: '100%', height: '100vh'
    }}>
        <form sytle={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}
        >
          <label>Email</label>
          <input type="email" value={EMail} onChange={onEmailHandler} />
          <br />
          <label>Name</label>
          <input type="text" value={Name} onChange={onNameHandler} />
          <br />
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <br />
          <label>Comfirm Password</label>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
          <br />
          <button>
            Sign up
          </button>
        </form>
    </div>
  )
}

export default RegisterPage