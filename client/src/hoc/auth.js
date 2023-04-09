import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            
            dispatch(auth()).then(response => {

                if (!response.payload.isAuth) {
                    //로그인 하지 않은 상태
                    if(option) {
                        navigate('/login');
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } else {
                        if(option === false){
                            navigate('/')
                        }
                    }
                }

            })

        }, [])

        return (
            <SpecificComponent />
        )

    }

    return AuthenticationCheck

}