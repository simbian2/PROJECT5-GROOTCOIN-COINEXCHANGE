import Link from 'next/link'
import Styled from 'styled-components'
import useInput from '../hooks/useInput'
import {useState} from 'react'
import {join_success} from '../api/api'
import Router from 'next/router'
import { user_url } from '../store/Allurl'





const join = () => {

    const userid = useInput('');
    const userpw = useInput('');
    const username = useInput('');
    const accountNo = useInput('');

    const [pwChk, setPwChk] = useState('');
    const [pwError, setPwError] = useState(false);



    const handlePassword = e => {
        const { value } = { ...e.target }
        setPwError(userpw.value !== value) // 1234 === 1234 ture
        setPwChk(value)
    }

    const checkAccountNo = e => {
        if (accountNo.value.length === 11) {
            return true
        } else {
            return false
        }

    }

    const check = e => {
            if (userid.value !== '' && 
            userpw.value !== '' && 
            userpw.value === pwChk && 
            pwChk !== '' && 
            username.value !== '' &&
            accountNo.value !== '' && 
            accountNo.value.length === 11 &&
            bigChk() == true &&
            smallChk() == true &&
            numChk() == true &&
            stChk() == true &&
            pw10Chk() ==true) {
                return true
            } else {
                return false
            }
        }

        const bigChk = () => {
        let big = ["A", "B", "C", "D", "E", "F", "G", 
                        "H", "I", "J","K","L","M","N","O",
                        "P","Q","R","S","T","U","V","W","X","Y","Z"];
        let check_big = 0;
        for (var i = 0; i < big.length; i++) {
            if ({ ...userpw }.value.indexOf(big[i]) != -1) {
                check_big = 1;
            }
        }
        if (check_big !== 0) {
            return true;
        }
    }

    const smallChk = () => {
        let small = ["a", "b", "c", "d", "e", "f", "g", 
                        "h", "i", "j","k","l","m","n","o",
                        "p","q","r","s","t","u","v","w","x","y","z"];
        let check_small = 0;
        for (var i = 0; i < small.length; i++) {
            if ({ ...userpw }.value.indexOf(small[i]) != -1) {
                check_small = 1;
            }
        }
        if (check_small !== 0) {
            return true;
        }
    }

    const numChk = () => {
        let number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let check_number = 0;
        for (var i = 0; i < number.length; i++) {
            if ({ ...userpw }.value.indexOf(number[i]) != -1) {
                check_number = 1;
            }
        }
        if (check_number !== 0) {
            return true;
        }
    }

    const stChk = () => {
        let st = ["!", "@", "#", "$", "%", "^", "&", "*"];
        let check_st = 0;
        for (var i = 0; i < st.length; i++) {
            if ({ ...userpw }.value.indexOf(st[i]) != -1) {
                check_st = 1;
            }
        }
        if (check_st !== 0) {
            return true;
        }
    }

    const pw10Chk = () => {
        if ({ ...userpw }.value.length > 10) {
            return true
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (userpw.value !== pwChk) {
            setPwError(true)
            return
        } else {
            setPwError(false)
        }

        join_success({userid:userid.value, username:username.value, userpw:userpw.value, account:accountNo.value, wallet:"info"})
        Router.push('/')
    }

    
    const [LoginCheck, setLoginCheck] = useState('---')

    const handleuseridCheck = async e => {
        e.preventDefault()
        console.log('?????? ??????')
        const options = {
            method:'GET'
        }

        const response = await fetch(`${user_url}/login_check?userid=${userid.value}`,options) //restful api 
        const result = await response.json()
        console.log(response)
        setLoginCheck(result)
        console.log(result.length)
    }

    return (
        <div id="box">
            <h1 className="signUpTitle">????????????</h1>
            <ul className="bigCheck">
                <li className="agerrBigCheck2">??? ????????????</li><li> ------------- </li> <li className="agreeBigCheck1">??? ????????????</li>
            </ul>

            <form onSubmit={handleSubmit} className="a">
                <label className="margin24 inputFont" label htmlFor="userid" >?????????</label>
                <input type="email" {...userid} onMouseOut = {handleuseridCheck} className="inputBox" name="userid" id="userid" placeholder="???????????? ????????? ????????? ??????" />
                <div className="idChk">{LoginCheck}</div>
                <label className="margin24 inputFont" label htmlFor="userpw" >????????????</label>
                <input type="password" {...userpw} className="inputBox" name="userpw" id="userpw" placeholder="???????????? ??????" />
                <ul className="passwordBox2">
                    {bigChk() ? <li className="chk">?????? ????????? ??????</li> : <li>?????? ????????? ??????</li>}
                    {smallChk() ? <li className="chk">?????? ????????? ??????</li> : <li>?????? ????????? ??????</li>}
                    {numChk() ? <li className="chk">?????? ??????</li> : <li>?????? ??????</li>}
                    {stChk() ? <li className="chk">???????????? ??????</li> : <li>???????????? ??????</li>}
                    {pw10Chk() ? <li className="chk">10??? ??????</li> : <li>10??? ??????</li>}
                </ul>
                <label className="margin24 inputFont" label htmlFor="pwChk" >???????????? ??????</label>
                <input type="password" value={pwChk} id="pwChk" onChange={handlePassword} className="inputBox" placeholder="???????????? ??????" />
                {pwError && <div className="error" style={{ color: 'red' }}>??????????????? ???????????? ????????????.</div>}

                <label className="margin24 inputFont" label htmlFor="username" >??????<br /></label>
                <input type="text" {...username} id="username" name="username" className="inputBox" placeholder="??????" />

                <label className="margin24 inputFont" label htmlFor="accountNo" >????????????<br /> </label>
                <input type="text" {...accountNo} className="inputBox" name="accountNo" id="accountNo" placeholder="???????????? ??????" maxLength="11" />
                {checkAccountNo() ? '' : <div className="error" style={{ color: 'red' }}>???????????? 11????????? ??????????????????.</div>}

                <br />


                {check() ? <input type = "submit" className="joinBigBtn" value = "??????" /> : ''}

            </form>
        </div>
    )
}

export default join