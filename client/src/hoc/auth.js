import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    // option: 
    // null -> 아무나 출입 가능
    // true -> 로그인한 유저만 출입이 가능한 페이지
    // false -> 로그인한 유저는 출입 불가능한 페이지
    // adminRoute = true: admin만 출입가능
    
    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            
            dispatch(auth()).then(response => {
                console.log(response)

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) { // option === true
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) { //어드민이 아닌데 어드민 전용페이지 들어가려고 할때
                        props.history.push('/') //랜딩페이지
                    } else {
                        if(option === false) { //로그인한 유저가 출입 불가능한 페이지에 가려고 할때
                            props.history.push('/') //랜딩페이지
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